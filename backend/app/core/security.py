from fastapi import (  # type: ignore
    Depends,
    Header,
    HTTPException,
    status,
)

from sqlalchemy.future import select  # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

from clerk_backend_api import Clerk  # type: ignore

from jose import jwt  # type: ignore
from jose.exceptions import JWTError  # type: ignore

import requests  # type: ignore

from app.database import get_db
from app.models import User
from app.core.config import settings

# =========================================================
# CLERK CLIENT
# =========================================================

clerk = Clerk(
    bearer_auth=settings.CLERK_SECRET_KEY
)

# =========================================================
# CLERK JWKS
# =========================================================

JWKS_URL = settings.CLERK_JWKS_URL

try:
    jwks = requests.get(
        JWKS_URL,
        timeout=10,
    ).json()

except Exception as e:
    raise RuntimeError(
        f"Failed to load Clerk JWKS: {e}"
    )

# =========================================================
# VERIFY JWT
# =========================================================

def verify_clerk_token(
    token: str,
):
    try:
        # -------------------------------------------------
        # READ JWT HEADER
        # -------------------------------------------------

        header = jwt.get_unverified_header(
            token
        )

        kid = header.get("kid")

        if not kid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing token kid.",
            )

        # -------------------------------------------------
        # FIND MATCHING JWK
        # -------------------------------------------------

        key = None

        for jwk in jwks["keys"]:
            if jwk["kid"] == kid:
                key = jwk
                break

        if not key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No matching JWK found.",
            )

        # -------------------------------------------------
        # VERIFY TOKEN
        # -------------------------------------------------

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.CLERK_JWT_AUDIENCE,
            issuer=settings.CLERK_ISSUER,
        )

        return payload

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Clerk token: {str(e)}",
        )

# =========================================================
# GET CURRENT USER
# =========================================================

async def get_current_user(
    authorization: str | None = Header(
        default=None
    ),
    x_admin_secret: str | None = Header(
        default=None
    ),
    db: AsyncSession = Depends(
        get_db
    ),
):

    # =====================================================
    # SERVER AUTH
    # =====================================================

    if x_admin_secret:

        if (
            x_admin_secret
            != settings.ADMIN_SECRET
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin secret.",
            )

        query = select(User).where(
            User.email
            == settings.ADMIN_EMAIL
        )

        result = await db.execute(
            query
        )

        user = result.scalars().first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Admin user not found.",
            )

        return user

    # =====================================================
    # CLIENT AUTH
    # =====================================================

    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header.",
        )

    if not authorization.startswith(
        "Bearer "
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization format.",
        )

    token = authorization.replace(
        "Bearer ",
        ""
    )

    payload = verify_clerk_token(
        token
    )

    clerk_user_id = payload.get(
        "sub"
    )

    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Clerk token payload.",
        )

    # =====================================================
    # DATABASE USER
    # =====================================================

    query = select(User).where(
        User.clerk_id
        == clerk_user_id
    )

    result = await db.execute(
        query
    )

    user = result.scalars().first()

    # =====================================================
    # AUTO CREATE USER
    # =====================================================

    if not user:

        try:
            clerk_user = clerk.users.get(
                user_id=clerk_user_id
            )

        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Failed to fetch Clerk user.",
            )

        if (
            not clerk_user.email_addresses
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User has no email.",
            )

        primary_email = (
            clerk_user.email_addresses[0]
            .email_address
        )

        full_name = (
            f"{clerk_user.first_name or ''} "
            f"{clerk_user.last_name or ''}"
        ).strip()

        is_admin = (
            primary_email
            == settings.ADMIN_EMAIL
        )

        user = User(
            clerk_id=clerk_user_id,
            email=primary_email,
            full_name=full_name,
            is_admin=is_admin,
        )

        db.add(user)

        await db.commit()

        await db.refresh(user)

    return user

# =========================================================
# VERIFY ADMIN
# =========================================================

async def verify_admin(
    current_user: User = Depends(
        get_current_user
    ),
):

    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user