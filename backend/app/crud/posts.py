from datetime import datetime, timezone
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Post
from app.schemas import PostCreate, PostUpdate
from app.utils.reading_time import calculate_reading_time


class PostRepository:

    @staticmethod
    async def get_all(
        db: AsyncSession,
        published_only: bool = False,
        skip: int = 0,
        limit: int = 10,
    ):
        query = select(Post)
        if published_only:
            query = query.where(Post.is_published.is_(True))
        query = query.order_by(Post.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def count(
        db: AsyncSession,
        published_only: bool = False,
    ):
        query = select(func.count(Post.id))
        if published_only:
            query = query.where(Post.is_published.is_(True))
        result = await db.execute(query)
        return result.scalar()

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        post_id: int,
    ):
        query = select(Post).where(Post.id == post_id)
        result = await db.execute(query)
        return result.scalars().first()

    @staticmethod
    async def get_by_slug(
        db: AsyncSession,
        slug: str,
    ):
        query = select(Post).where(Post.slug == slug)
        result = await db.execute(query)
        return result.scalars().first()

    @staticmethod
    async def create(
        db: AsyncSession,
        post: PostCreate,
    ):
        reading_time = calculate_reading_time(post.content)
        
        # Use timezone-naive datetime for database
        now = datetime.now().replace(tzinfo=None)
        
        db_post = Post(
            title=post.title,
            slug=post.slug,
            summary=post.summary,
            content=post.content,
            category=post.category.value if hasattr(post.category, 'value') else post.category,
            tags=post.tags,
            cover_image_url=post.cover_image_url,
            seo_title=post.seo_title,
            seo_description=post.seo_description,
            featured=post.featured,
            is_published=post.is_published,
            published_at=post.published_at.replace(tzinfo=None) if post.published_at else None,
            reading_time=reading_time,
            created_at=now,
            updated_at=None,
        )

        db.add(db_post)

        try:
            await db.commit()
            await db.refresh(db_post)
            return db_post
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def update(
        db: AsyncSession,
        post_id: int,
        payload: PostUpdate,
    ):
        db_post = await PostRepository.get_by_id(db, post_id)

        if not db_post:
            return None

        update_data = payload.model_dump(exclude_unset=True)

        if "content" in update_data and update_data["content"] is not None:
            update_data["reading_time"] = calculate_reading_time(update_data["content"])

        for key, value in update_data.items():
            if value is not None:
                # Strip timezone info from any datetime fields
                if isinstance(value, datetime):
                    value = value.replace(tzinfo=None)
                setattr(db_post, key, value)

        db_post.updated_at = datetime.utcnow()

        try:
            await db.commit()
            await db.refresh(db_post)
            return db_post
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def delete(
        db: AsyncSession,
        post_id: int,
    ):
        db_post = await PostRepository.get_by_id(db, post_id)

        if not db_post:
            return False

        try:
            await db.delete(db_post)
            await db.commit()
            return True
        except Exception:
            await db.rollback()
            raise