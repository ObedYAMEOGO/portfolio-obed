import asyncio
from logging.config import fileConfig
import sys
import os
from pathlib import Path

# Add the backend directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# 1. Import your Config and Models
from backend.app.core.config import settings
from app.models import Base

# Alembic Config object
config = context.config

# 2. Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 3. Set target_metadata for autogenerate support
target_metadata = Base.metadata

# 4. Override the sqlalchemy.url in alembic.ini with our .env value
# Note: Alembic needs the sync driver prefix (postgresql://) not asyncpg for migrations
# Change this line in your env.py:
DATABASE_URL = (
    settings.DATABASE_URL
    .replace("postgresql://", "postgresql+asyncpg://")
    .replace("sslmode=require", "ssl=require")
    .replace("channel_binding=require", "")
)

config.set_main_option("sqlalchemy.url", DATABASE_URL)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    """The actual migration execution."""
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations() -> None:
    """In this scenario we need to create an Engine
    and associate a connection with the context.
    """
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    asyncio.run(run_async_migrations())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()