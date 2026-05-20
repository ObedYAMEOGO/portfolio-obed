from datetime import (
    datetime,
    timezone,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.models import (
    Post,
)

from app.schemas import (
    PostCreate,
)


class PostRepository:

    @staticmethod
    async def get_all(
        db: AsyncSession,
        published_only: bool = False,
    ):
        query = select(Post)

        if published_only:
            query = query.where(
                Post.is_published.is_(True)
            )

        query = query.order_by(
            Post.created_at.desc()
        )

        result = await db.execute(query)

        return result.scalars().all()

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        post_id: int,
    ):
        query = select(Post).where(
            Post.id == post_id
        )

        result = await db.execute(query)

        return result.scalars().first()

    @staticmethod
    async def get_by_slug(
        db: AsyncSession,
        slug: str,
    ):
        query = select(Post).where(
            Post.slug == slug
        )

        result = await db.execute(query)

        return result.scalars().first()

    @staticmethod
    async def create(
        db: AsyncSession,
        post: PostCreate,
    ):
        db_post = Post(
            **post.model_dump()
        )

        db.add(db_post)

        try:
            await db.commit()

            await db.refresh(
                db_post
            )

            return db_post

        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def update(
        db: AsyncSession,
        post_id: int,
        payload: PostCreate,
    ):
        db_post = (
            await PostRepository.get_by_id(
                db,
                post_id,
            )
        )

        if not db_post:
            return None

        update_data = (
            payload.model_dump()
        )

        for key, value in (
            update_data.items()
        ):
            setattr(
                db_post,
                key,
                value,
            )

        db_post.updated_at = (
            datetime.now(
                timezone.utc
            )
        )

        try:
            await db.commit()

            await db.refresh(
                db_post
            )

            return db_post

        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def delete(
        db: AsyncSession,
        post_id: int,
    ):
        db_post = (
            await PostRepository.get_by_id(
                db,
                post_id,
            )
        )

        if not db_post:
            return False

        try:
            await db.delete(db_post)

            await db.commit()

            return True

        except Exception:
            await db.rollback()
            raise