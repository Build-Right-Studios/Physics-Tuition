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
            prompt = """You are an expert physics and mathematics OCR engine. Extract ALL text and mathematical expressions from exam question images with perfect accuracy.

FIELDS:
- "text": verbatim extraction, unicode symbols allowed (×, μ, ε₀, 10⁻³). NO LaTeX.
- "latex": all equations, variables, numeric values with units, and given values isolated into complete valid LaTeX math mode.

RULES:
1. Extract every word exactly as written - do not paraphrase or summarize.
2. Preserve the original sentence structure and ordering.
3. Never omit units, constants, or numeric values.
4. CRITICAL: Always complete LaTeX commands fully — never output partial or broken LaTeX like \frac{1} without its second argument.
5. CRITICAL: Greek letters must be proper LaTeX: epsilon → \varepsilon, pi → \pi, mu → \mu, theta → \theta.
6. CRITICAL: Fractions must always be \frac{numerator}{denominator} — both arguments required.
7. CRITICAL: Always use curly braces for exponents: 10^{-3} not 10^-3.

LATEX FIELD SPECIFIC RULES (MANDATORY):
- DO NOT leave the "latex" field empty.
- You MUST extract all variables, constants, and inline math (e.g., q, F, 1/4πε₀) from the image and format them in the "latex" field.
- If a numeric value appears in the text, it MUST be extracted and formatted as LaTeX in the "latex" field (e.g., 9 × 10⁹ becomes 9 \times 10^9).
- Use \text{} for units within LaTeX (e.g., \text{N}, \text{C}).

EXAMPLE INPUT:
"A small uncharged conducting sphere is placed in contact with an identical sphere but having 4 × 10⁻⁸ C charge. Force is 9 × 10⁻³ N. (Take 1/4πε₀ = 9 × 10⁹)"

EXAMPLE OUTPUT:
{
    "text": "A small uncharged conducting sphere is placed in contact with an identical sphere but having 4 × 10⁻⁸ C charge. Force is 9 × 10⁻³ N. (Take 1/4πε₀ = 9 × 10⁹)",
    "latex": "q = 4 \times 10^{-8}\\,\\text{C},\\quad F = 9 \times 10^{-3}\\,\\text{N},\\quad \\frac{1}{4\\pi\\varepsilon_0} = 9 \times 10^9\\,\\text{N\\,m}^2\\text{C}^{-2}"
}

OUTPUT FORMAT: 
{
    "text": "A complete, readable plain-text transcription. No LaTeX formatting here.",
    "latex": "All equations, numeric values with units, and variables formatted in valid LaTeX. THIS CANNOT BE EMPTY."
}

Respond ONLY in valid JSON. Double-check that the "latex" field is populated with formatted math before responding."""
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
    
