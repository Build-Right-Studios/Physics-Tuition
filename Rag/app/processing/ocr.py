from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class OCRHandler:
    def __init__(self):
        if settings.DEV and settings.GROQ_API_KEY:
            from app.services.groq_ocr_client import GroqOCRClient
            self.backend = GroqOCRClient()
            logger.info("OCR: using Groq vision (DEV mode)")
        else:
            from app.services.mathpix_client import MathpixClient
            self.backend = MathpixClient()
            logger.info("OCR: using Mathpix (production)")

    async def process(self, image_bytes: bytes) -> dict:
        """Process image through OCR and return text and latex in a dict"""
        logger.info("starting OCR processing")
        result = await self.backend.process_image(image_bytes)
        logger.info("finished OCR processing")
        return result