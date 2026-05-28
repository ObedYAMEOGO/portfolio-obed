from functools import lru_cache
from typing import Optional

from pydantic_settings import ( # type: ignore
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

    EMAIL_FROM: Optional[str] = None

    ADMIN_EMAIL: Optional[str] = None

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
        Automatically fallback Celery URLs to REDIS_URL
        """

        if not self.CELERY_BROKER_URL:
            self.CELERY_BROKER_URL = self.REDIS_URL

        if not self.CELERY_RESULT_BACKEND:
            self.CELERY_RESULT_BACKEND = self.REDIS_URL

        # =====================================================
        # PRODUCTION VALIDATION
        # =====================================================

        if self.ENVIRONMENT == "production":
            required_in_production = {
                "CLERK_SECRET_KEY": self.CLERK_SECRET_KEY,
                "CLERK_PUBLISHABLE_KEY": self.CLERK_PUBLISHABLE_KEY,
                "CLERK_JWKS_URL": self.CLERK_JWKS_URL,
                "CLERK_ISSUER": self.CLERK_ISSUER,
                "ADMIN_SECRET": self.ADMIN_SECRET,
            }

            missing = [
                key
                for key, value in required_in_production.items()
                if not value
            ]

            if missing:
                raise ValueError(
                    f"Missing production environment variables: {', '.join(missing)}"
                )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()