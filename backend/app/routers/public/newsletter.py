from fastapi import (  # type: ignore
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore
from sqlalchemy.future import select  # type: ignore

from app.database import get_db
from app.models import Subscriber
from app.schemas import SubscriberCreate
from app.tasks import send_welcome_email_task

router = APIRouter(tags=["Newsletter"])


# =========================================================
# HELPERS
# =========================================================

def fire_welcome_email(email: str) -> None:
    try:
        send_welcome_email_task.delay(email)
    except Exception as e:
        # Celery / Redis unavailable — subscription still succeeds
        print(f"CELERY_TASK_ERROR: {e}")


# =========================================================
# SUBSCRIBE
# =========================================================

@router.post("/subscribe")
async def subscribe(
    subscriber: SubscriberCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Subscriber).where(Subscriber.email == subscriber.email)
    )
    existing = result.scalars().first()

    # Already subscribed
    if existing and existing.is_active:
        raise HTTPException(status_code=400, detail="Already subscribed.")

    # Re-activate
    if existing and not existing.is_active:
        existing.is_active = True
        await db.commit()
        fire_welcome_email(existing.email)
        return {
            "status": "success",
            "message": "Newsletter subscription re-activated.",
        }

    # New subscriber
    new_subscriber = Subscriber(email=subscriber.email, is_active=True)
    db.add(new_subscriber)
    await db.commit()
    await db.refresh(new_subscriber)
    fire_welcome_email(new_subscriber.email)

    return {
        "status": "success",
        "message": "Successfully subscribed to newsletter.",
    }


# =========================================================
# UNSUBSCRIBE
# =========================================================

@router.post("/unsubscribe")
async def unsubscribe(
    subscriber: SubscriberCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Subscriber).where(Subscriber.email == subscriber.email)
    )
    existing = result.scalars().first()

    if not existing:
        raise HTTPException(status_code=404, detail="Subscriber not found.")

    if not existing.is_active:
        return {
            "status": "success",
            "message": "Already unsubscribed.",
        }

    existing.is_active = False
    await db.commit()

    return {
        "status": "success",
        "message": "Successfully unsubscribed from newsletter.",
    }