from typing import List

from fastapi import ( # type: ignore
    APIRouter,
    Depends,
)

from fastapi.responses import ( # type: ignore
    JSONResponse,
)

from sqlalchemy.ext.asyncio import ( # type: ignore
    AsyncSession,
)

from sqlalchemy.future import select # type: ignore

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
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Material)
        .where(Material.is_published.is_(True))
        .order_by(Material.created_at.desc())
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
    ] = "public, max-age=0, must-revalidate"

    return response