from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    status,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from sqlalchemy import func

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
    broadcast_new_post_task,
)

from app.core.security import (
    verify_admin,
)

router = APIRouter(
    prefix="/admin/posts",
    tags=["Admin Posts"],
)


# =========================================================
# LIST POSTS
# =========================================================


@router.get("")
async def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    """
    Paginated admin posts list
    """

    total_query = select(
        func.count(Post.id)
    )

    total_result = await db.execute(
        total_query
    )

    total = (
        total_result.scalar() or 0
    )

    skip = (page - 1) * limit

    query = (
        select(Post)
        .order_by(
            Post.created_at.desc()
        )
        .offset(skip)
        .limit(limit)
    )

    result = await db.execute(query)

    posts = result.scalars().all()

    total_pages = (
        (total + limit - 1) // limit
    )

    return {
        "items": posts,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": total_pages,
            "has_prev": page > 1,
            "has_next": page < total_pages,
        },
    }


# =========================================================
# GET SINGLE POST
# =========================================================


@router.get(
    "/{post_id}",
    response_model=PostResponse,
)
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(
        Post.id == post_id
    )

    result = await db.execute(query)

    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found.",
        )

    return post


# =========================================================
# CREATE POST
# =========================================================


@router.post(
    "",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_post(
    post: PostCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    new_post = await PostRepository.create(
        db,
        post,
    )

    # =====================================================
    # BLOG EMAILS ONLY GO TO SUBSCRIBERS
    # =====================================================

    if new_post.is_published:

        subscribers = (
            await SubscriberRepository.get_active(
                db
            )
        )

        emails = [
            s.email
            for s in subscribers
        ]

        if emails:

            broadcast_new_post_task.delay(
                subscriber_emails=emails,
                post_title=new_post.title,
                post_summary=new_post.summary or "",
                post_slug=new_post.slug,
            )

    return new_post


# =========================================================
# UPDATE POST
# =========================================================


@router.put(
    "/{post_id}",
    response_model=PostResponse,
)
async def update_post(
    post_id: int,
    updated_post: PostCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(
        Post.id == post_id
    )

    result = await db.execute(query)

    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found.",
        )

    was_published = (
        post.is_published
    )

    update_data = (
        updated_post.model_dump()
    )

    for key, value in (
        update_data.items()
    ):
        setattr(
            post,
            key,
            value,
        )

    await db.commit()

    await db.refresh(post)

    # =====================================================
    # SEND ONLY IF:
    # DRAFT -> PUBLISHED
    # =====================================================

    if (
        not was_published
        and post.is_published
    ):

        subscribers = (
            await SubscriberRepository.get_active(
                db
            )
        )

        emails = [
            s.email
            for s in subscribers
        ]

        if emails:

            broadcast_new_post_task.delay(
                subscriber_emails=emails,
                post_title=post.title,
                post_summary=post.summary or "",
                post_slug=post.slug,
            )

    return post


# =========================================================
# DELETE POST
# =========================================================


@router.delete(
    "/{post_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Post).where(
        Post.id == post_id
    )

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