from datetime import datetime
from typing import List, Optional

from pydantic import ( # type: ignore
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


# ---------------------------------------------------
# DATETIME NORMALIZATION
# ---------------------------------------------------

def ensure_naive(v):
    if isinstance(v, datetime) and v.tzinfo is not None:
        return v.replace(tzinfo=None)

    return v


# ---------------------------------------------------
# PROJECT SCHEMAS
# ---------------------------------------------------

class ProjectBase(BaseModel):
    title: str
    slug: str

    description: Optional[str] = None
    content: Optional[str] = None

    tech_stack: List[str] = Field(default_factory=list)

    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None

    is_published: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

    @field_validator(
        "created_at",
        mode="before",
    )
    @classmethod
    def make_naive(cls, v):
        return ensure_naive(v)


# ---------------------------------------------------
# LEAD SCHEMAS
# ---------------------------------------------------

class LeadCreate(BaseModel):
    full_name: str
    email: EmailStr
    message: str


class LeadResponse(LeadCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

    @field_validator(
        "created_at",
        mode="before",
    )
    @classmethod
    def make_naive(cls, v):
        return ensure_naive(v)


# ---------------------------------------------------
# SUBSCRIBER SCHEMAS
# ---------------------------------------------------

class SubscriberBase(BaseModel):
    email: EmailStr


class SubscriberCreate(SubscriberBase):
    pass


class SubscriberResponse(SubscriberBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

    @field_validator(
        "created_at",
        mode="before",
    )
    @classmethod
    def make_naive(cls, v):
        return ensure_naive(v)


# ---------------------------------------------------
# BLOG / POST SCHEMAS
# ---------------------------------------------------

class PostBase(BaseModel):
    title: str
    slug: str

    summary: Optional[str] = None

    content: str

    feature_image_url: Optional[str] = None

    category: str = "Research"

    is_published: bool = False


class PostCreate(PostBase):
    pass


class PostResponse(PostBase):
    id: int

    created_at: datetime

    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )

    @field_validator(
        "created_at",
        "updated_at",
        mode="before",
    )
    @classmethod
    def make_naive(cls, v):
        return ensure_naive(v)