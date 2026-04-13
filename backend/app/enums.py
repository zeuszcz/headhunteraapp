from enum import StrEnum


class UserRole(StrEnum):
    COMPANY = "company"
    WORKER = "worker"
    BRIGADE = "brigade"


class WorkObjectStatus(StrEnum):
    DRAFT = "draft"
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class OrgMemberRole(StrEnum):
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"


class SubscriptionStatus(StrEnum):
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELLED = "cancelled"


class ObjectResponseStatus(StrEnum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class ApplicantKind(StrEnum):
    WORKER = "worker"
    BRIGADE = "brigade"
