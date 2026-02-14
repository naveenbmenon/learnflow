# LearnFlow

A role-based video training platform focused on backend correctness, access control, and realistic business logic.

## Problem

Most training platforms are glorified video lists. LearnFlow is built around the harder problems: per-user progress tracking, idempotent state management, content lifecycle control, and role-aware access — the kind of backend logic that actually breaks in production if done carelessly.

## Architecture

```
Frontend (HTML/CSS/JS)
        ↓
FastAPI Backend (JWT Auth + Business Logic)
        ↓
SQLite Database (SQLAlchemy ORM)
```

**Core principle:** The backend is the single source of truth. The frontend never derives or assumes completion status — all state is computed server-side from database records.

## Authentication & Authorization

- JWT-based authentication
- Two roles: `admin` and `user`
- Protected routes via dependency injection
- Role enforcement happens at the API layer, not the frontend

## Features

**User**
- Browse active training videos
- Mark videos as completed (idempotent endpoint)
- View personal progress dashboard:
  - Total videos assigned
  - Completed count
  - Completion percentage
  - Per-video status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`)

**Admin**
- Upload and manage training videos
- Activate / deactivate videos (soft delete)
- Add, edit, and delete quiz questions
- Manage content lifecycle without permanent data loss

## Progress Tracking System

Each user maintains independent progress records per video. Status is derived using SQL joins at query time — not stored as a string, not computed on the frontend.

Inactive videos are excluded from all progress calculations automatically.

## Project Structure

```
app/
├── database/
├── models/
├── routes/
├── schemas/
├── services/
└── scheduler/
```

Business logic is isolated in `services/` — route handlers are thin and delegate to service functions. This keeps routes readable and logic testable independently.

## Key Engineering Decisions

- **Idempotent completion endpoint** — marking a video complete multiple times produces the same result; no duplicate records, no errors
- **Soft deletion over hard delete** — deactivating a video preserves all historical user progress data
- **Backend-driven aggregation** — progress percentages and statuses are computed via SQL joins, making it impossible for the frontend to spoof completion
- **Dependency injection for auth** — route protection is declarative and consistent, not manually checked per handler

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite |
| Frontend | HTML, CSS, JavaScript |
| Auth | JWT (python-jose) |

## Running Locally

```bash
git clone https://github.com/naveenbmenon/learnflow
cd learnflow

python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
# API: http://127.0.0.1:8000
# Docs: http://127.0.0.1:8000/docs
```

## Planned Improvements

- Watch-time validation before marking a video complete
- Admin analytics dashboard
- Unit tests for progress logic
- Certificate generation on course completion
