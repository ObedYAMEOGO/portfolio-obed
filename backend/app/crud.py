from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.future import select # type: ignore
from .models import Project, Lead, Subscriber, Post
from .schemas import (
    ProjectCreate,
    LeadCreate,
    SubscriberCreate,
    PostCreate,
)

class ProjectRepository:
    @staticmethod
    async def get_all_published(db: AsyncSession):
        query = select(Project).where(Project.is_published == True)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def create(db: AsyncSession, project: ProjectCreate):
        project_data = project.model_dump()
        db_project = Project(**project_data)
        db.add(db_project)
        try:
            await db.commit()
            await db.refresh(db_project)
            return db_project
        except Exception as e:
            await db.rollback()
            raise e

class LeadRepository:
    @staticmethod
    async def create(db: AsyncSession, lead: LeadCreate):
        db_lead = Lead(**lead.model_dump())
        db.add(db_lead)
        try:
            await db.commit()
            await db.refresh(db_lead)
            return db_lead
        except Exception as e:
            await db.rollback()
            raise e

    @staticmethod
    async def get_all(db: AsyncSession):
        query = select(Lead).order_by(Lead.created_at.desc())
        result = await db.execute(query)
        return result.scalars().all()

class SubscriberRepository:
    @staticmethod
    async def get_all(db: AsyncSession):
        """Dashboard: Fetches all subscribers regardless of status"""
        result = await db.execute(select(Subscriber))
        return result.scalars().all()

    @staticmethod
    async def get_active(db: AsyncSession):
        """Used by the blog broadcast task to find verified recipients"""
        result = await db.execute(
            select(Subscriber).where(Subscriber.is_active == True)
        )
        return result.scalars().all()

    @staticmethod
    async def create(db: AsyncSession, subscriber: SubscriberCreate):
        """Creates a new subscriber record"""
        db_subscriber = Subscriber(**subscriber.model_dump())
        db.add(db_subscriber)
        try:
            await db.commit()
            await db.refresh(db_subscriber)
            return db_subscriber
        except Exception as e:
            await db.rollback()
            raise e

class PostRepository:
    @staticmethod
    async def get_all(db: AsyncSession, published_only: bool = False):
        query = select(Post)
        if published_only:
            query = query.where(Post.is_published == True)
        query = query.order_by(Post.created_at.desc())
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_by_slug(db: AsyncSession, slug: str):
        result = await db.execute(select(Post).where(Post.slug == slug))
        return result.scalars().first()

    @staticmethod
    async def create(db: AsyncSession, post: PostCreate):
        db_post = Post(**post.model_dump())
        db.add(db_post)
        try:
            await db.commit()
            await db.refresh(db_post)
            return db_post
        except Exception as e:
            await db.rollback()
            raise e

    @staticmethod
    async def update(db: AsyncSession, post_id: int, post_data: PostCreate):
        result = await db.execute(select(Post).where(Post.id == post_id))
        db_post = result.scalars().first()
        if not db_post:
            return None

        for key, value in post_data.model_dump().items():
            setattr(db_post, key, value)
        
        # Consistent with your requested update logic
        db_post.updated_at = datetime.now(timezone.utc)

        try:
            await db.commit()
            await db.refresh(db_post)
            return db_post
        except Exception as e:
            await db.rollback()
            raise e

    @staticmethod
    async def delete(db: AsyncSession, post_id: int):
        result = await db.execute(select(Post).where(Post.id == post_id))
        db_post = result.scalars().first()
        if not db_post:
            return False
        try:
            await db.delete(db_post)
            await db.commit()
            return True
        except Exception as e:
            await db.rollback()
            raise e