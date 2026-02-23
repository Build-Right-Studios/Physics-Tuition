class Normalizer:

    def normalize(self, text: str, latex: str = "") -> str:
        clean_text = self._normalize_text(text) or ""
        clean_latex = self._normalize_latex(latex) or ""
        concepts = self._extract_concept(clean_text) or []
        math_entities = self._extract_math_entities(clean_latex) or []

        parts = [p for p in [clean_text, clean_latex, " ".join(concepts), " ".join(math_entities)] if p]
        return " ".join(parts)

    def _normalize_text(self, text: str) -> str:
        pass

    def _normalize_latex(self, latex: str) -> str:
        pass

    def _extract_concept(self, text: str) -> list[str]:
        pass

    def _extract_math_entities(self, latex: str) -> list[str]:
        pass
