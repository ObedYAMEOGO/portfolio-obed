import os

from dotenv import (
    load_dotenv,
)

from fastapi import (
    Header,
    HTTPException,
)

load_dotenv()

ADMIN_SECRET = os.getenv(
    "ADMIN_SECRET"
)

if not ADMIN_SECRET:
    raise ValueError(
        "ADMIN_SECRET is missing."
    )


async def verify_admin(
    x_admin_key: str | None = Header(
        default=None
    ),
):
    if not x_admin_key:
        raise HTTPException(
            status_code=401,
            detail="Missing admin key.",
        )

    if x_admin_key != ADMIN_SECRET:
        raise HTTPException(
            status_code=403,
            detail="Forbidden.",
        )