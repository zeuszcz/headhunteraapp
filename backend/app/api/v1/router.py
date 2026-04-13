from fastapi import APIRouter

from app.api.v1 import applications

api_router = APIRouter()
api_router.include_router(applications.router)
