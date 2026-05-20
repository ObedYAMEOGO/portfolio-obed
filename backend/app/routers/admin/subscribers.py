from typing import List

from fastapi import ( # type: ignore
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.ext.asyncio import ( # type: ignore
    AsyncSession,
)

from sqlalchemy.future import ( # type: ignore
    select,
)

from app.database import get_db

from app.models import Subscriber

from app.schemas import (
    SubscriberResponse,
)

from app.crud.subscribers import (
    SubscriberRepository,
)

from app.core.security import (
    verify_admin,
)

router = APIRouter(
    prefix="/admin/subscribers",
)


@router.get(
    "",
    response_model=List[SubscriberResponse],
)
async def list_subscribers(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    """
    Dashboard: Fetch all subscribers.
    """

    return await SubscriberRepository.get_all(db)


@router.delete("/{subscriber_id}")
async def delete_subscriber(
    subscriber_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Subscriber).where(
        Subscriber.id == subscriber_id
    )

    result = await db.execute(query)

    subscriber = (
        result.scalars().first()
    )

    if not subscriber:
        raise HTTPException(
            status_code=404,
            detail="Subscriber not found.",
        )

    await db.delete(subscriber)

    await db.commit()

    return {
        "status": "success",
        "message": "Subscriber deleted.",
    }
