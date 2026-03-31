#just for testing purpose (alternative for ocr)

from openai import AsyncOpenAI
from app.core.config import settings
import base64
import json
import logging

logger = logging.getLogger(__name__)

prompt = """You are an expert physics and mathematics OCR engine. Extract ALL text and mathematical expressions from exam question images with perfect accuracy.

FIELDS:
- "text": verbatim extraction, unicode symbols allowed (×, μ, ε₀, 10⁻³). NO LaTeX.
- "latex": all equations and given values in complete valid LaTeX.

RULES:
1. Extract every word exactly as written - do not paraphrase or summarize
2. Preserve the original sentence structure and ordering  
3. Never omit units, constants, or numeric values
4. CRITICAL: Always complete LaTeX commands fully — never output partial or broken LaTeX like \\frac{1} without its second argument
5. CRITICAL: Greek letters must be proper LaTeX: epsilon → \\varepsilon, pi → \\pi, mu → \\mu, theta → \\theta
6. CRITICAL: Fractions must always be \\frac{numerator}{denominator} — both arguments required
7. CRITICAL: Always use curly braces for exponents: 10^{-3} not 10^-3

COMMON PATTERNS TO HANDLE CORRECTLY:
- Coulomb's constant: \\frac{1}{4\\pi\\varepsilon_0} = 9 \\times 10^9\\,\\text{N m}^2\\text{C}^{-2}
- Micro prefix: μC → \\mu\\text{C} in latex, μC in text
- Negative exponents: 10⁻³ stays as 10⁻³ in text, becomes 10^{-3} in latex
- Subscripts: q₀ stays as q₀ in text, becomes q_0 in latex

EXAMPLE INPUT: (image showing)
"Q1. As shown in the figure, two equal point charges (q₀ = +2 μC) are placed on an inclined plane. Mass of each charge is 20 g. For equilibrium height h = x × 10⁻³ m. Find x. (Take 1/4πε₀ = 9 × 10⁹ N m² C⁻², g = 10)"

EXAMPLE OUTPUT:
{
    "text": "Q1. As shown in the figure, two equal point charges (q₀ = +2 μC) are placed on an inclined plane. Mass of each charge is 20 g. For equilibrium height h = x × 10⁻³ m. Find x. (Take 1/4πε₀ = 9 × 10⁹ N m² C⁻², g = 10)",
    "latex": "q_0 = +2\\,\\mu\\text{C},\\quad m = 20\\,\\text{g},\\quad h = x \\times 10^{-3}\\,\\text{m},\\quad \\frac{1}{4\\pi\\varepsilon_0} = 9 \\times 10^9\\,\\text{N\\,m}^2\\text{C}^{-2},\\quad g = 10\\,\\text{m/s}^2"
}

Respond ONLY in valid JSON with exactly two keys: "text" and "latex". No other keys. Double-check all LaTeX commands are complete and valid before responding."""

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
                            {"type": "text", "text": prompt},
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
