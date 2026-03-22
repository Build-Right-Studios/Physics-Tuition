#just for testing purpose (alternative for ocr)

from openai import AsyncOpenAI
from app.core.config import settings
import base64
import json
import logging

logger = logging.getLogger(__name__)

PROMPT = r"""You are an expert OCR engine for JEE/NEET physics and mathematics exam questions.

Your task is to extract ALL text and mathematical content from the image with 100% accuracy.

CRITICAL RULES for LaTeX extraction:
- Use proper LaTeX for ALL mathematical symbols — never use plain text for math
- Fractions: \frac{numerator}{denominator}
- Integrals: \int_{lower}^{upper} expression \, dx
- Derivatives: \frac{d}{dt}, \frac{d^2y}{dx^2}
- Vectors: \vec{F}, \hat{r}, \mathbf{v}
- Greek letters: \alpha, \beta, \gamma, \delta, \omega, \theta, \phi, \lambda, \mu, \sigma, \pi, \epsilon
- Superscripts: x^{2}, e^{-t/\tau}
- Subscripts: v_{0}, F_{net}, a_{x}
- Square roots: \sqrt{x}, \sqrt[n]{x}
- Absolute value: |x| or \left|x\right|
- Summation: \sum_{i=1}^{n}
- Products: \prod_{i=1}^{n}
- Limits: \lim_{x \to 0}
- Infinity: \infty
- Partial derivatives: \frac{\partial f}{\partial x}
- Cross product: \times
- Dot product: \cdot
- Proportional: \propto
- Approximately: \approx
- Units: write units in \text{} e.g. \text{m/s}, \text{kg}
- Trigonometric: \sin, \cos, \tan, \sin^{-1}, etc.
- Logarithms: \log, \ln
- Matrices/determinants: use \begin{vmatrix}...\end{vmatrix}

OUTPUT FORMAT — return ONLY valid JSON, no markdown fences:
{
    "text": "complete plain-text transcription of the question including all answer options (A/B/C/D) — replace math symbols with readable equivalents like sqrt, integral, pi, etc.",
    "latex": "complete LaTeX representation of the ENTIRE question including all equations and all answer options formatted with proper LaTeX commands"
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
                max_tokens=1500,
                temperature=0.0,
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
