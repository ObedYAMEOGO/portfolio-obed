from fastapi import ( # type: ignore
    APIRouter,
    Depends,
)

from sqlalchemy.ext.asyncio import ( # type: ignore
    AsyncSession,
)

from app.database import get_db

from app.schemas import (
    UserResponse,
    UserSync,
)

from app.crud import (
    UserRepository,
)

router = APIRouter(
    prefix="/users",
    tags=["Public Users"],
)


@router.post(
    "/sync",
    response_model=UserResponse,
)
async def sync_user(
    payload: UserSync,
    db: AsyncSession = Depends(get_db),
):

    return await (
        UserRepository.sync_user(
            db,
            payload,
        )
    )