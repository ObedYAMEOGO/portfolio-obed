from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.database import get_db

from app.models import (
    Material,
)

from app.schemas import (
    MaterialCreate,
    MaterialResponse,
)

from app.crud import (
    UserRepository,
)

from app.tasks import (
    broadcast_new_material_task,
)

from app.core.security import (
    verify_admin,
)

router = APIRouter(
    prefix="/admin/materials",
    tags=["Admin Materials"],
)


@router.get(
    "",
    response_model=List[MaterialResponse],
)
async def list_materials(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Material).order_by(
        Material.created_at.desc()
    )

    result = await db.execute(query)

    return result.scalars().all()


@router.get(
    "/{material_id}",
    response_model=MaterialResponse,
)
async def get_material(
    material_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Material).where(
        Material.id == material_id
    )

    result = await db.execute(query)

    material = result.scalars().first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found.",
        )

    return material


@router.post(
    "",
    response_model=MaterialResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_material(
    material: MaterialCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    existing_query = select(Material).where(
        Material.slug == material.slug
    )

    existing_result = await db.execute(
        existing_query
    )

    existing_material = (
        existing_result.scalars().first()
    )

    if existing_material:
        raise HTTPException(
            status_code=400,
            detail="Material already exists.",
        )

    db_material = Material(
        **material.model_dump()
    )

    db.add(db_material)

    await db.commit()

    await db.refresh(db_material)

    # =========================================================
    # SEND NOTIFICATION TO USERS
    # =========================================================

    if db_material.is_published:

        users = (
            await UserRepository.get_notification_users(
                db
            )
        )

        emails = [
            u.email
            for u in users
        ]

        if emails:
            broadcast_new_material_task.delay(
                subscriber_emails=emails,
                material_title=db_material.title,
                material_description=(
                    db_material.description
                    or "New learning material available."
                ),
                # material_slug removed — courses link to /courses
            )

    return db_material


@router.put(
    "/{material_id}",
    response_model=MaterialResponse,
)
async def update_material(
    material_id: int,
    payload: MaterialCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Material).where(
        Material.id == material_id
    )

    result = await db.execute(query)

    material = result.scalars().first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found.",
        )

    # =========================================================
    # CHECK PREVIOUS STATE
    # =========================================================

    was_published = (
        material.is_published
    )

    update_data = (
        payload.model_dump()
    )

    for key, value in (
        update_data.items()
    ):
        setattr(material, key, value)

    await db.commit()

    await db.refresh(material)

    # =========================================================
    # SEND ONLY IF:
    # DRAFT -> PUBLISHED
    # =========================================================

    if (
        not was_published
        and material.is_published
    ):

        users = (
            await UserRepository.get_notification_users(
                db
            )
        )

        emails = [
            u.email
            for u in users
        ]

        if emails:
            broadcast_new_material_task.delay(
                subscriber_emails=emails,
                material_title=material.title,
                material_description=(
                    material.description
                    or "New learning material available."
                ),
                # material_slug removed — courses link to /courses
            )

    return material


@router.delete(
    "/{material_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_material(
    material_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Material).where(
        Material.id == material_id
    )

    result = await db.execute(query)

    material = result.scalars().first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found.",
        )

    await db.delete(material)

    await db.commit()

    return {
        "success": True,
        "message": "Material deleted.",
    }