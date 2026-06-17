from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth_router, professors_router, bookings_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Professor Office Hour Scheduler",
    description="API for managing professor office hours and student bookings",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix="/api")
app.include_router(professors_router, prefix="/api")
app.include_router(bookings_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Professor Office Hour Scheduler API", "version": "1.0.0"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}