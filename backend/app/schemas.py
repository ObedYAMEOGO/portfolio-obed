from datetime import datetime
from typing import List, Optional
from enum import Enum
from pydantic import (  # type: ignore
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    model_validator,
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

    model_config = ConfigDict(from_attributes=True)

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

    model_config = ConfigDict(from_attributes=True)

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

    model_config = ConfigDict(from_attributes=True)

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

    model_config = ConfigDict(from_attributes=True)

    @field_validator(
        "created_at",
        "updated_at",
        mode="before",
    )
    @classmethod
    def make_naive(cls, v):
        return ensure_naive(v)


class MaterialTypeEnum(str, Enum):
    DOCUMENT = "DOCUMENT"
    VIDEO = "VIDEO"


class VideoContextEnum(str, Enum):
    SINGLE = "SINGLE"
    PLAYLIST = "PLAYLIST"
    NONE = "NONE"


class MaterialBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    material_type: MaterialTypeEnum
    video_context: VideoContextEnum = VideoContextEnum.NONE
    category: str
    resource_url: str
    thumbnail_url: Optional[str] = None
    is_published: Optional[bool] = True

    # Data Quality Guardrail: Ensures Video Context is supplied if the material is a video asset
    @model_validator(mode="after")
    def validate_video_parameters(self):
        if (
            self.material_type == MaterialTypeEnum.VIDEO
            and self.video_context == VideoContextEnum.NONE
        ):
            raise ValueError(
                "Video assets must specify configuration type: SINGLE or PLAYLIST."
            )
        if self.material_type == MaterialTypeEnum.DOCUMENT:
            self.video_context = VideoContextEnum.NONE
        return self


class MaterialCreate(MaterialBase):
    pass


class MaterialResponse(MaterialBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedPosts(BaseModel):
    items: List[PostResponse]

    total: int
    page: int
    page_size: int

    total_pages: int

    has_next: bool
    has_prev: bool
    
    
  # ---------------------------------------------------
# USER SCHEMAS
# ---------------------------------------------------

class UserSync(BaseModel):
    clerk_id: str
    email: EmailStr
    full_name: Optional[str] = None


class UserResponse(BaseModel):
    id: int

    clerk_id: str

    email: EmailStr

    full_name: Optional[str] = None

    receive_notifications: bool

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
    
class UserNotificationUpdate(BaseModel):
    email: EmailStr
    
class AdminUserResponse(BaseModel):
    id: int

    email: EmailStr

    full_name: Optional[str] = None

    receive_notifications: bool

    is_newsletter_subscriber: bool

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