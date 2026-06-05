# backend/app/routers/admin/comments.py

from fastapi import APIRouter, Depends, HTTPException, Query, status # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.future import select # type: ignore
from sqlalchemy.orm import selectinload # type: ignore
from sqlalchemy import func # type: ignore

from app.database import get_db
from app.models import Comment
from app.schemas import CommentResponse
from app.core.security import verify_admin

router = APIRouter(
    prefix="/admin/comments",
    tags=["Admin Comments"],
)


# =========================================================
# LIST ALL COMMENTS (paginated)
# =========================================================

@router.get("", response_model=list[CommentResponse])
async def list_comments(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    slug: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    filters = []
    if slug:
        filters.append(Comment.post_slug == slug)

    query = (
        select(Comment)
        .where(*filters)
        .options(selectinload(Comment.replies))
        .order_by(Comment.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    result = await db.execute(query)
    comments = result.scalars().all()
    return [CommentResponse.model_validate(c) for c in comments]


# =========================================================
# HARD DELETE ANY COMMENT
# =========================================================

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_comment(
    comment_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Comment).where(Comment.id == comment_id)
    result = await db.execute(query)
    comment = result.scalars().first()

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found.")

    await db.delete(comment)
    await db.commit()