from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):

    MATHPIX_APP_ID: str
    MATHPIX_APP_KEY: str
    
    OPENAI_API_KEY: str
    
    QDRANT_URL: str = ""
    QDRANT_API_KEY: Optional[str] = None
    
    PHYSICS_THRESHOLD: float = 0.80
    CHEMISTRY_THRESHOLD: float = 0.85
    MATHS_THRESHOLD: float = 0.90
    
    class Config:
        env_file = ".env"

settings = Settings()