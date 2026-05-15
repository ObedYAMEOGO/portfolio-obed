from pydantic_settings import BaseSettings, SettingsConfigDict # type: ignore


class Settings(BaseSettings):
    DATABASE_URL: str

    PROJECT_NAME: str = "My Portfolio"

    RESEND_API_KEY: str

    CLERK_SECRET_KEY: str
    CLERK_PUBLISHABLE_KEY: str

    ADMIN_EMAIL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()