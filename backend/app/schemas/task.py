from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.models.task import TaskStatus

# Shared properties
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.PENDING
    due_date: Optional[datetime] = None


# Properties to receive via API on creation
class TaskCreate(TaskBase):
    pass


# Properties to receive via API on update
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None


# Properties shared by models stored in DB
class TaskInDBBase(TaskBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Properties to return via API
class Task(TaskInDBBase):
    pass


# Properties stored in DB
class TaskInDB(TaskInDBBase):
    pass
