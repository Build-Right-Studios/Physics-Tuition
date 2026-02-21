from difflib import SequenceMatcher

def compare_latex(latex1: str, latex2: str) -> float:

    matcher = SequenceMatcher(None, latex1, latex2) # LATER CAN CHANGE TO BETTER METHOD LIKE NORMALIZING LATEX AND THEN COMPARING STRUCTURE RATHER THAN RAW STRINGS
    return matcher.ratio()