from typing import List

from fastapi import (  # type: ignore
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.ext.asyncio import (  # type: ignore
    AsyncSession,
)

from sqlalchemy.future import select  # type: ignore

from app.database import get_db

from app.models import (
    Project,
    User,
)

from app.schemas import (
    ProjectCreate,
    ProjectResponse,
)

from app.crud import (
    ProjectRepository,
    SubscriberRepository,
)

from app.core.security import (
    verify_admin,
)

from app.utils.revalidation import trigger_frontend_revalidation

# =========================================================
# CELERY TASKS
# =========================================================

from app.tasks import (
    broadcast_new_project_task,
)

router = APIRouter(
    prefix="/admin/projects",
    tags=["Admin Projects"],
)


# =========================================================
# LIST PROJECTS
# =========================================================

@router.get(
    "",
    response_model=List[ProjectResponse],
)
async def list_projects(
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Project).order_by(
        Project.created_at.desc()
    )

    result = await db.execute(query)

    return result.scalars().all()


# =========================================================
# GET SINGLE PROJECT
# =========================================================

@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Project).where(
        Project.id == project_id
    )

    result = await db.execute(query)

    project = result.scalars().first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return project


# =========================================================
# CREATE PROJECT
# =========================================================

@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_project(
    project: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    created_project = await (
        ProjectRepository.create(
            db,
            project,
        )
    )

    # Trigger frontend revalidation
    await trigger_frontend_revalidation("projects", created_project.slug)

    # =====================================================
    # SEND EMAIL IF PUBLISHED
    # =====================================================

    if created_project.is_published:
        try:
            subscribers = await SubscriberRepository.get_active(db)
            emails = [s.email for s in subscribers if s.email]

            if emails:
                broadcast_new_project_task.delay(
                    subscriber_emails=emails,
                    project_title=created_project.title,
                    project_description=(
                        created_project.description or ""
                    ),
                )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to queue notification task: {e}")

    return created_project


# =========================================================
# UPDATE PROJECT
# =========================================================

@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
)
async def update_project(
    project_id: int,
    payload: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Project).where(
        Project.id == project_id
    )

    result = await db.execute(query)

    project = result.scalars().first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    was_published = (
        project.is_published
    )

    old_slug = project.slug

    update_data = (
        payload.model_dump()
    )

    for key, value in (
        update_data.items()
    ):
        setattr(project, key, value)

    await db.commit()

    await db.refresh(project)

    # Trigger frontend revalidation
    await trigger_frontend_revalidation("projects", project.slug)
    if project.slug != old_slug:
        await trigger_frontend_revalidation("projects", old_slug)

    # =====================================================
    # SEND EMAIL ONLY WHEN:
    # DRAFT -> PUBLISHED
    # =====================================================

    if (
        not was_published
        and project.is_published
    ):
        try:
            subscribers = await SubscriberRepository.get_active(db)
            emails = [s.email for s in subscribers if s.email]

            if emails:
                broadcast_new_project_task.delay(
                    subscriber_emails=emails,
                    project_title=project.title,
                    project_description=(
                        project.description or ""
                    ),
                )
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to queue notification task: {e}")

    return project


# =========================================================
# DELETE PROJECT
# =========================================================

@router.delete(
    "/{project_id}",
    status_code=status.HTTP_200_OK,
)
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
    _: None = Depends(verify_admin),
):
    query = select(Project).where(
        Project.id == project_id
    )

    result = await db.execute(query)

    project = result.scalars().first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    project_slug = project.slug
    await db.delete(project)

    await db.commit()

    # Trigger frontend revalidation
    await trigger_frontend_revalidation("projects", project_slug)

    return {
        "success": True,
        "message": "Project deleted.",
    }
