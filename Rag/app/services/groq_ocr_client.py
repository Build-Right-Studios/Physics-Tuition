#just for testing purpose (alternative for ocr)

from openai import AsyncOpenAI
from app.core.config import settings
import base64
import json
import logging

logger = logging.getLogger(__name__)

PROMPT = """You are an expert physics/maths OCR engine.
Extract all text and LaTeX from this exam question image.

Respond ONLY in JSON:
{
    "text": "plain english text of the question",
    "latex": "full latex representation of any math/equations (empty string if none)"
}"""


class GroqOCRClient:
    """OCR backend for DEV mode """

    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1",
        )
        self.model = "meta-llama/llama-4-scout-17b-16e-instruct"

    async def process_image(self, image_bytes: bytes) -> dict:
        image_b64 = base64.b64encode(image_bytes).decode()

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": PROMPT},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"},
                            },
                        ],
                    }
                ],
                max_tokens=512,
            )

            raw = response.choices[0].message.content
            # Strip markdown code fences if present
            raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()

            result = _safe_parse(raw)
            return {
                "text": result.get("text", ""),
                "latex": result.get("latex", ""),
            }

        except Exception as e:
            logger.error(f"GroqOCRClient error: {e}")
            raise


def _safe_parse(raw: str) -> dict:
    """Parse JSON from model output robustly, handling LaTeX backslashes."""
    import re

    # First try standard parse
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # Extract text and latex fields individually with regex to avoid
    # backslash escape issues in the latex value
    def extract_field(field: str) -> str:
        # Match: "field": "value" where value may contain escaped or raw backslashes
        pattern = rf'"{field}"\s*:\s*"((?:[^"\\]|\\.)*)"'
        m = re.search(pattern, raw, re.DOTALL)
        if m:
            # Unescape standard JSON escapes only
            val = m.group(1)
            val = val.replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t")
            return val
        return ""

    return {"text": extract_field("text"), "latex": extract_field("latex")}
