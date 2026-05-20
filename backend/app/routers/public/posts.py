from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from fastapi.responses import (
    JSONResponse,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.database import get_db

from app.models import Post

from app.schemas import (
    PostResponse,
)

router = APIRouter(
    tags=["Public Posts"],
)


@router.get(
    "/posts",
    response_model=List[PostResponse],
)
async def list_published_posts(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Post)
        .where(Post.is_published.is_(True))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
    )

    result = await db.execute(query)

    posts = result.scalars().all()

    response = JSONResponse(
        content=[
            PostResponse.model_validate(
                post
            ).model_dump(mode="json")
            for post in posts
        ]
    )

    response.headers[
        "Cache-Control"
    ] = "public, max-age=1800"

    return response


@router.get(
    "/posts/{slug}",
    response_model=PostResponse,
)
async def get_post_details(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    query = select(Post).where(
        Post.slug == slug,
        Post.is_published.is_(True),
    )

    result = await db.execute(query)

    post = result.scalars().first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Article not found.",
        )

    response = JSONResponse(
        content=PostResponse.model_validate(
            post
        ).model_dump(mode="json")
    )

    response.headers[
        "Cache-Control"
    ] = "public, max-age=3600"

    return response