import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.config import settings
from app.database import engine
from app.models import Base
from sqlalchemy import text


async def init_db():
    """Initialize database with tables"""
    async with engine.begin() as conn:
        # Create all tables from models
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Database tables created successfully!")


if __name__ == "__main__":
    print("🔄 Initializing database...")
    asyncio.run(init_db())
    print("✅ Database initialization complete!")
