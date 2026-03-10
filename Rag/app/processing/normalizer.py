import re
class Normalizer:

    def normalize(self, text: str = "", latex: str = "", diagram: str = "") -> dict:
        clean_text = self._normalize_text(text) or ""
        clean_latex = self._normalize_latex(latex) or ""
        concepts = self._extract_concept(clean_text)
        math_entities = self._extract_math_entities(clean_latex)

        parts = [p for p in [clean_text, clean_latex, " ".join(concepts), " ".join(math_entities)] if p]
        searchable_text = " ".join(parts)

        if diagram:
            searchable_text += " " + diagram

        return {
            "text": clean_text,
            "searchable_text": searchable_text,
            "concept": concepts[0] if concepts else None,
            "critical_terms": concepts,
            "math_entities": math_entities,
        }

    def _normalize_text(self, text: str) -> str:
        if not text:
            return ""
        text = text.lower().strip()
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s.,;:?!()\-+=/°]', '', text)
        return text

    def _normalize_latex(self, latex: str) -> str:
        if not latex:
            return ""
        latex = latex.strip()
        latex = re.sub(r'\\(left|right|displaystyle|textstyle)\b', '', latex)
        latex = re.sub(r'\\,|\\;|\\!|\\quad|\\qquad', ' ', latex)
        latex = re.sub(r'\s+', ' ', latex)
        return latex

    def _extract_concept(self, text: str) -> list[str]:
        if not text:
            return []

        physics_keywords = [
            "force", "energy", "momentum", "velocity", "acceleration", "work", "power",
            "torque", "gravity", "friction", "tension", "pressure", "wave", "frequency",
            "current", "voltage", "resistance", "capacitance", "inductance", "magnetic",
            "electric field", "potential", "kinetic", "thermal", "heat", "temperature",
            "optics", "lens", "mirror", "refraction", "diffraction", "interference",
            "circuit", "resistor", "capacitor", "inductor", "diode", "transistor",
            "oscillation", "pendulum", "spring", "shm", "rotation", "inertia",
            "projectile", "collision", "impulse", "angular", "centripetal",
            "coulomb", "gauss", "faraday", "ampere", "ohm",
        ]

        chemistry_keywords = [
            "reaction", "equilibrium", "acid", "base", "ph", "oxidation", "reduction",
            "mole", "concentration", "solution", "titration", "buffer", "electrode",
            "organic", "inorganic", "polymer", "isomer", "alkane", "alkene", "alkyne",
            "benzene", "aldehyde", "ketone", "alcohol", "ether", "ester", "amine",
            "bonding", "hybridization", "orbital", "electron", "proton", "neutron",
            "periodic", "electronegativity", "ionization", "enthalpy", "entropy",
        ]

        maths_keywords = [
            "integral", "derivative", "limit", "function", "matrix", "determinant",
            "vector", "probability", "permutation", "combination", "sequence", "series",
            "trigonometry", "logarithm", "exponential", "polynomial", "equation",
            "parabola", "ellipse", "hyperbola", "circle", "tangent", "normal",
            "continuity", "differentiable", "maxima", "minima", "area", "volume",
        ]

        all_keywords = physics_keywords + chemistry_keywords + maths_keywords
        text_lower = text.lower()
        found = [kw for kw in all_keywords if kw in text_lower]
        return found

    def _extract_math_entities(self, latex: str) -> list[str]:
        if not latex:
            return []

        entities = []

        variables = re.findall(r'\\(?:alpha|beta|gamma|delta|theta|omega|lambda|mu|sigma|phi|psi|epsilon|rho|tau|pi)\b', latex)
        entities.extend(variables)

        functions = re.findall(r'\\(?:sin|cos|tan|cot|sec|csc|log|ln|exp|sqrt|lim|sum|prod|int)\b', latex)
        entities.extend(functions)

        fractions = re.findall(r'\\frac\{[^}]+\}\{[^}]+\}', latex)
        entities.extend(fractions)

        return list(set(entities))
