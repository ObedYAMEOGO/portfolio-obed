from typing import List

from fastapi import ( # type: ignore
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.ext.asyncio import ( # type: ignore
    AsyncSession,
)

from sqlalchemy.future import select # type: ignore

from app.database import get_db

from app.models import (
    Post,
)

from app.schemas import (
    PostCreate,
    PostResponse,
)

from app.crud import (
    PostRepository,
    SubscriberRepository,
)

from app.tasks import (
    broadcast_new_post,
)

from app.core.security import (
    verify_admin,
)

router = APIRouter(
    prefix="/admin/posts",
    tags=["Admin Posts"],
)


@router.get(
    "",
    response_model=List[PostResponse],
)
async def list_posts(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).order_by(Post.created_at.desc())

    result = await db.execute(query)

    return result.scalars().all()


@router.get(
    "/{post_id}",
    response_model=PostResponse,
)
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(Post.id == post_id)

    result = await db.execute(query)

    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found.",
        )

    return post


@router.post(
    "",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_post(
    post: PostCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    new_post = await PostRepository.create(
        db,
        post,
    )

    if new_post.is_published:

        subscribers = await SubscriberRepository.get_active(db)

        emails = [s.email for s in subscribers]

        if emails:
            background_tasks.add_task(
                broadcast_new_post,
                subscriber_emails=emails,
                post_title=new_post.title,
                post_summary=new_post.summary,
                post_slug=new_post.slug,
            )

    return new_post


@router.put(
    "/{post_id}",
    response_model=PostResponse,
)
async def update_post(
    post_id: int,
    updated_post: PostCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(Post.id == post_id)

    result = await db.execute(query)

    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found.",
        )

    was_published = post.is_published

    update_data = updated_post.model_dump()

    for key, value in update_data.items():
        setattr(post, key, value)

    await db.commit()

    await db.refresh(post)

    # SEND EMAILS ONLY WHEN
    # DRAFT -> PUBLISHED

    if not was_published and post.is_published:

        subscribers = await SubscriberRepository.get_active(db)

        emails = [s.email for s in subscribers]

        if emails:
            background_tasks.add_task(
                broadcast_new_post,
                subscriber_emails=emails,
                post_title=post.title,
                post_summary=post.summary,
                post_slug=post.slug,
            )

    return post


@router.delete(
    "/{post_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(Post.id == post_id)

    result = await db.execute(query)

    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found.",
        )

    await db.delete(post)

    await db.commit()

    return {
        "success": True,
        "message": "Post deleted.",
    }
