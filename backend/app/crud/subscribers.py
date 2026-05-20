from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.models import (
    Subscriber,
)

from app.schemas import (
    SubscriberCreate,
)


class SubscriberRepository:

    @staticmethod
    async def get_all(
        db: AsyncSession,
    ):
        query = select(Subscriber).order_by(
            Subscriber.created_at.desc()
        )

        result = await db.execute(query)

        return result.scalars().all()

    @staticmethod
    async def get_active(
        db: AsyncSession,
    ):
        query = select(Subscriber).where(
            Subscriber.is_active.is_(True)
        )

        result = await db.execute(query)

        return result.scalars().all()

    @staticmethod
    async def get_by_email(
        db: AsyncSession,
        email: str,
    ):
        query = select(Subscriber).where(
            Subscriber.email == email
        )

        result = await db.execute(query)

        return result.scalars().first()

    @staticmethod
    async def create(
        db: AsyncSession,
        subscriber: SubscriberCreate,
    ):
        db_subscriber = Subscriber(
            **subscriber.model_dump()
        )

        db.add(db_subscriber)

        try:
            await db.commit()

            await db.refresh(
                db_subscriber
            )

            return db_subscriber

        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def delete(
        db: AsyncSession,
        subscriber_id: int,
    ):
        query = select(Subscriber).where(
            Subscriber.id == subscriber_id
        )

        result = await db.execute(query)

        db_subscriber = (
            result.scalars().first()
        )

        if not db_subscriber:
            return False

        try:
            await db.delete(
                db_subscriber
            )

            await db.commit()

            return True

        except Exception:
            await db.rollback()
            raise