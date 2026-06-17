# 🎓 Professor Office Hour Scheduler

A full-stack web application that allows students to book office hours with professors in a simple, organized, and conflict-free way.

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-blue)
![Tech Stack](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-green)
![Tech Stack](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20SQLite-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🏗️ System Architecture

```text
┌──────────────┐       FastAPI Backend      ┌──────────────┐
│   Frontend   │  ←──────────────────────→  │   Backend    │
│ React + Vite │     JWT Authentication     │   FastAPI    │
└──────────────┘                            └──────────────┘
         │
         ▼
┌─────────────────────────────┐
│ PostgreSQL / SQLite Database│
│      SQLAlchemy ORM         │
└─────────────────────────────┘
```

---

## ✨ Features

### 👨‍🎓 Student Features

- Register and login securely
- Browse available professors
- View real-time office hour availability
- Book appointments without scheduling conflicts
- Cancel upcoming appointments
- Access booking history

### 👨‍🏫 Professor Features

- Create office hour slots
- Manage availability schedules
- Set office location and appointment duration
- View student booking requests
- Manage and cancel appointments

### 🔐 System Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- Double-booking prevention
- Time conflict validation
- Responsive design
- Secure password hashing
- RESTful API architecture
- Dark Mode support

---

## 🧰 Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React 18, Tailwind CSS, Axios, React Router, Lucide Icons |
| Backend | FastAPI |
| Database | PostgreSQL / SQLite |
| ORM | SQLAlchemy |
| Validation | Pydantic v2 |
| Authentication | JWT, bcrypt |
| Development Tools | Vite, Uvicorn, pyenv |

---

## 📁 Project Structure

```text
Professor-Office-Hour-Scheduler/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   └── utils/
│   │
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 🚀 Quick Start

### 📋 Prerequisites

- Node.js 18+
- npm
- Python 3.11 – 3.13
- PostgreSQL (optional)
- SQLite (development supported)

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/techytcm/Professor-Office-Hour-Scheduler.git

cd Professor-Office-Hour-Scheduler
```

---

## ⚙️ Backend Setup

```bash
cd backend

python -m venv venv
```

### Activate Virtual Environment

#### Linux / macOS

```bash
source venv/bin/activate
```

#### Windows

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and secret key.

### Start FastAPI Server

```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at:

```text
http://localhost:8000
```

Swagger Documentation:

```text
http://localhost:8000/docs
```

ReDoc Documentation:

```text
http://localhost:8000/redoc
```

---

## 🎨 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

## 🔧 Configuration

### Backend Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/office_hours

# SQLite alternative
# DATABASE_URL=sqlite:///./office_hours.db

SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend Environment Variables

Create `frontend/.env`

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|----------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login and receive JWT |
| GET | `/api/auth/profile` | ✅ | Get current user |

---

### Professors

| Method | Endpoint | Access | Description |
|----------|----------|---------|-------------|
| GET | `/api/professors` | Authenticated | List all professors |
| GET | `/api/professors/{id}/slots` | Authenticated | Get available slots |
| GET | `/api/professors/me/slots` | Professor | View own slots |
| POST | `/api/professors/me/slots` | Professor | Create slot |
| DELETE | `/api/professors/me/slots/{id}` | Professor | Delete slot |
| GET | `/api/professors/me/bookings` | Professor | View bookings |

---

### Bookings

| Method | Endpoint | Access | Description |
|----------|----------|---------|-------------|
| GET | `/api/bookings/my` | Student | View personal bookings |
| POST | `/api/bookings` | Student | Create booking |
| DELETE | `/api/bookings/{id}` | Authenticated | Cancel booking |

---

## 🗄️ Database Schema

### Users

| Field | Type | Description |
|---------|------|-------------|
| id | PK | Auto Increment |
| email | String | Unique |
| hashed_password | String | bcrypt hashed password |
| first_name | String | Required |
| last_name | String | Required |
| role | Enum | student / professor |
| department | String | Professor only |

---

### Office Hours

| Field | Type | Description |
|---------|------|-------------|
| id | PK | Auto Increment |
| professor_id | FK | User reference |
| start_time | DateTime | Slot start |
| end_time | DateTime | Slot end |
| location | String | Office location |
| max_students | Integer | Capacity |
| is_booked | Boolean | Availability |

---

### Bookings

| Field | Type | Description |
|---------|------|-------------|
| id | PK | Auto Increment |
| student_id | FK | Student reference |
| office_hour_id | FK | Office hour reference |
| status | Enum | confirmed / cancelled |
| notes | Text | Optional discussion topic |
| created_at | DateTime | Timestamp |

---

## 🎨 Frontend Features

- JWT-based authentication
- Auto-login using stored token
- Protected routes
- Role-based UI rendering
- Real-time slot availability updates
- Appointment booking modal
- Responsive navigation
- Professor scheduling dashboard
- Student booking history
- 🌙 Dark Mode toggle
- 💾 Theme persistence using LocalStorage
- 🔄 Automatic theme restoration after refresh
- 📱 Mobile-first responsive design
- ⚡ Fast Vite-powered development experience

---

## 🔒 Security Features

| Feature | Implementation |
|----------|---------------|
| Password Hashing | bcrypt |
| Authentication | JWT Tokens |
| Authorization | Role-Based Access Control |
| Input Validation | Pydantic Models |
| Conflict Prevention | Booking overlap validation |
| Database Protection | SQLAlchemy ORM |
| Session Security | Token expiration |

---

## 🔐 Authentication Flow

```text
┌─────────┐     Register/Login      ┌─────────┐
│Frontend │ ──────────────────────► │ Backend │
│ (React) │ ◄──── JWT Token ──────  │ FastAPI │
└────┬────┘                         └────┬────┘
     │                                   │
     │ Store token in localStorage       │
     │                                   │
     │ Send Authorization Header         │
     ▼                                   ▼
┌─────────────────────────────────────────┐
│            Protected Routes             │
│      JWT Validation via Dependencies    │
└─────────────────────────────────────────┘
```

---

## 🧪 Development Tips

### Backend

```bash
uvicorn app.main:app --reload
```

### Frontend

```bash
npm run dev
```

### Useful Tools

- Swagger UI (`/docs`)
- ReDoc (`/redoc`)
- Postman
- pgAdmin
- DB Browser for SQLite

---

## 🐛 Troubleshooting

| Issue | Solution |
|---------|----------|
| vite: command not found | Run `npm install` |
| Module not found | Verify file paths |
| Network Error | Ensure backend is running |
| 422 Unprocessable Entity | Verify request payload |
| bcrypt/passlib errors | Install compatible bcrypt version |
| Database does not exist | Create database manually |
| Python 3.14 issues | Use Python 3.11–3.13 |

---

## 📸 Screenshots

| Student Dashboard | Professor Dashboard |
|------------------|--------------------|
| `docs/screenshots/student.png` | `docs/screenshots/professor.png` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit changes

```bash
git commit -m "Add amazing feature"
```

4. Push changes

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

## 👨‍💻 Author

**Tonmoy Chandra Mudi**

## 👨‍💻 Contributor

**Masud Ibn Musa**

Github Link https://github.com/masudibnmusa

Built using React, FastAPI, PostgreSQL, SQLAlchemy, and Tailwind CSS.

---

## 📜 License

Distributed under the **MIT License**.

Feel free to use, modify, and distribute this project.

---

## 🙏 Acknowledgments

- FastAPI
- React
- Tailwind CSS
- SQLAlchemy
- PostgreSQL
- Vite