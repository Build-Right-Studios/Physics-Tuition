from app.services.mathpix_client import MathPixClient
import logging

logger = logging.getLogger(__name__)

class OCRHandler:
    def __init__(self):
        self.mathpix = MathPixClient()
    
    async def process(self, image_bytes: bytes) -> dict:
        """used to process image through ocr and return text and latex in a dict"""
        logger.info("starting OCR processing")
        result = await self.mathpix.process_image(image_bytes)
        logger.info("finished OCR processing")
        return result