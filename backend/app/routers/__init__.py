from app.routers.auth import router as auth_router
from app.routers.professors import router as professors_router
from app.routers.bookings import router as bookings_router

__all__ = ["auth_router", "professors_router", "bookings_router"]
