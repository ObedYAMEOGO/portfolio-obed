# backend/app/routers/public/reactions.py

from fastapi import APIRouter, Depends, Query, status # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.future import select # type: ignore
from sqlalchemy import func, and_ # type: ignore

from app.database import get_db
from app.models import PostReaction, ReactionType, User
from app.schemas import PostReactionsResponse, ReactionCount, ReactionToggle
from app.core.security import get_current_user

router = APIRouter(tags=["Reactions"])


# =========================================================
# GET REACTIONS FOR A POST
# =========================================================

@router.get("/reactions", response_model=PostReactionsResponse)
async def get_reactions(
    slug: str = Query(...),
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    # Count per reaction type
    counts_query = (
        select(PostReaction.reaction, func.count(PostReaction.id))
        .where(PostReaction.post_slug == slug)
        .group_by(PostReaction.reaction)
    )
    counts_result = await db.execute(counts_query)
    counts_map = {row[0]: row[1] for row in counts_result.all()}

    # Which ones the current user has reacted to
    user_reactions: set[ReactionType] = set()
    if current_user:
        user_query = select(PostReaction.reaction).where(
            and_(
                PostReaction.post_slug == slug,
                PostReaction.user_id == current_user.id,
            )
        )
        user_result = await db.execute(user_query)
        user_reactions = {row[0] for row in user_result.all()}

    reactions = [
        ReactionCount(
            reaction=rt,
            count=counts_map.get(rt, 0),
            reacted=rt in user_reactions,
        )
        for rt in ReactionType
    ]

    return PostReactionsResponse(post_slug=slug, reactions=reactions)


# =========================================================
# TOGGLE REACTION (authenticated)
# =========================================================

@router.post("/reactions/toggle", status_code=status.HTTP_200_OK)
async def toggle_reaction(
    body: ReactionToggle,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(PostReaction).where(
        and_(
            PostReaction.post_slug == body.post_slug,
            PostReaction.user_id == current_user.id,
            PostReaction.reaction == body.reaction,
        )
    )
    result = await db.execute(query)
    existing = result.scalars().first()

    if existing:
        # Toggle off
        await db.delete(existing)
        await db.commit()
        return {"reacted": False}
    else:
        # Toggle on
        reaction = PostReaction(
            post_slug=body.post_slug,
            user_id=current_user.id,
            reaction=body.reaction,
        )
        db.add(reaction)
        await db.commit()
        return {"reacted": True}