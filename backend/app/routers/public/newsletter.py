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

from app.models import (
    Subscriber,
)

from app.schemas import (
    SubscriberCreate,
)

# =========================================================
# CELERY TASK
# =========================================================

from app.tasks import (
    send_welcome_email_task,
)

router = APIRouter(
    tags=["Newsletter"],
)


# =========================================================
# SUBSCRIBE TO BLOG NEWSLETTER
# =========================================================

@router.post("/subscribe")
async def subscribe(
    subscriber: SubscriberCreate,
    db: AsyncSession = Depends(get_db),
):
    query = select(Subscriber).where(
        Subscriber.email == subscriber.email
    )

    result = await db.execute(query)

    existing_subscriber = (
        result.scalars().first()
    )

    # =====================================================
    # EXISTING SUBSCRIBER
    # =====================================================

    if existing_subscriber:

        # Already subscribed
        if existing_subscriber.is_active:
            raise HTTPException(
                status_code=400,
                detail="Already subscribed.",
            )

        # Re-enable newsletter
        existing_subscriber.is_active = True

        await db.commit()

        # =================================================
        # SEND WELCOME EMAIL VIA CELERY
        # =================================================

        send_welcome_email_task.delay(
            existing_subscriber.email
        )

        return {
            "status": "success",
            "message": "Newsletter subscription re-activated.",
        }

    # =====================================================
    # NEW SUBSCRIBER
    # =====================================================

    new_subscriber = Subscriber(
        email=subscriber.email,
        is_active=True,
    )

    db.add(new_subscriber)

    await db.commit()

    await db.refresh(new_subscriber)

    # =====================================================
    # SEND WELCOME EMAIL VIA CELERY
    # =====================================================

    send_welcome_email_task.delay(
        new_subscriber.email
    )

    return {
        "status": "success",
        "message": "Successfully subscribed to newsletter.",
    }


# =========================================================
# UNSUBSCRIBE FROM BLOG NEWSLETTER
# =========================================================

@router.post("/unsubscribe")
async def unsubscribe(
    subscriber: SubscriberCreate,
    db: AsyncSession = Depends(get_db),
):
    query = select(Subscriber).where(
        Subscriber.email == subscriber.email
    )

    result = await db.execute(query)

    existing_subscriber = (
        result.scalars().first()
    )

    if not existing_subscriber:
        raise HTTPException(
            status_code=404,
            detail="Subscriber not found.",
        )

    # Already unsubscribed
    if not existing_subscriber.is_active:
        return {
            "status": "success",
            "message": "Already unsubscribed.",
        }

    # Disable newsletter
    existing_subscriber.is_active = False

    await db.commit()

    return {
        "status": "success",
        "message": "Successfully unsubscribed from newsletter.",
    }
