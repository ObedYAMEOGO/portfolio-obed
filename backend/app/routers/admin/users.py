# users.py

from typing import List

from fastapi import ( # type: ignore
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import ( # type: ignore
    AsyncSession,
)

from sqlalchemy.future import ( # type: ignore
    select,
)

from app.database import get_db

from app.models import (
    User,
    Subscriber,
)

from app.schemas import (
    AdminUserResponse,
)

from app.core.security import (
    verify_admin,
)

router = APIRouter(
    prefix="/admin/users",
    tags=["Admin Users"],
)


@router.get(
    "",
    response_model=List[
        AdminUserResponse
    ],
)
async def list_users(
    db: AsyncSession = Depends(
        get_db
    ),
    _: None = Depends(
        verify_admin
    ),
):
    query = select(User).order_by(
        User.created_at.desc()
    )

    result = await db.execute(
        query
    )

    users = (
        result.scalars().all()
    )

    response = []

    for user in users:

        subscriber_query = (
            select(Subscriber).where(
                Subscriber.email
                == user.email,
                Subscriber.is_active
                == True,
            )
        )

        subscriber_result = (
            await db.execute(
                subscriber_query
            )
        )

        subscriber = (
            subscriber_result.scalars().first()
        )

        response.append(
            {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "receive_notifications": (
                    user.receive_notifications
                ),
                "is_newsletter_subscriber": (
                    subscriber
                    is not None
                ),
                "created_at": (
                    user.created_at
                ),
            }
        )

    return response