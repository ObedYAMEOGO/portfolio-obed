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

from app.database import get_db

from app.schemas import (
    ProjectResponse,
)

from app.crud.projects import ProjectRepository

router = APIRouter(
    tags=["Public Projects"],
)


@router.get(
    "/projects",
    response_model=List[ProjectResponse],
)
async def list_projects(
    db: AsyncSession = Depends(get_db),
):
    projects = (
        await ProjectRepository.get_all_published(
            db
        )
    )

    response = JSONResponse(
        content=[
            ProjectResponse.model_validate(
                project
            ).model_dump(mode="json")
            for project in projects
        ]
    )

    response.headers[
        "Cache-Control"
    ] = "public, max-age=3600"

    return response