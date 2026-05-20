from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
)

from sqlalchemy.ext.asyncio import (
    AsyncSession,
)

from app.database import get_db

from app.schemas import (
    LeadCreate,
)

from app.crud import (
    LeadRepository,
)

from app.tasks import (
    send_lead_notification,
)

router = APIRouter(
    tags=["Public Leads"],
)


@router.post("/leads")
async def submit_lead(
    lead: LeadCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    await LeadRepository.create(
        db,
        lead,
    )

    background_tasks.add_task(
        send_lead_notification,
        lead.email,
        lead.full_name,
        lead.message,
    )

    return {
        "message": "Inquiry received.",
    }