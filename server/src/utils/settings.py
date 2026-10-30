from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings."""
    model_config = SettingsConfigDict(env_file=".env",extra="ignore")

    DB_CONNECTION: str
    ALGORITHM: str
    SECRET_KEY:str
    EXP_TIME:int
    CLIENT_ID: str
    CLIENT_SECRET: str
    API_VERSION: str = "2023-08-01"

settings = Settings()