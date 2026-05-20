from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.database import get_db

from app.models import Subscriber

from app.schemas import (
    SubscriberCreate,
)

from app.crud import (
    SubscriberRepository,
)

from app.tasks import (
    send_welcome_email,
)

router = APIRouter(
    tags=["Newsletter"],
)


@router.post("/subscribe")
async def subscribe(
    subscriber: SubscriberCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    query = select(Subscriber).where(
        Subscriber.email == subscriber.email
    )

    result = await db.execute(query)

    existing_sub = (
        result.scalars().first()
    )

    if existing_sub:

        if existing_sub.is_active:
            raise HTTPException(
                status_code=400,
                detail="Already subscribed.",
            )

        existing_sub.is_active = True

        await db.commit()

        return {
            "status": "success",
            "message": "Subscription re-activated.",
        }

    await SubscriberRepository.create(
        db,
        subscriber,
    )

    background_tasks.add_task(
        send_welcome_email,
        subscriber.email,
    )

    return {
        "status": "success",
        "message": "Subscription initialized.",
    }


@router.post("/unsubscribe")
async def unsubscribe(
    subscriber: SubscriberCreate,
    db: AsyncSession = Depends(get_db),
):
    query = select(Subscriber).where(
        Subscriber.email == subscriber.email
    )

    result = await db.execute(query)

    sub = result.scalars().first()

    if not sub:
        raise HTTPException(
            status_code=404,
            detail="Email not found.",
        )

    sub.is_active = False

    await db.commit()

    return {
        "status": "success",
        "message": "Unsubscribed.",
    }