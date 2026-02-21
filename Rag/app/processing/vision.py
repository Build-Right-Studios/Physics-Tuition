from app.services.openai_client import OpenAIClient
import logging

logger = logging.getLogger(__name__)

class VisionHandler:
    
    def __init__(self):
        self.openai = OpenAIClient()
    
    async def analyze(self, image_bytes: bytes) -> dict:
        """extra layer for diagram analysis, to confirm the presence and details of the diagram"""
        logger.info("starting vision analysis")
        result = await self.openai.analyze_image(image_bytes)
        logger.info("finished vision analysis")
        return result