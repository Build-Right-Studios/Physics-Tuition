import httpx
import base64
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class MathpixClient:
    def __init__(self):
        self.base_url = "" # FILL IN LATER
        self.headers = {
            "app_id": settings.MATHPIX_APP_ID,
            "app_key": settings.MATHPIX_APP_KEY
        }

    async def process_image(self, image_bytes: bytes) -> dict:
        image_base64 = base64.b64encode(image_bytes).decode()

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.base_url}/text",
                headers=self.headers,
                json={
                    "src": f"data:image/jpeg;base64,{image_base64}",
                    "formats": ["text", "latex_styled"],
                    "ocr": ["math", "text"]
                }
            )

        response.raise_for_status()
        data = response.json()

        return {
            "text": data.get("text", ""),
            "latex": data.get("latex_styled", "")
        }