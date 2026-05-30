from typing import Optional

from fastapi import ( # type: ignore
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from fastapi.responses import JSONResponse # type: ignore

from sqlalchemy import func # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.future import select # type: ignore

from app.database import get_db
from app.models import Post
from app.schemas import (
    PaginatedPosts,
    PostResponse,
)

router = APIRouter(
    tags=["Public Posts"],
)

# =========================================================
# LIST POSTS
# =========================================================


@router.get(
    "/posts",
    response_model=PaginatedPosts,
)
async def list_published_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
):
    filters = [
        Post.is_published.is_(True),
    ]

    # -----------------------------------------------------
    # CATEGORY FILTER
    # -----------------------------------------------------

    if category:
        filters.append(
            Post.category == category
        )

    # -----------------------------------------------------
    # FEATURED FILTER
    # -----------------------------------------------------

    if featured is not None:
        filters.append(
            Post.featured.is_(featured)
        )

    # -----------------------------------------------------
    # TOTAL COUNT
    # -----------------------------------------------------

    count_query = (
        select(func.count())
        .select_from(Post)
        .where(*filters)
    )

    total_result = await db.execute(
        count_query
    )

    total = total_result.scalar() or 0

    # -----------------------------------------------------
    # PAGINATED QUERY
    # -----------------------------------------------------

    query = (
        select(Post)
        .where(*filters)
        .order_by(
            Post.featured.desc(),
            Post.created_at.desc(),
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    result = await db.execute(query)

    posts = result.scalars().all()

    # -----------------------------------------------------
    # PAGINATION
    # -----------------------------------------------------

    total_pages = (
        (total + page_size - 1) // page_size
        if total > 0
        else 1
    )

    payload = PaginatedPosts(
        items=[
            PostResponse.model_validate(post)
            for post in posts
        ],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1,
    )

    response = JSONResponse(
        content=payload.model_dump(mode="json")
    )

    response.headers[
        "Cache-Control"
    ] = "public, max-age=1800"

    return response


# =========================================================
# GET SINGLE POST
# =========================================================


@router.get(
    "/posts/{slug}",
    response_model=PostResponse,
)
async def get_post_details(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Post)
        .where(
            Post.slug == slug,
            Post.is_published.is_(True),
        )
    )

    result = await db.execute(query)

    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Article not found.",
        )

    payload = PostResponse.model_validate(
        post
    )

    response = JSONResponse(
        content=payload.model_dump(mode="json")
    )

    response.headers[
        "Cache-Control"
    ] = "public, max-age=3600"

    return response