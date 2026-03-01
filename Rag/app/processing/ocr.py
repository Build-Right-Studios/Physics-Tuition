from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class OCRHandler:
    def __init__(self):
        if settings.DEV and settings.GROQ_API_KEY:   # using groq for now as mathpix api not available
            from app.services.groq_ocr_client import GroqOCRClient
            self.backend = GroqOCRClient()
            logger.info("OCR: using Groq vision (DEV mode)")
            return

        if settings.MATHPIX_APP_KEY and settings.MATHPIX_APP_ID:
            from app.services.mathpix_client import MathpixClient
            self.backend = MathpixClient()
            logger.info("OCR: using Mathpix (production)")
            return

        raise RuntimeError(
            "No OCR backend configured. "
            "Set GROQ_API_KEY (DEV) or MATHPIX_URL + MATHPIX_APP_ID."
        )

    async def process(self, image_bytes: bytes) -> dict:
        logger.info("starting OCR processing")
        result = await self.backend.process_image(image_bytes)
        logger.info("finished OCR processing")
        return result