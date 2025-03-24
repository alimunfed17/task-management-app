from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.models import get_db
from app.models.task import Task, TaskStatus
from app.routes.auth import get_current_user
from app.models.user import User
from app.schemas.task import Task as TaskSchema, TaskCreate, TaskUpdate

router = APIRouter()


@router.get("/", response_model=List[TaskSchema])
def read_tasks(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[TaskStatus] = None
) -> Any:
    """
    Retrieve tasks for the current user.
    Can filter by status.
    """
    query = db.query(Task).filter(Task.user_id == current_user.id)
    
    # Filter by status if provided
    if status:
        query = query.filter(Task.status == status)
    
    # Order by due date (and then by created_at if due date is None)
    tasks = query.order_by(Task.due_date.asc().nullslast(), Task.created_at.desc()).offset(skip).limit(limit).all()
    return tasks


@router.post("/", response_model=TaskSchema)
def create_task(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    task_in: TaskCreate
) -> Any:
    """
    Create new task.
    """
    task = Task(
        **task_in.dict(),
        user_id=current_user.id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskSchema)
def read_task(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    task_id: int
) -> Any:
    """
    Get task by ID.
    """
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task


@router.put("/{task_id}", response_model=TaskSchema)
def update_task(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    task_id: int,
    task_in: TaskUpdate
) -> Any:
    """
    Update a task.
    """
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    update_data = task_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", response_model=TaskSchema)
def delete_task(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    task_id: int
) -> Any:
    """
    Delete a task.
    """
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    db.delete(task)
    db.commit()
    return task
