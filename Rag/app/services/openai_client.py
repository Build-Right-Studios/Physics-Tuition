from openai import AsyncOpenAI
from app.core.config import settings
import base64
import logging

logger = logging.getLogger(__name__)

class OpenAIClient:

    def __init__(self):
        if settings.DEV and settings.GROQ_API_KEY:
            self.client = AsyncOpenAI(
                api_key=settings.GROQ_API_KEY,
                base_url="https://api.groq.com/openai/v1",
            )
            self.chat_model = "llama-3.3-70b-versatile"
        else:
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            self.chat_model = "gpt-4o-mini"

        self._embedding_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def create_embedding(self, text: str) -> list[float]:
        try:
            response = await self._embedding_client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            
            return response.data[0].embedding
            
        except Exception as e:
            logger.error(f"Embedding error: {str(e)}")
            raise
    
    async def analyze_image(self, image_bytes: bytes) -> dict:
        """
        Analyze image for diagrams/circuits
        
        Returns:
        {
            "description": "Circuit with 2 resistors...",
            "has_diagram": true,
            "circuit_topology": "series_2_resistors_1_battery"
        }
        """
        try:
            image_base64 = base64.b64encode(image_bytes).decode()
            
            response = await self.client.chat.completions.create(
                model=self.chat_model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": """Analyze this exam question image.

Your task is to identify and describe any visual content present.

1. Is there any diagram, figure, graph, structure, or illustration? (yes/no)

2. If yes, describe it in a subject-agnostic way:
   - For circuits: components and topology
   - For graphs: axes, curves, relationships
   - For geometry: shapes, dimensions, relations
   - For chemistry: molecules, bonds, reaction setups
   - For biology: organs, cells, labeled structures
   - For physics setups: forces, motion, constraints

3. Do NOT rewrite question text or equations.
4. Focus only on what is visually present.

Return ONLY valid JSON in this format:
{
  "has_diagram": true/false,
  "diagram_type": "circuit/graph/geometry/chemistry/biology/physics_setup/none",
  "description": "clear structural description",
  "topology_or_structure": "concise normalized identifier if applicable"
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
            
            import json
            content = response.choices[0].message.content
            
            # Parse JSON from response
            result = json.loads(content)
            
            logger.info("Vision analysis successful")
            return result
            
        except Exception as e:
            logger.error(f"Vision error: {str(e)}")
            raise
    
    async def verify_duplicate(self, q1: dict, q2: dict) -> dict:
        try:
            prompt = f"""Compare these two JEE questions:

Question 1:
LaTeX: {q1['latex']}
Text: {q1['text']}
Diagram: {q1.get('diagram_description', 'None')}

Question 2:
LaTeX: {q2['latex']}
Text: {q2['text']}
Diagram: {q2.get('diagram_description', 'None')}

Are these duplicates? Consider:
1. Same concept/principle
2. Same numerical values
3. Same diagram topology

Respond ONLY in JSON:
{{
    "is_duplicate": true/false,
    "confidence": "high/medium/low",
    "reason": "brief explanation"
}}"""
            
            response = await self.client.chat.completions.create(
                model=self.chat_model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200
            )
            
            import json
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"LLM verification error: {str(e)}")
            raise