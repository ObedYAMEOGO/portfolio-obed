from fastapi import (  # type: ignore
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.ext.asyncio import (  # type: ignore
    AsyncSession,
)

from sqlalchemy.future import select  # type: ignore

from app.database import get_db

from app.models import User

from app.schemas import (
    UserNotificationUpdate,
)

router = APIRouter(
    tags=["Notifications"],
)


@router.post("/notifications/unsubscribe")
async def unsubscribe_notifications(
    payload: UserNotificationUpdate,
    db: AsyncSession = Depends(get_db),
):
    query = select(User).where(
        User.email == payload.email
    )

    result = await db.execute(query)

    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    user.receive_notifications = False

    await db.commit()

    return {
        "status": "success",
        "message": "Platform notifications disabled.",
    }


@router.post("/notifications/subscribe")
async def subscribe_notifications(
    payload: UserNotificationUpdate,
    db: AsyncSession = Depends(get_db),
):
    query = select(User).where(
        User.email == payload.email
    )

    result = await db.execute(query)

    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    user.receive_notifications = True

    await db.commit()

    return {
        "status": "success",
        "message": "Platform notifications enabled.",
    }