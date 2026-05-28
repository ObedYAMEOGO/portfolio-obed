from fastapi import (  # type: ignore
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.ext.asyncio import (  # type: ignore
    AsyncSession,
)

from app.database import get_db

from app.schemas import (
    SubscriberCreate,
)

from app.crud.subscribers import (
    SubscriberRepository,
)

from app.tasks import (
    send_welcome_email_task,
)

router = APIRouter(
    tags=["Public Subscribers"],
)


@router.post(
    "/subscribe",
    status_code=status.HTTP_201_CREATED,
)
async def subscribe(
    payload: SubscriberCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Public newsletter subscription endpoint.
    """

    existing = (
        await SubscriberRepository.get_by_email(
            db,
            payload.email,
        )
    )

    if existing:

        if existing.is_active:
            raise HTTPException(
                status_code=400,
                detail="Already subscribed.",
            )

        existing.is_active = True

        await db.commit()

        await db.refresh(existing)

        send_welcome_email_task.delay(
            existing.email
        )

        return {
            "success": True,
            "message": "Subscription restored.",
        }

    subscriber = (
        await SubscriberRepository.create(
            db,
            payload,
        )
    )

    send_welcome_email_task.delay(
        subscriber.email
    )

    return {
        "success": True,
        "message": "Subscribed successfully.",
    }