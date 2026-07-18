from sqlalchemy.ext.asyncio import (  # type: ignore
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

# =========================================================
# DATABASE URL
# =========================================================

DATABASE_URL = (
    settings.DATABASE_URL.replace(
        "postgresql://",
        "postgresql+asyncpg://",
    )
    .replace(
        "sslmode=require",
        "ssl=require",
    )
    .replace(
        "channel_binding=require",
        "",
    )
)

# =========================================================
# ASYNC ENGINE
# =========================================================

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=15,
    max_overflow=30,
    connect_args={
        "timeout": 15,
        "command_timeout": 15,
    },
)

# =========================================================
# SESSION FACTORY
# =========================================================

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# =========================================================
# DATABASE DEPENDENCY
# =========================================================


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
