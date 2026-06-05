# backend/app/routers/public/comments.py

from fastapi import APIRouter, Depends, HTTPException, Query, status # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.future import select # type: ignore
from sqlalchemy.orm import selectinload # type: ignore

from app.database import get_db
from app.models import Comment, User
from app.schemas import CommentCreate, CommentResponse
from app.core.security import get_current_user

router = APIRouter(tags=["Public Comments"])


# =========================================================
# GET COMMENTS FOR A POST
# =========================================================


@router.get("/comments", response_model=list[CommentResponse])
async def get_comments(
    slug: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Comment)
        .where(
            Comment.post_slug == slug,
            Comment.parent_id.is_(None),
        )
        .options(
            selectinload(Comment.replies).selectinload(Comment.replies)  # ← 2 levels deep
        )
        .order_by(Comment.created_at.asc())
    )

    result = await db.execute(query)
    comments = result.scalars().all()

    # Serialize while still inside async context
    return [
        CommentResponse.model_validate(c, from_attributes=True)
        for c in comments
    ]

# =========================================================
# CREATE COMMENT (authenticated)
# =========================================================

@router.post(
    "/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment(
    body: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate parent exists and belongs to same post
    if body.parent_id is not None:
        parent_query = select(Comment).where(Comment.id == body.parent_id)
        parent_result = await db.execute(parent_query)
        parent = parent_result.scalars().first()

        if not parent:
            raise HTTPException(status_code=404, detail="Parent comment not found.")
        if parent.post_slug != body.post_slug:
            raise HTTPException(status_code=400, detail="Parent comment belongs to a different post.")

    comment = Comment(
        post_slug=body.post_slug,
        content=body.content.strip(),
        user_id=current_user.id,
        user_name=current_user.full_name or current_user.email,
        user_avatar=None,  # extend later if you store avatars
        parent_id=body.parent_id,
    )

    db.add(comment)
    await db.commit()
    await db.refresh(comment)

    # Re-fetch with replies loaded
    query = (
        select(Comment)
        .where(Comment.id == comment.id)
        .options(selectinload(Comment.replies))
    )
    result = await db.execute(query)
    comment = result.scalars().first()

    return CommentResponse.model_validate(comment)


# =========================================================
# DELETE OWN COMMENT (soft delete)
# =========================================================

@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(Comment).where(Comment.id == comment_id)
    result = await db.execute(query)
    comment = result.scalars().first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found.")

    if comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not allowed.")

    comment.is_deleted = True
    comment.content = "[deleted]"
    await db.commit()