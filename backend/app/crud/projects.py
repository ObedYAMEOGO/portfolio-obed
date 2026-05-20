from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Project
from app.schemas import ProjectCreate

class ProjectRepository:

    @staticmethod
    async def get_all_published(
        db: AsyncSession,
    ):
        query = select(Project).where(
            Project.is_published.is_(True)
        )

        result = await db.execute(query)

        return result.scalars().all()

    @staticmethod
    async def get_all(
        db: AsyncSession,
    ):
        query = select(Project).order_by(
            Project.created_at.desc()
        )

        result = await db.execute(query)

        return result.scalars().all()

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        project_id: int,
    ):
        result = await db.execute(
            select(Project).where(
                Project.id == project_id
            )
        )

        return result.scalars().first()

    @staticmethod
    async def create(
        db: AsyncSession,
        project: ProjectCreate,
    ):
        db_project = Project(
            **project.model_dump()
        )

        db.add(db_project)

        try:
            await db.commit()
            await db.refresh(db_project)

            return db_project

        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def update(
        db: AsyncSession,
        project_id: int,
        project_data: ProjectCreate,
    ):
        db_project = await ProjectRepository.get_by_id(
            db,
            project_id,
        )

        if not db_project:
            return None

        for key, value in project_data.model_dump().items():
            setattr(db_project, key, value)

        try:
            await db.commit()
            await db.refresh(db_project)

            return db_project

        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def delete(
        db: AsyncSession,
        project_id: int,
    ):
        db_project = await ProjectRepository.get_by_id(
            db,
            project_id,
        )

        if not db_project:
            return False

        try:
            await db.delete(db_project)
            await db.commit()

            return True

        except Exception:
            await db.rollback()
            raise
