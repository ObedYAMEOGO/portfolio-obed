from pydantic_settings import ( # type: ignore
    BaseSettings,
    SettingsConfigDict,
)  # type: ignore


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

    RESEND_API_KEY: str

    EMAIL_FROM: str

    ADMIN_EMAIL: str

    # =========================================================
    # CLERK
    # =========================================================

    CLERK_SECRET_KEY: str

    CLERK_PUBLISHABLE_KEY: str

    # =========================================================
    # CLERK JWT VERIFICATION
    # =========================================================

    CLERK_JWKS_URL: str

    CLERK_ISSUER: str

    CLERK_JWT_AUDIENCE: str = "backend"

    # =========================================================
    # CELERY / REDIS
    # =========================================================

    REDIS_URL: str = "redis://localhost:6379/0"

    CELERY_BROKER_URL: str = "redis://localhost:6379/0"

    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    # =========================================================
    # SECURITY
    # =========================================================

    ADMIN_SECRET: str

    # =========================================================
    # CONFIG
    # =========================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()