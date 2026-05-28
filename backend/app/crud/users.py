from sqlalchemy.future import select # type: ignore

from sqlalchemy.ext.asyncio import ( # type: ignore
    AsyncSession,
)

from app.models import User

from app.schemas import UserSync

from app.core.config import settings


class UserRepository:

    @staticmethod
    async def sync_user(
        db: AsyncSession,
        payload: UserSync,
    ):

        query = select(User).where(
            User.clerk_id
            == payload.clerk_id
        )

        result = await db.execute(
            query
        )

        user = result.scalars().first()

        # =====================================
        # CREATE USER
        # =====================================

        if not user:

            # ===================================
            # FIX: Auto-set admin based on email
            # ===================================
            # Check if the new user's email matches the configured admin email.
            # If it does, automatically set is_admin=True on user creation.
            # This allows the admin to log in without manual database updates.
            is_admin = (
                payload.email 
                == settings.ADMIN_EMAIL
            )

            user = User(
                clerk_id=payload.clerk_id,
                email=payload.email,
                full_name=payload.full_name,
                is_admin=is_admin,  # Set based on email match
            )

            db.add(user)

            await db.commit()

            await db.refresh(user)

            return user

        # =====================================
        # UPDATE USER
        # =====================================

        user.email = payload.email

        user.full_name = (
            payload.full_name
        )

        await db.commit()

        await db.refresh(user)

        return user

    @staticmethod
    async def get_notification_users(
        db: AsyncSession,
    ):

        query = select(User).where(
            User.receive_notifications
            == True
        )

        result = await db.execute(
            query
        )

        return result.scalars().all()
