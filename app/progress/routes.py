from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal
from app.auth.current_user import get_current_user
from app.users.models import User
from app.videos.models import Video
from app.progress.models import UserVideoProgress

router = APIRouter(prefix="/progress", tags=["Progress"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/complete/{video_id}")
def mark_completed(
    video_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.is_active == True
    ).first()

    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    progress = db.query(UserVideoProgress).filter(
        UserVideoProgress.user_id == user.id,
        UserVideoProgress.video_id == video_id
    ).first()

    if not progress:
        progress = UserVideoProgress(
            user_id=user.id,
            video_id=video_id,
            completed=True,
            completed_at=datetime.utcnow()
        )
        db.add(progress)
    else:
        progress.completed = True
        progress.completed_at = datetime.utcnow()

    db.commit()
    return {"message": "Video marked as completed"}


@router.get("/summary")
def progress_summary(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    total = db.query(Video).filter(Video.is_active == True).count()

    completed = db.query(UserVideoProgress).filter(
        UserVideoProgress.user_id == user.id,
        UserVideoProgress.completed == True
    ).count()

    return {
        "completed": completed,
        "total": total
    }


@router.get("/completed")
def get_completed_videos(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    records = db.query(UserVideoProgress).filter(
        UserVideoProgress.user_id == user.id,
        UserVideoProgress.completed == True
    ).all()

    return [record.video_id for record in records]
