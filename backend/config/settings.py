import os

class Settings:
    PROJECT_NAME: str = "SIGNSETU AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    LOG_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")

settings = Settings()
