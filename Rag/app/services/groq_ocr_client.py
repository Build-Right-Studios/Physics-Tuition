#just for testing purpose (alternative for ocr)

from openai import AsyncOpenAI
from app.core.config import settings
import base64
import json
import logging

logger = logging.getLogger(__name__)

PROMPT = r"""You are an expert mathematical typesetter and OCR engine specializing in JEE/NEET physics and mathematics exam questions.

Your task is to extract ALL text and mathematical content from the image with 100% accuracy and output it as structured data.

CRITICAL STRUCTURAL RULES (LaTeX Formulation):
1. Natural Mixing: Write standard English prose normally. ONLY use math mode (enclose in `$` for inline, or `$$` for display) for variables, numbers, formulas, equations, and standalone symbols. 
2. NO Global Math Mode: NEVER wrap an entire sentence or paragraph in math mode. Use math mode strictly for the mathematical elements.
3. Units: Keep units inside the math mode with their corresponding values, but use `\mathrm{}` or `\text{}` to prevent them from being italicized (e.g., `$9.8 \mathrm{m/s}^2$`).
4. Proper Macros: Always use proper LaTeX macros for operators and functions to ensure correct formatting (e.g., use `\sin`, `\ln`, `\lim`, `\int`, `\times`, `\sum` rather than plain text equivalents inside math mode).
5. Vectors and Matrices: Use `\vec{}` or `\mathbf{}` for vectors. Use `\begin{vmatrix}...\end{vmatrix}` or `\begin{bmatrix}...\end{bmatrix}` for matrices and determinants.

CRITICAL JSON RULES (Escaping):
1. You must output ONLY valid JSON. Absolutely no markdown formatting blocks (like ```json), no preamble, and no conversational text.
2. Double Escaping: Because the output is a JSON string, you MUST double-escape your LaTeX backslashes so the JSON parser doesn't break. 
   - Write `\\frac{1}{2}` instead of `\frac{1}{2}`.
   - Write `\\sin\\theta` instead of `\sin\theta`.
   - Write `\\mathrm{kg}` instead of `\mathrm{kg}`.

OUTPUT FORMAT:
{
    "text": "A complete, readable plain-text transcription of the question including all answer options. Replace math symbols with highly readable text equivalents (e.g., 'integral of x dx', 'sqrt(x)', 'pi', 'alpha'). Do not use LaTeX formatting here.",
    "latex": "The perfectly formatted string mixing standard English text and properly double-escaped LaTeX math mode, including all equations and all answer options."
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
