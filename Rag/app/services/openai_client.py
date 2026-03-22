from openai import AsyncOpenAI
from app.core.config import settings
import base64
import json
import logging

logger = logging.getLogger(__name__)

class OpenAIClient:
    """Handles both Groq (for OCR) and OpenAI (for vision) API calls"""
    
    def __init__(self):
        self.groq_client = AsyncOpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
        
        self.openai_client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY
        )
    
    async def create_embedding(self, text: str) -> list[float]:
        """Generate embedding for text using OpenAI"""
        if not getattr(settings, "OPENAI_API_KEY", None):
            logger.warning("No OPENAI_API_KEY found. Mocking embedding.")
            import random
            import hashlib
            seed_val = int(hashlib.md5(text.encode('utf-8') if text else b"").hexdigest(), 16)
            random.seed(seed_val)
            dim = getattr(settings, "VECTOR_SIZE", 1536)
            return [random.uniform(-1, 1) for _ in range(dim)]
        try:
            response = await self.openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text,
                dimensions=getattr(settings, "VECTOR_SIZE", 768)
            )
            
            return response.data[0].embedding
            
        except Exception as e:
            logger.error(f"Embedding error: {str(e)}")
            raise
    
    async def analyze_image(self, image_bytes: bytes) -> dict:
        """
        Analyze image for diagrams/circuits using OpenAI Vision
        """
        if not getattr(settings, "OPENAI_API_KEY", None):
            logger.warning("No OPENAI_API_KEY found. Mocking vision analysis.")
            return {
                "has_diagram": False,
                "description": "Mocked vision description",
                "circuit_topology": None,
                "diagram_type": "none"
            }
        try:
            image_base64 = base64.b64encode(image_bytes).decode()
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",  # OpenAI vision model
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Analyze this JEE/NEET question image:

1. Is there a diagram/circuit/graph? (yes/no)
2. If yes, describe it in detail:
   - For circuits: list components, describe topology (series/parallel)
   - For physics: describe the setup (inclined plane, pulley, etc.)
   - For graphs: describe axes and curves

3. Return ONLY valid JSON (no markdown, no extra text):
{
    "has_diagram": true/false,
    "description": "detailed description",
    "circuit_topology": "series_2_resistors_1_battery" (if circuit, otherwise null),
    "diagram_type": "circuit/physics_setup/graph/none"
}"""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            
            try:
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                result = json.loads(content)
                
                if "has_diagram" not in result:
                    result["has_diagram"] = False
                if "description" not in result:
                    result["description"] = "No description provided"
                if "diagram_type" not in result:
                    result["diagram_type"] = "none"
                
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse JSON response: {e}")
                result = {
                    "has_diagram": False,
                    "description": content,
                    "circuit_topology": None,
                    "diagram_type": "none"
                }
            
            logger.info("Vision analysis successful")
            return result
            
        except Exception as e:
            logger.error(f"Vision error: {str(e)}")
            raise
            
    async def process_image(self, image_bytes: bytes) -> dict:
        """OCR fallback using OpenAI when DEV=False """
        if not getattr(settings, "OPENAI_API_KEY", None):
            logger.warning("No OPENAI_API_KEY found. Mocking OCR fallback.")
            return {"text": "mock OCR text", "latex": ""}
            
        try:
            image_base64 = base64.b64encode(image_bytes).decode()
            prompt = r"""You are an expert OCR engine for JEE/NEET physics and mathematics exam questions.

Your task is to extract ALL text and mathematical content from the image with 100% accuracy.

CRITICAL RULES for LaTeX extraction:
- Use proper LaTeX for ALL mathematical symbols — never use plain text for math
- Fractions: \frac{numerator}{denominator}
- Integrals: \int_{lower}^{upper} expression \, dx
- Derivatives: \frac{d}{dt}, \frac{d^2y}{dx^2}
- Vectors: \vec{F}, \hat{r}, \mathbf{v}
- Greek letters: \alpha, \beta, \gamma, \delta, \omega, \theta, \phi, \lambda, \mu, \sigma, \pi, \epsilon
- Superscripts: x^{2}, e^{-t/\tau}
- Subscripts: v_{0}, F_{net}, a_{x}
- Square roots: \sqrt{x}, \sqrt[n]{x}
- Absolute value: |x| or \left|x\right|
- Summation: \sum_{i=1}^{n}
- Products: \prod_{i=1}^{n}
- Limits: \lim_{x \to 0}
- Infinity: \infty
- Partial derivatives: \frac{\partial f}{\partial x}
- Cross product: \times
- Dot product: \cdot
- Proportional: \propto
- Approximately: \approx
- Units: write units in \text{} e.g. \text{m/s}, \text{kg}
- Trigonometric: \sin, \cos, \tan, \sin^{-1}, etc.
- Logarithms: \log, \ln
- Matrices/determinants: use \begin{vmatrix}...\end{vmatrix}

OUTPUT FORMAT — return ONLY valid JSON, no markdown fences:
{
    "text": "complete plain-text transcription of the question including all answer options (A/B/C/D) — replace math symbols with readable equivalents like sqrt, integral, pi, etc.",
    "latex": "complete LaTeX representation of the ENTIRE question including all equations and all answer options formatted with proper LaTeX commands"
}"""
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}
                            }
                        ]
                    }
                ],
                max_tokens=1500,
                temperature=0.0
            )
            
            content = response.choices[0].message.content.strip()
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            try:
                result = json.loads(content)
            except json.JSONDecodeError:
                result = {"text": content, "latex": ""}
                
            return {
                "text": result.get("text", ""),
                "latex": result.get("latex", "")
            }
            
        except Exception as e:
            logger.error(f"OpenAI OCR error: {str(e)}")
            raise
    
    async def verify_duplicate(self, q1: dict, q2: dict) -> dict:
        """
        LLM verification for duplicate detection using Groq
        (Text-only, no images, so Groq works fine)
        """
        try:
            prompt = f"""Compare these two questions:

Question 1:
LaTeX: {q1.get('latex', 'N/A')}
Text: {q1.get('text', 'N/A')}
Diagram: {q1.get('diagram_description', 'None')}

Question 2:
LaTeX: {q2.get('latex', 'N/A')}
Text: {q2.get('text', 'N/A')}
Diagram: {q2.get('diagram_description', 'None')}

Are these the same question or asking the same thing?
Focus MAINLY on the question text and concept.
Diagram descriptions may vary slightly due to AI interpretation - ignore minor diagram differences.
Consider duplicates if:
1. Same core concept/principle being tested
2. Same or very similar question text
3. Diagram topology is similar (ignore minor description differences)

Respond ONLY in valid JSON (no markdown):
{{
    "is_duplicate": true/false,
    "confidence": "high/medium/low",
    "reason": "brief explanation"
}}"""
            
            if not settings.DEV:
                response = await self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=200,
                    temperature=0.1
                )
            else:
                response = await self.groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile", 
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=200,
                    temperature=0.1
                )
            
            content = response.choices[0].message.content
            logger.info(f"LLM verification response: {content}")
            
            try:
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                result = json.loads(content)
            except json.JSONDecodeError:
                result = {
                    "is_duplicate": False,
                    "confidence": "low",
                    "reason": "Failed to parse LLM response"
                }
            
            return result
            
        except Exception as e:
            logger.error(f"LLM verification error: {str(e)}")
            raise

    async def extract_options(self, image_bytes: bytes) -> dict:
        try:
            image_base64 = base64.b64encode(image_bytes).decode()
            
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",  
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Extract the 4 MCQ options from this image.

    Instructions:
    1. Identify options labeled A, B, C, D (or 1, 2, 3, 4)
    2. Extract the complete text for each option
    3. If options contain LaTeX/math, preserve it
    4. Return ONLY valid JSON (no markdown, no extra text)

    Format:
    {
        "option_a": "complete text of option A",
        "option_b": "complete text of option B", 
        "option_c": "complete text of option C",
        "option_d": "complete text of option D",
        "has_options": true
    }

    If no options found, return:
    {
        "option_a": "",
        "option_b": "",
        "option_c": "",
        "option_d": "",
        "has_options": false
    }"""
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=500
            )
            
            content = response.choices[0].message.content
            
            try:
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                result = json.loads(content)
                
                if "option_a" not in result:
                    result["option_a"] = ""
                if "option_b" not in result:
                    result["option_b"] = ""
                if "option_c" not in result:
                    result["option_c"] = ""
                if "option_d" not in result:
                    result["option_d"] = ""
                if "has_options" not in result:
                    result["has_options"] = False
                    
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse options JSON: {e}")
                result = {
                    "option_a": "",
                    "option_b": "",
                    "option_c": "",
                    "option_d": "",
                    "has_options": False
                }
            
            logger.info("Options extraction successful")
            return result
            
        except Exception as e:
            logger.error(f"Options extraction error: {str(e)}")
            raise
    
