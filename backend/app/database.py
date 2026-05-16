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
    echo=True, # Keeps your logs visible
    pool_pre_ping=True,       # <-- Checks if the connection is alive before using it
    pool_recycle=300,         # <-- Recycles connections every 5 minutes to prevent idle timeouts
    pool_size=5,              # Keeps connection footprint low on serverless databases
    max_overflow=10 
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
