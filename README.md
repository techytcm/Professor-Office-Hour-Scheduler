# 🎓 Professor Office Hour Scheduler

A full-stack web application that allows students to book office hours with professors in a simple, organized, and conflict-free way.

> 🚧 This project is currently in development.

---

## 🎯 Project Goal

The system replaces manual appointment scheduling (email, messaging, etc.) with a digital platform where:

- Students can book available professor office hours
- Professors can manage their availability
- The system prevents scheduling conflicts automatically

---

## ⚙️ Features (Planned)

### 👨‍🎓 Student
- Register / Login
- View professors
- See available time slots
- Book appointments
- Cancel bookings
- View booking history

### 👨‍🏫 Professor
- Create office hours
- Manage availability slots
- View student bookings
- Cancel/manage appointments

### 🔐 System
- JWT authentication
- Role-based access (Student / Professor)
- Prevent double booking
- Time conflict validation

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- FastAPI (Python)
- JWT Authentication

### Database
- PostgreSQL

---

## 🏗️ System Architecture Design

### 🔹 High-Level Architecture

                 🎨 FRONTEND
        ┌──────────────────────────────┐
        │  React.js + Tailwind CSS     │
        │  (User Interface Layer)      │
        │  - Pages & Components        │
        │  - User Interaction          │
        └──────────────┬───────────────┘
                       │  REST API (Axios)
                       ▼
                 ⚙️ BACKEND
        ┌──────────────────────────────┐
        │        FastAPI (Python)      │
        │  - JWT Authentication        │
        │  - Booking Management        │
        │  - Conflict Validation       │
        └──────────────┬───────────────┘
                       │  SQL Queries
                       ▼
                 🗄️ DATABASE
        ┌──────────────────────────────┐
        │        PostgreSQL            │
        │  - Users Table               │
        │  - Professors Table          │
        │  - Office Hours Table        │
        │  - Bookings Table            │
        └──────────────────────────────┘