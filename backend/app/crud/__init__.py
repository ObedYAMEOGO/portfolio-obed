from app.crud.posts import (
    PostRepository,
)

from app.crud.projects import (
    ProjectRepository,
)

from app.crud.materials import (
    MaterialRepository,
)

from app.crud.leads import (
    LeadRepository,
)

from app.crud.subscribers import (
    SubscriberRepository,
)
from .users import UserRepository

__all__ = [
    "PostRepository",
    "ProjectRepository",
    "MaterialRepository",
    "LeadRepository",
    "SubscriberRepository",
    "UserRepository",
]