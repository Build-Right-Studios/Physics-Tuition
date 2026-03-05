from app.utils.latex_utils import compare_latex_structure
from typing import Dict

class StructuralMatcher:
    def compare(self, question1: Dict, question2: Dict) -> Dict:
        """
        Compare LaTeX structure, circuit topology, etc.
        
        Returns scores for different aspects
        """
        scores = {}
        
        scores["latex"] = compare_latex_structure(
            question1["latex"],
            question2["latex"]
        )
        
        if question1.get("circuit_topology") and question2.get("circuit_topology"):
            scores["circuit"] = self._compare_circuits(
                question1["circuit_topology"],
                question2["circuit_topology"]
            )
        
        if question1.get("concept") and question2.get("concept"):
            scores["concept"] = 1.0 if question1["concept"] == question2["concept"] else 0.0
        
        scores["total_score"] = sum(scores.values()) / len(scores)  # LATER WE ALSO CAN ADD WEIGHTED AVG DEPENDING UPON THE IMPORTANCE OF DIFFERENT ASPECTS FOR DIFFERENT SUBJECTS (E.G. FOR PHYSICS CIRCUIT TOPOLOGY MAY BE MORE IMPORTANT THAN FOR CHEMISTRY)
        
        return scores
    
    def _compare_circuits(self, circuit1: str, circuit2: str) -> float:
        """Compare circuit topologies"""
        return 1.0 if circuit1 == circuit2 else 0.0   # LATER WE NEED TO CONVERT THIS BINARY RESULT TO A CONTINUOUS SCORE BASED ON TOPOLOGY SIMILARITY
    