"""QA: хеширование паролей без passlib (bcrypt 4/5)."""

from app.security import hash_password, verify_password


def test_hash_and_verify_roundtrip():
    h = hash_password("correct horse battery staple")
    assert h.startswith("$2b$") or h.startswith("$2a$")
    assert verify_password("correct horse battery staple", h) is True
    assert verify_password("wrong", h) is False


def test_unicode_password():
    h = hash_password("пароль-Тест-123")
    assert verify_password("пароль-Тест-123", h) is True


def test_verify_rejects_garbage_hash():
    assert verify_password("x", "not-a-bcrypt-hash") is False
