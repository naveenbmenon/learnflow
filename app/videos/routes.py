from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
import shutil
import os
from app.questions.models import Question


from app.database import SessionLocal
from app.videos.models import Video
from app.auth.permissions import admin_required
from app.auth.current_user import get_current_user

router = APIRouter(prefix="/videos", tags=["Videos"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/upload")
def upload_video(
    title: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    if not file.filename.lower().endswith((".mp4", ".mov", ".avi")):
        raise HTTPException(status_code=400, detail="Invalid video format")

    os.makedirs("videos", exist_ok=True)
    file_path = f"videos/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    video = Video(
        title=title,
        description=description,
        video_path=file_path,
        uploaded_by=admin.id
    )

    db.add(video)
    db.commit()
    print("UPLOAD DB:", db.bind.url)

    db.refresh(video)

    return {"message": "Video uploaded successfully", "video_id": video.id}


@router.get("/")
def list_videos(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    videos = db.query(Video).filter(Video.is_active == True).all()
    return videos


@router.get("/{video_id}")
def get_video(
    video_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    video = (
        db.query(Video)
        .filter(Video.id == video_id, Video.is_active == True)
        .first()
    )
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


@router.put("/{video_id}")
def update_video(
    video_id: int,
    title: str = Form(...),
    description: str = Form(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    video.title = title
    video.description = description
    db.commit()

    return {"message": "Video updated successfully"}

@router.put("/{question_id}")
def update_question(
    question_id: int,
    question_text: str = Form(...),
    difficulty: str = Form("Medium"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    q.question_text = question_text
    q.difficulty = difficulty
    db.commit()

    return {"message": "Question updated"}


@router.delete("/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    db.delete(q)
    db.commit()
    return {"message": "Question deleted"}


@router.put("/{video_id}/deactivate")
def deactivate_video(
    video_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    video.is_active = False
    db.commit()

    return {"message": "Video deactivated successfully"}
