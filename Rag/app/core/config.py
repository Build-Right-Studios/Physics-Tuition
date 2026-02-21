from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):

    MATHPIX_APP_ID: str
    MATHPIX_APP_KEY: str
    
    OPENAI_API_KEY: str
    
    QDRANT_URL: str = ""
    QDRANT_API_KEY: Optional[str] = None

    VALID_SOURCES: List[str] = [
        "jee_mains",
        "jee_advanced",
        "neet",
        "cbse_board",
        "ncert",
        "ncert_exemplar"
    ]

    VALID_SUBJECTS: dict = {
        "jee_mains": ["physics", "chemistry", "maths"],
        "jee_advanced": ["physics", "chemistry", "maths"],
        "neet": ["physics", "chemistry", "biology"],
        "cbse_board": ["physics", "chemistry", "maths", "biology"],
        "ncert": ["physics", "chemistry", "maths", "biology"],
        "ncert_exemplar": ["physics", "chemistry", "maths", "biology"]
    }
    
    THRESHOLDS: dict = {
        "physics": 0.80,
        "chemistry": 0.85,
        "maths": 0.90,
        "biology": 0.85
    }
    
    class Config:
        env_file = ".env"

settings = Settings()