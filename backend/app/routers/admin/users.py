# C:\Users\Obed\Desktop\ai-portfolio\backend\app\routers\admin\users.py

from typing import List

from fastapi import ( # type: ignore
    APIRouter,
    Depends,
)

from sqlalchemy import true # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.future import select # type: ignore

from app.database import get_db
from app.models import User, Subscriber
from app.schemas import AdminUserResponse
from app.core.security import verify_admin

router = APIRouter(
    prefix="/admin/users",
    tags=["Admin Users"],
)


@router.get("", response_model=List[AdminUserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    # Single query via LEFT OUTER JOIN — no N+1
    query = (
        select(User, Subscriber)
        .outerjoin(
            Subscriber,
            (Subscriber.email == User.email)
            & (Subscriber.is_active == true()),
        )
        .order_by(User.created_at.desc())
    )

    result = await db.execute(query)
    rows = result.all()

    return [
        AdminUserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            receive_notifications=user.receive_notifications,
            is_newsletter_subscriber=subscriber is not None,
            created_at=user.created_at,
        )
        for user, subscriber in rows
    ]