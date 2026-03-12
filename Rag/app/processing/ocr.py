from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class OCRHandler:
    def __init__(self):
        if settings.DEV and getattr(settings, "GROQ_API_KEY", None):
            from app.services.groq_ocr_client import GroqOCRClient
            self.backend = GroqOCRClient()
            logger.info("OCR: using Groq vision (DEV mode)")
            return

        if getattr(settings, "OPENAI_API_KEY", None):
            from app.services.openai_client import OpenAIClient
            self.backend = OpenAIClient()
            logger.info("OCR: using OpenAI fallback (production)")
            return

        raise RuntimeError(
            "No OCR backend configured. "
            "Set GROQ_API_KEY (DEV) or OPENAI_API_KEY (production)."
        )

    async def process(self, image_bytes: bytes) -> dict:
        logger.info("starting OCR processing")
        result = await self.backend.process_image(image_bytes)
        logger.info("finished OCR processing")
        return result