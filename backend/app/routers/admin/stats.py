from fastapi import (
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from sqlalchemy import func

from app.database import get_db

from app.models import (
    Subscriber,
    Lead,
    Post,
    Material,
    Project,
)

from app.core.security import (
    verify_admin,
)

router = APIRouter(
    prefix="/admin/stats",
    tags=["Admin Stats"],
)


@router.get("")
async def get_system_stats(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    sub_count = await db.execute(
        select(func.count(Subscriber.id)).where(
            Subscriber.is_active.is_(True)
        )
    )

    lead_count = await db.execute(
        select(func.count(Lead.id))
    )

    post_count = await db.execute(
        select(func.count(Post.id))
    )

    material_count = await db.execute(
        select(func.count(Material.id))
    )

    project_count = await db.execute(
        select(func.count(Project.id))
    )

    return {
        "active_subscribers": sub_count.scalar() or 0,
        "total_leads": lead_count.scalar() or 0,
        "total_articles": post_count.scalar() or 0,
        "total_materials": material_count.scalar() or 0,
        "total_projects": project_count.scalar() or 0,
        "system_status": "Operational",
    }