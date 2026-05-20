from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.models import (
    Lead,
)

from app.schemas import (
    LeadCreate,
)


class LeadRepository:

    @staticmethod
    async def create(
        db: AsyncSession,
        lead: LeadCreate,
    ):
        db_lead = Lead(
            **lead.model_dump()
        )

        db.add(db_lead)

        try:
            await db.commit()

            await db.refresh(
                db_lead
            )

            return db_lead

        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def get_all(
        db: AsyncSession,
    ):
        query = select(Lead).order_by(
            Lead.created_at.desc()
        )

        result = await db.execute(query)

        return result.scalars().all()

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        lead_id: int,
    ):
        query = select(Lead).where(
            Lead.id == lead_id
        )

        result = await db.execute(query)

        return result.scalars().first()

    @staticmethod
    async def delete(
        db: AsyncSession,
        lead_id: int,
    ):
        db_lead = (
            await LeadRepository.get_by_id(
                db,
                lead_id,
            )
        )

        if not db_lead:
            return False

        try:
            await db.delete(db_lead)

            await db.commit()

            return True

        except Exception:
            await db.rollback()
            raise