from fastapi import APIRouter, Depends, status  # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession  # type: ignore

from app.database import get_db
from app.schemas import LeadCreate, LeadResponse
from app.crud import LeadRepository
from app.tasks import send_lead_notification_task

router = APIRouter(
    prefix="/leads",
    tags=["Leads"],
)


@router.post(
    "",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def submit_lead(
    data: LeadCreate,
    db: AsyncSession = Depends(get_db),
):
    lead = await LeadRepository.create(db=db, lead=data)

    try:
        send_lead_notification_task.delay(
            full_name=lead.full_name,
            email=lead.email,
            message=lead.message,
        )
    except Exception as e:
        # Lead is saved — notification email will not fire
        # but we don't fail the request over it
        print(f"CELERY_TASK_ERROR: {e}")

    return lead