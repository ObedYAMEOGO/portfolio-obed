from typing import List

from fastapi import (
    APIRouter,
    Depends,
)

from fastapi.responses import (
    JSONResponse,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import select

from app.database import get_db

from app.models import Material

from app.schemas import (
    MaterialResponse,
)

router = APIRouter(
    tags=["Public Materials"],
)


@router.get(
    "/materials",
    response_model=List[MaterialResponse],
)
async def list_learning_materials(
    skip: int = 0,
    limit: int = 12,
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Material)
        .where(Material.is_published.is_(True))
        .order_by(Material.created_at.desc())
        .offset(skip)
        .limit(limit)
    )

    result = await db.execute(query)

    materials = result.scalars().all()

    response = JSONResponse(
        content=[
            MaterialResponse.model_validate(
                material
            ).model_dump(mode="json")
            for material in materials
        ]
    )

    response.headers[
        "Cache-Control"
    ] = "public, max-age=3600"

    return response