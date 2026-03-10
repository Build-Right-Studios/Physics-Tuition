from app.utils.latex_utils import compare_latex_structure
from typing import Dict

class StructuralMatcher:
    def compare(self, question1: Dict, question2: Dict) -> Dict:
        """
        Compare LaTeX structure, circuit topology, etc.
        
        Returns scores for different aspects
        """
        scores = {}

        q1_latex = question1.get("latex", "")
        q2_latex = question2.get("payload", {}).get("latex", question2.get("latex", ""))

        scores["latex"] = compare_latex_structure(q1_latex, q2_latex)

        q1_circuit = question1.get("circuit_topology")
        q2_circuit = question2.get("payload", {}).get("circuit_topology", question2.get("circuit_topology"))

        if q1_circuit or q2_circuit:
            if q1_circuit and q2_circuit:
                scores["circuit"] = self._compare_circuits(q1_circuit, q2_circuit)
            else:
                scores["circuit"] = 0.0
        
        q1_concept = question1.get("concept")
        q2_concept = question2.get("payload", {}).get("concept", question2.get("concept"))

        if q1_concept or q2_concept:
            if q1_concept and q2_concept:
                scores["concept"] = 1.0 if q1_concept == q2_concept else 0.0
            else:
                scores["concept"] = 0.0
        
        scores["total_score"] = sum(scores.values()) / max(len(scores), 1)
        return scores
    
    def _compare_circuits(self, circuit1: str, circuit2: str) -> float:
        """Compare circuit topologies"""
        return 1.0 if circuit1 == circuit2 else 0.0   # LATER WE NEED TO CONVERT THIS BINARY RESULT TO A CONTINUOUS SCORE BASED ON TOPOLOGY SIMILARITY
    