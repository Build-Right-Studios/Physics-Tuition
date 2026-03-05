from app.matching.vector_matcher import VectorMatcher
from app.matching.structural_matcher import StructuralMatcher
from app.matching.llm_verifier import LLMVerifier
from app.matching.scoring import SimilarityScorer
from app.matching.thresholds import get_threshold
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class DuplicateMatcher:
    def __init__(self):
        self.vector_matcher = VectorMatcher()
        self.structural_matcher = StructuralMatcher()
        self.llm_verifier = LLMVerifier()
        self.similarity_scorer = SimilarityScorer()

    async def find_duplicates(
        self,
        question: str,
        subject: str,
        year: int = None,
        top_k: int = 10
    ) -> List[Dict]:
        logger.info("finding duplicates for {subject} question")

        candidates = await self.vector_matcher.search(
            embedding = question["embedding"],
            subject=subject,
            year=year,
            top_k=50
        )

        logger.info(f"Stage 1: Found {len(candidates)} vector candidates")
        
        if not candidates:
            return []
        
        structural_matches = []
        for candidate in candidates:
            sscore = self.structural_matcher.compare(
                question1=question,
                question2=candidate
            )

            if sscore["total_score"] > 0.5:
                candidate["sscore"] = sscore
                structural_matches.append(candidate)
        
        logger.info(f"Stage 2: {len(structural_matches)} passed structual test ")

        threshold = get_threshold(subject)
        final_matches = []

        for candidate in structural_matches[:15]:
            combined_score = self.similarity_scorer.combine_scores(
                vector_score=candidate["similarity_score"],
                sscores=candidate["sscore"],
                subject=subject
            )

            if combined_score > threshold:
                llm_result = await self.llm_verifier.verify(
                    question,
                    candidate
                )

                if llm_result["is_duplicate"]:
                    if llm_result["is_duplicate"]:
                        final_matches.append({
                            "question_id": candidate["id"],
                            "similarity_score": combined_score,
                            "latex": candidate["latex"],
                            "text": candidate["text"],
                            "year": candidate.get("year"),
                            "diagram_description": candidate.get("diagram_description"),
                            "match_breakdown": {
                                "vector_score": candidate["similarity_score"],
                                "latex_score": candidate["structural_score"]["latex"],
                                "circuit_score": candidate["structural_score"].get("circuit", 0),
                                "combined_score": combined_score
                            },
                            "match_reason": llm_result["reason"],
                            "confidence": llm_result["confidence"]
                        })
        
        logger.info(f"Stage 3: {len(final_matches)} final duplicates")
        

        return sorted(
            final_matches, 
            key=lambda x: x["similarity_score"], 
            reverse=True
        )[:top_k]