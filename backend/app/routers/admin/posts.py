from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy import func # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.security import verify_admin
from app.crud import PostRepository, SubscriberRepository
from app.database import get_db
from app.models import Post
from app.schemas import (
    PaginatedPosts,
    PostCreate,
    PostResponse,
    PostUpdate,
)
from app.tasks import broadcast_new_post_task
from app.utils.reading_time import calculate_reading_time

router = APIRouter(
    prefix="/admin/posts",
    tags=["Admin Posts"],
)


@router.get("", response_model=PaginatedPosts)
async def list_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    total_query = select(func.count(Post.id))
    total_result = await db.execute(total_query)
    total = total_result.scalar() or 0

    skip = (page - 1) * page_size

    query = (
        select(Post)
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(page_size)
    )

    result = await db.execute(query)
    posts = result.scalars().all()

    total_pages = ((total + page_size - 1) // page_size if total > 0 else 1)

    return PaginatedPosts(
        items=[PostResponse.model_validate(post) for post in posts],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_prev=page > 1,
        has_next=page < total_pages,
    )


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalars().first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    return PostResponse.model_validate(post)


from datetime import datetime

@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post: PostCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    if post.featured:
        featured_query = select(Post).where(Post.featured.is_(True))
        featured_result = await db.execute(featured_query)
        existing_featured = featured_result.scalars().all()
        for item in existing_featured:
            item.featured = False

    # Ensure published_at is timezone-naive if it exists
    if post.published_at:
        post.published_at = post.published_at.replace(tzinfo=None)

    new_post = await PostRepository.create(db, post)

    if new_post.is_published:
        subscribers = await SubscriberRepository.get_active(db)
        emails = [s.email for s in subscribers]
        if emails:
            broadcast_new_post_task.delay(
                subscriber_emails=emails,
                post_title=new_post.title,
                post_summary=new_post.summary,
                post_slug=new_post.slug,
            )

    return PostResponse.model_validate(new_post)

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    updated_post: PostUpdate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalars().first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    was_published = post.is_published

    if updated_post.featured:
        featured_query = select(Post).where(
            Post.featured.is_(True),
            Post.id != post_id,
        )
        featured_result = await db.execute(featured_query)
        existing_featured = featured_result.scalars().all()
        for item in existing_featured:
            item.featured = False

    update_data = updated_post.model_dump(exclude_unset=True)

    if "content" in update_data and update_data["content"] is not None:
        update_data["reading_time"] = calculate_reading_time(update_data["content"])

    for key, value in update_data.items():
        if value is not None:
            if isinstance(value, datetime):
                value = value.replace(tzinfo=None)
            setattr(post, key, value)

    # updated_at handled automatically by onupdate=func.now() on the model

    await db.commit()
    await db.refresh(post)

    if not was_published and post.is_published:
        subscribers = await SubscriberRepository.get_active(db)
        emails = [s.email for s in subscribers]
        if emails:
            broadcast_new_post_task.delay(
                subscriber_emails=emails,
                post_title=post.title,
                post_summary=post.summary,
                post_slug=post.slug,
            )

    return PostResponse.model_validate(post)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(Post.id == post_id)
    result = await db.execute(query)
    post = result.scalars().first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")

    await db.delete(post)
    await db.commit()