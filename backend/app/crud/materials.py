from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.models import (
    Material,
)

from app.schemas import (
    MaterialCreate,
)


class MaterialRepository:

    @staticmethod
    async def get_all(
        db: AsyncSession,
        published_only: bool = False,
    ):
        query = select(Material)

        if published_only:
            query = query.where(
                Material.is_published.is_(True)
            )

        query = query.order_by(
            Material.created_at.desc()
        )

        result = await db.execute(query)

        return result.scalars().all()

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        material_id: int,
    ):
        query = select(Material).where(
            Material.id == material_id
        )

        result = await db.execute(query)

        return result.scalars().first()

    @staticmethod
    async def get_by_slug(
        db: AsyncSession,
        slug: str,
    ):
        query = select(Material).where(
            Material.slug == slug
        )

        result = await db.execute(query)

        return result.scalars().first()

    @staticmethod
    async def create(
        db: AsyncSession,
        material: MaterialCreate,
    ):
        existing = await (
            MaterialRepository.get_by_slug(
                db,
                material.slug,
            )
        )

        if existing:
            raise ValueError(
                "Material already exists."
            )

        db_material = Material(
            **material.model_dump()
        )

        db.add(db_material)

        try:
            await db.commit()

            await db.refresh(
                db_material
            )

            return db_material

        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def update(
        db: AsyncSession,
        material_id: int,
        payload: MaterialCreate,
    ):
        db_material = (
            await MaterialRepository.get_by_id(
                db,
                material_id,
            )
        )

        if not db_material:
            return None

        update_data = (
            payload.model_dump()
        )

        for key, value in (
            update_data.items()
        ):
            setattr(
                db_material,
                key,
                value,
            )

        try:
            await db.commit()

            await db.refresh(
                db_material
            )

            return db_material

        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def delete(
        db: AsyncSession,
        material_id: int,
    ):
        db_material = (
            await MaterialRepository.get_by_id(
                db,
                material_id,
            )
        )

        if not db_material:
            return False

        try:
            await db.delete(
                db_material
            )

            await db.commit()

            return True

        except Exception:
            await db.rollback()
            raise