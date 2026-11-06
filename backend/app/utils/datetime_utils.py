from datetime import datetime, timezone


def utcnow() -> datetime:
    """Current time as a naive UTC datetime (how all times are stored in the DB)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def to_naive_utc(value: datetime) -> datetime:
    """Convert an incoming datetime to naive UTC for storage.

    Naive inputs are assumed to already be UTC.
    """
    if value.tzinfo is not None:
        return value.astimezone(timezone.utc).replace(tzinfo=None)
    return value


def mark_utc(value: datetime | None) -> datetime | None:
    """Attach UTC tzinfo to a stored naive datetime so JSON output ends in +00:00."""
    if value is not None and value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value
