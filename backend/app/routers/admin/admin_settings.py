# backend/app/routers/admin/admin_settings.py

from fastapi import ( # type: ignore
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import ( # type: ignore
    AsyncSession,
)

from sqlalchemy.future import ( # type: ignore
    select,
)

from app.database import (
    get_db,
)

from app.models import SiteSettings

from app.core.security import (
    verify_admin,
)

router = APIRouter(
    prefix="/admin/settings",
    tags=["Admin Settings"],
)


@router.get("")
async def get_settings(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SiteSettings)
    )

    settings = (
        result.scalars().first()
    )

    if not settings:
        return {
            "resume_url": None,
        }

    return {
        "id": settings.id,
        "resume_url":
            settings.resume_url,
    }


@router.put("/resume")
async def update_resume(
    payload: dict,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(
        verify_admin
    ),
):
    result = await db.execute(
        select(SiteSettings)
    )

    settings = (
        result.scalars().first()
    )

    if not settings:
        settings = SiteSettings()

        db.add(settings)

    settings.resume_url = (
        payload.get(
            "resume_url"
        )
    )

    await db.commit()

    await db.refresh(
        settings
    )

    return {
        "id": settings.id,
        "resume_url":
            settings.resume_url,
    }