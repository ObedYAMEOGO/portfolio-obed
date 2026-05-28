from typing import List

from fastapi import ( # type: ignore
    APIRouter,
    Depends,
    HTTPException,
)

from fastapi.responses import ( # type: ignore
    JSONResponse,
)

from sqlalchemy.ext.asyncio import ( # type: ignore
    AsyncSession,
)

from sqlalchemy.future import select # type: ignore

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
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Post)
        .where(Post.is_published.is_(True))
        .order_by(Post.created_at.desc())
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