from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse


from app.progress.models import UserVideoProgress
from app.progress.routes import router as progress_router

from app.database import Base, engine, SessionLocal
from app.users.models import User
from app.videos.models import Video
from app.questions.models import Question

from app.auth.routes import router as auth_router
from app.videos.routes import router as video_router
from app.auth.utils import hash_password
from app.questions.routes import router as question_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request


async def options_handler(request: Request):
    return {}

app = FastAPI(title="TrainVid Portal", debug=True)

@app.options("/{path:path}")
async def options_handler(path: str, request: Request):
    return Response(status_code=200)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Create DB tables
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth_router)
app.include_router(video_router)
app.include_router(question_router)
app.include_router(progress_router)

# Static folders
app.mount("/media", StaticFiles(directory="videos"), name="media")
app.mount(
    "/frontend",
    StaticFiles(directory="frontend", html=True),
    name="frontend"
)

@app.get("/")
def health_check():
    return {"status": "TrainVid API running"}


# Seed test users
def create_test_users():
    db = SessionLocal()
    if not db.query(User).first():
        admin = User(
            email="admin@test.com",
            hashed_password=hash_password("admin123"),
            role="admin"
        )
        user = User(
            email="user@test.com",
            hashed_password=hash_password("user123"),
            role="user"
        )
        db.add_all([admin, user])
        db.commit()
    db.close()

create_test_users()

@app.get("/login.html")
def redirect_login():
    return RedirectResponse(url="/frontend/login.html")


@app.get("/favicon.ico")
def favicon():
    return RedirectResponse(url="/frontend/favicon.ico")
