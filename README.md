# 🎓 Professor Office Hour Scheduler

A full-stack app where professors publish office-hour slots and students book them.

![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLAlchemy-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20SQLite-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Contents:** [Quick start](#-quick-start) · [Configuration](#-configuration) · [Project layout](#-project-layout) · [How it works](#-how-it-works) · [API reference](#-api-reference) · [Data model](#-data-model) · [Development guide](#-development-guide) · [Troubleshooting](#-troubleshooting)

---

## ✨ Features

**Students**
- Register / log in
- Browse professors and see their upcoming open slots
- Book a slot with an optional note, and cancel it later
- See booking history (upcoming, past, cancelled)

**Professors**
- Create slots with a location, capacity (1–50 students), and notes
- Weekly calendar overview and booking stats on the dashboard
- See who booked which slot, and cancel a student's booking
- Delete slots

**Rules the API enforces**
- A professor's slots can't overlap
- Slots must start in the future and end after they start
- A slot can't be booked past its capacity, after it starts, or twice by the same student
- Students cancel only their own bookings; professors only bookings on their own slots

---

## 🚀 Quick start

### Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.11 or 3.12 | The pinned `pydantic-core` has no prebuilt wheels for 3.13+ |
| Node.js | 18+ | npm comes with it |
| PostgreSQL | any recent | Optional: SQLite works for local development |

### 1. Clone

```bash
git clone https://github.com/techytcm/Professor-Office-Hour-Scheduler.git
cd Professor-Office-Hour-Scheduler
```

### 2. Backend (terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # then edit DATABASE_URL and SECRET_KEY
uvicorn app.main:app --reload --port 8000
```

> **Fastest setup:** in `.env`, switch `DATABASE_URL` to the SQLite line. No database server needed.
> For PostgreSQL, create the database first: `createdb office_hours`.

Tables are created automatically on startup.

- API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000, register one **professor** and one **student** account (two browsers or a private window), create a slot as the professor, and book it as the student.

---

## 🔧 Configuration

### Backend: `backend/.env`

Read by [app/config.py](backend/app/config.py). Every value has a default, so `.env` is only needed to override them.

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:password@localhost:5432/office_hours` | Any SQLAlchemy URL, e.g. `sqlite:///./office_hours.db` |
| `SECRET_KEY` | placeholder | Signs JWTs. **Change it** (`python -c "import secrets; print(secrets.token_hex(32))"`) |
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Login lifetime; the user is sent back to `/login` when it expires |

### Frontend: `frontend/.env` (optional)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000/api` | Base URL for API calls |

### Ports and CORS

The frontend dev server runs on **3000** and the API on **8000**. The backend only allows CORS from `http://localhost:3000` (see [app/main.py](backend/app/main.py)). If you change the frontend port or deploy elsewhere, update `allow_origins`. Alternatively, set `VITE_API_URL=/api` to use the dev-server proxy in [vite.config.js](frontend/vite.config.js), which avoids CORS entirely.

---

## 📁 Project layout

```text
backend/
├── app/
│   ├── main.py            # FastAPI app, CORS, router registration, table creation
│   ├── config.py          # Settings loaded from .env
│   ├── database.py        # Engine, session, get_db dependency
│   ├── dependencies.py    # get_current_user, require_student, require_professor
│   ├── models/            # SQLAlchemy tables: User, OfficeHour, Booking
│   ├── schemas/           # Pydantic request/response models
│   ├── routers/           # auth.py, professors.py, bookings.py
│   └── utils/
│       ├── security.py        # bcrypt hashing, JWT encode/decode
│       └── datetime_utils.py  # UTC helpers
├── requirements.txt
└── .env.example

frontend/src/
├── main.jsx               # Router + AuthProvider
├── App.jsx                # All routes
├── context/AuthContext.jsx  # Current user, login/register/logout
├── services/              # Axios client (api.js) + one module per API area
├── hooks/                 # useAuth, useBookings, useOfficeHours
├── pages/                 # Auth/, Student/, Professor/ screens
├── components/            # Auth/, Booking/, Layout/, Professor/ building blocks
└── utils/                 # Date formatting, form validators
```

### Frontend routes

| Path | Role | Page |
|------|------|------|
| `/login`, `/register` | public | Auth forms |
| `/student/dashboard` | student | Upcoming bookings + stats |
| `/student/professors` | student | Professor directory |
| `/student/book/:professorId` | student | Pick a slot and book it |
| `/student/bookings` | student | Booking history with filters |
| `/professor/dashboard` | professor | Stats, weekly calendar, today's bookings |
| `/professor/slots` | professor | Create / delete slots |
| `/professor/bookings` | professor | All bookings on your slots |

Role checks are done by [ProtectedRoute.jsx](frontend/src/components/Auth/ProtectedRoute.jsx). The backend checks roles independently, so the UI checks are a convenience, not security.

---

## 🧠 How it works

### Authentication

1. `POST /api/auth/register` or `/api/auth/login` returns `{ token, user }`.
2. The frontend stores both in `localStorage` ([AuthContext.jsx](frontend/src/context/AuthContext.jsx)).
3. An Axios interceptor in [api.js](frontend/src/services/api.js) adds `Authorization: Bearer <token>` to every request.
4. On the backend, `get_current_user` decodes the JWT (`sub` = email) and loads the user; `require_student` / `require_professor` add role checks.
5. Any `401` (outside the auth endpoints) clears storage and redirects to `/login`.

### Times and time zones

All times are **stored as naive UTC** in the database and **returned with a `Z` suffix** (e.g. `2026-11-10T14:00:00Z`).

- The slot form converts the professor's local input to UTC with `toISOString()` before sending.
- The API accepts timezone-aware ISO strings and converts them to UTC. A naive string is assumed to already be UTC.
- The browser converts back to local time for display (`date-fns`).

When adding new datetime fields, use `to_naive_utc` on input and the `UTCDatetime` type in response schemas ([schemas/office_hour.py](backend/app/schemas/office_hour.py)).

### Slot capacity

`OfficeHour.is_booked` means "full". It is recomputed whenever a booking is created or cancelled (`current_bookings >= max_students`). Students only see slots that are not full and haven't started.

### Error format

Errors follow FastAPI's shape: `{"detail": "message"}`, or a list of validation errors for `422`. The frontend turns either into a readable string with `getErrorMessage(err)` from [api.js](frontend/src/services/api.js), which is what you should use when adding new calls.

---

## 🔌 API reference

All endpoints are prefixed with `/api`. Interactive docs: http://localhost:8000/docs.

### Auth

| Method | Endpoint | Access | Body / notes |
|--------|----------|--------|--------------|
| POST | `/auth/register` | public | `{ email, password (≥8), first_name, last_name, role: "student"\|"professor", department? }` |
| POST | `/auth/login` | public | `{ email, password }` (JSON, not form data) |
| GET | `/auth/profile` | any user | Current user |

### Professors

| Method | Endpoint | Access | Notes |
|--------|----------|--------|-------|
| GET | `/professors` | any user | List professors |
| GET | `/professors/{id}/slots` | any user | That professor's upcoming, not-full slots |
| GET | `/professors/me/slots` | professor | All your slots |
| POST | `/professors/me/slots` | professor | `{ start_time, end_time, location, max_students?, notes? }` |
| DELETE | `/professors/me/slots/{id}` | professor | **Also deletes the slot's bookings** |
| GET | `/professors/me/bookings` | professor | Bookings on your slots, including student name |

### Bookings

| Method | Endpoint | Access | Notes |
|--------|----------|--------|-------|
| GET | `/bookings/my` | student | Your bookings, newest first |
| POST | `/bookings` | student | `{ slot_id, notes? }` |
| DELETE | `/bookings/{id}` | booking's student, or the slot's professor | Marks the booking `cancelled`; it stays in history |

### Try it with curl

```bash
# Register and grab the token (requires jq)
TOKEN=$(curl -s -X POST localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"prof@uni.edu","password":"password123","first_name":"Ada","last_name":"Lovelace","role":"professor","department":"CS"}' \
  | jq -r .token)

# Create a slot
curl -X POST localhost:8000/api/professors/me/slots \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"start_time":"2030-01-15T14:00:00Z","end_time":"2030-01-15T14:30:00Z","location":"Room 301"}'
```

> Swagger's **Authorize** button sends a form-encoded login, which this API doesn't accept. To call protected endpoints from `/docs`, use curl/Postman with the token from the login response instead.

---

## 🗄️ Data model

```text
users 1 ──< office_hours 1 ──< bookings >── 1 users
(professor)                                 (student)
```

**users**: `id`, `email` (unique), `hashed_password`, `first_name`, `last_name`, `role` (`student`/`professor`), `department` (professors only)

**office_hours**: `id`, `professor_id → users`, `start_time`, `end_time` (UTC), `location`, `max_students` (default 1), `is_booked` (= full), `notes`

**bookings**: `id`, `student_id → users`, `office_hour_id → office_hours`, `status` (`confirmed`/`cancelled`), `notes`, `created_at` (UTC)

Computed fields in responses (`duration_minutes`, `current_bookings`, `professor_name`, `student_name`, …) are Python `@property`s on the models in [backend/app/models/](backend/app/models/).

---

## 🛠️ Development guide

### Adding an API endpoint

1. **Schema:** add request/response models in `backend/app/schemas/` with `model_config = ConfigDict(from_attributes=True)` for ORM output.
2. **Route:** add the function in the matching `backend/app/routers/*.py`, using `Depends(require_student)` / `Depends(require_professor)` / `Depends(get_current_user)` for auth.
   In `professors.py`, keep fixed paths like `/me/...` **above** `/{professor_id}/...`, or FastAPI will match `"me"` as an ID.
3. **New router file?** Export it in `routers/__init__.py` and register it in `main.py`.
4. **Frontend:** add a function to the relevant `frontend/src/services/*Service.js`, then call it from a hook or page and show errors with `getErrorMessage`.

### Database changes

There are no migrations yet. `Base.metadata.create_all()` creates **missing tables** on startup but **does not alter existing ones**. After changing a model during development, either:

- **SQLite:** delete the `.db` file and restart, or
- **PostgreSQL:** `dropdb office_hours && createdb office_hours`, then restart.

`alembic` is already in `requirements.txt` if you want to add proper migrations.

### Working on the UI without the backend

Set `MOCK_MODE = true` at the top of [frontend/src/services/api.js](frontend/src/services/api.js) to serve canned data for the main screens.

### Production build

```bash
cd frontend && npm run build     # output in frontend/dist/
cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Before deploying: set a strong `SECRET_KEY`, point `DATABASE_URL` at PostgreSQL, and update CORS `allow_origins` in `main.py`.

### Tests

There is no automated test suite yet. Use `/docs` or the curl examples above. For backend tests, add `httpx` and `pytest` and use `fastapi.testclient.TestClient` with `DATABASE_URL=sqlite:///./test.db`.

---

## 🐛 Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Network Error` in the browser | Backend isn't running on port 8000, or the frontend isn't on `localhost:3000` (CORS) |
| `database "office_hours" does not exist` | `createdb office_hours`, or switch to SQLite |
| `password authentication failed` | Fix the user/password in `DATABASE_URL` |
| `AttributeError: module 'bcrypt' has no attribute '__about__'` or bcrypt `ValueError` | Install the pinned version: `pip install bcrypt==4.0.1` |
| `pip install` tries to compile Rust / `pydantic-core` | Use Python 3.11 or 3.12 |
| Column missing / `no such column` after editing a model | Reset the database (see [Database changes](#database-changes)) |
| `422 Unprocessable Entity` | Request body doesn't match the schema; the `detail` field says which field |
| Logged out unexpectedly | JWT expired (`ACCESS_TOKEN_EXPIRE_MINUTES`) or `SECRET_KEY` changed |
| `vite: command not found` | Run `npm install` in `frontend/` |

---

## 🤝 Contributing

1. Fork the repo and create a branch: `git checkout -b feature/my-feature`
2. Make your changes, then check both apps still start and `npm run build` passes
3. Commit with a clear message and open a Pull Request against `main`

---

## 👨‍💻 Authors

- **Tonmoy Chandra Mudi**: author
- **Masud Ibn Musa**: contributor ([GitHub](https://github.com/masudibnmusa))

## 📜 License

[MIT](LICENSE) © 2026 Tonmoy Chandra Mudi
