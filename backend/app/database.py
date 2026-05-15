from sqlalchemy.ext.asyncio import ( # type: ignore
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)

from app.config import settings

DATABASE_URL = (
    settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
    .replace("sslmode=require", "ssl=require")
    .replace("channel_binding=require", "")
)

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_recycle=300, 
    pool_pre_ping=True,  
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
