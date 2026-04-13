from fastapi import APIRouter

from app.api.v1 import (
    admin_api,
    analytics,
    auth,
    chat,
    enterprise_billing,
    integrations_api,
    notifications_api,
    object_responses,
    organizations,
    profiles,
    reviews,
    shortlist,
    talent,
    work_objects,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profiles.router)
api_router.include_router(talent.router)
api_router.include_router(shortlist.router)
api_router.include_router(notifications_api.router)
api_router.include_router(organizations.router)
api_router.include_router(analytics.router)
api_router.include_router(admin_api.router)
api_router.include_router(enterprise_billing.router)
api_router.include_router(integrations_api.router)
api_router.include_router(work_objects.router)
api_router.include_router(object_responses.router)
api_router.include_router(chat.router)
api_router.include_router(reviews.router)
