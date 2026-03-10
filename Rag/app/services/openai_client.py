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
                input=text
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
    
    async def verify_duplicate(self, q1: dict, q2: dict) -> dict:
        """
        LLM verification for duplicate detection using Groq
        (Text-only, no images, so Groq works fine)
        """
        try:
            prompt = f"""Compare these two JEE questions:

Question 1:
LaTeX: {q1.get('latex', 'N/A')}
Text: {q1.get('text', 'N/A')}
Diagram: {q1.get('diagram_description', 'None')}

Question 2:
LaTeX: {q2.get('latex', 'N/A')}
Text: {q2.get('text', 'N/A')}
Diagram: {q2.get('diagram_description', 'None')}

Are these duplicates? Consider:
1. Same concept/principle
2. Same numerical values
3. Same diagram topology

Respond ONLY in valid JSON (no markdown):
{{
    "is_duplicate": true/false,
    "confidence": "high/medium/low",
    "reason": "brief explanation"
}}"""
            
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