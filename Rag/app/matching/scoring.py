WEIGHTS = {
    "physics": {
        "vector": 0.30,
        "latex": 0.20,
        "circuit": 0.40,
        "concept": 0.10,
    },
    "chemistry": {
        "vector": 0.35,
        "latex": 0.35,
        "circuit": 0.00,
        "concept": 0.30,
    },
    "maths": {
        "vector": 0.25,
        "latex": 0.60,
        "circuit": 0.00,
        "concept": 0.15,
    },
    "biology": {
        "vector": 0.40,
        "latex": 0.20,
        "circuit": 0.00,
        "concept": 0.40,
    },
}

DEFAULT_WEIGHTS = {
    "vector": 0.40,
    "latex": 0.35,
    "circuit": 0.00,
    "concept": 0.25,
}

class SimilarityScorer:

    def combine_scores(self, vector_score: float, sscores: dict, subject: str) -> float:
        w = WEIGHTS.get(subject.lower(), DEFAULT_WEIGHTS).copy()

        if "circuit" not in sscores:
            extra = w["circuit"]
            w["circuit"] = 0.0
            w["vector"] += extra / 2
            w["latex"] += extra / 2
            
        if "concept" not in sscores:
            extra = w["concept"]
            w["concept"] = 0.0
            w["vector"] += extra / 2
            w["latex"] += extra / 2

        score = (
            w["vector"]  * vector_score
            + w["latex"]   * sscores.get("latex", 0.0)
            + w["circuit"] * sscores.get("circuit", 0.0)
            + w["concept"] * sscores.get("concept", 0.0)
        )

        return round(score, 4)
