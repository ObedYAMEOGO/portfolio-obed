from functools import lru_cache
from typing import Optional

from pydantic_settings import (  # type: ignore
    BaseSettings,
    SettingsConfigDict,
)


class Settings(BaseSettings):
    # =========================================================
    # APP
    # =========================================================

    PROJECT_NAME: str = "obed.ai"

    ENVIRONMENT: str = "development"

    FRONTEND_URL: str = "http://localhost:3000"

    # =========================================================
    # DATABASE
    # =========================================================

    DATABASE_URL: str

    # =========================================================
    # RESEND / EMAIL
    # =========================================================

    RESEND_API_KEY: Optional[str] = None

    EMAIL_FROM: str

    ADMIN_EMAIL: str

    # =========================================================
    # CLERK
    # =========================================================

    CLERK_SECRET_KEY: Optional[str] = None

    CLERK_PUBLISHABLE_KEY: Optional[str] = None

    # =========================================================
    # CLERK JWT VERIFICATION
    # =========================================================

    CLERK_JWKS_URL: Optional[str] = None

    CLERK_ISSUER: Optional[str] = None

    CLERK_JWT_AUDIENCE: str = "backend"

    # =========================================================
    # CELERY / REDIS
    # =========================================================

    REDIS_URL: str = "redis://localhost:6379/0"

    CELERY_BROKER_URL: Optional[str] = None

    CELERY_RESULT_BACKEND: Optional[str] = None

    # =========================================================
    # SECURITY
    # =========================================================

    ADMIN_SECRET: Optional[str] = None

    # =========================================================
    # CONFIG
    # =========================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=True,
    )

    # =========================================================
    # POST INIT
    # =========================================================

    def model_post_init(self, __context) -> None:
        """
        Fallback Celery values to REDIS_URL
        """

        if not self.CELERY_BROKER_URL:
            self.CELERY_BROKER_URL = self.REDIS_URL

        if not self.CELERY_RESULT_BACKEND:
            self.CELERY_RESULT_BACKEND = self.REDIS_URL


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
