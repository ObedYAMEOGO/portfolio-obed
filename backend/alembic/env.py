import asyncio
from logging.config import fileConfig
import sys
from pathlib import Path

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# =========================================================
# ADD BACKEND ROOT TO PYTHON PATH
# =========================================================

sys.path.append(
    str(Path(__file__).resolve().parent.parent)
)

# =========================================================
# IMPORT APP CONFIG + MODELS
# =========================================================

from app.core.config import settings
from app.models import Base

# =========================================================
# ALEMBIC CONFIG
# =========================================================

config = context.config

# =========================================================
# LOGGING
# =========================================================

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# =========================================================
# METADATA
# =========================================================

target_metadata = Base.metadata

# =========================================================
# DATABASE URL
# =========================================================

DATABASE_URL = (
    settings.DATABASE_URL
    .replace(
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

config.set_main_option(
    "sqlalchemy.url",
    DATABASE_URL,
)

# =========================================================
# OFFLINE MIGRATIONS
# =========================================================

def run_migrations_offline() -> None:
    url = config.get_main_option(
        "sqlalchemy.url"
    )

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named"
        },
    )

    with context.begin_transaction():
        context.run_migrations()

# =========================================================
# ONLINE MIGRATIONS
# =========================================================

def do_run_migrations(
    connection: Connection,
) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    connectable = async_engine_from_config(
        config.get_section(
            config.config_ini_section,
            {},
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(
            do_run_migrations
        )

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(
        run_async_migrations()
    )

# =========================================================
# RUN
# =========================================================

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()