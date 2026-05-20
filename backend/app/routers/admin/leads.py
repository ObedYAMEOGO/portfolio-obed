from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from sqlalchemy.future import (
    select,
)

from app.database import get_db

from app.models import Lead

from app.schemas import (
    LeadResponse,
)

from app.crud import (
    LeadRepository,
)

from app.core.security import (
    verify_admin,
)

router = APIRouter(
    prefix="/admin/leads",
    tags=["Admin Leads"],
)


@router.get(
    "",
    response_model=List[LeadResponse],
)
async def list_leads(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    return await LeadRepository.get_all(
        db
    )


@router.delete("/{lead_id}")
async def delete_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Lead).where(
        Lead.id == lead_id
    )

    result = await db.execute(query)

    lead = result.scalars().first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found.",
        )

    await db.delete(lead)

    await db.commit()

    return {
        "status": "success",
        "message": "Lead deleted.",
    }