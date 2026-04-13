"""Интеграционные тесты с реальной PostgreSQL (см. conftest db_available)."""

from __future__ import annotations

import uuid

import pytest
from fastapi.testclient import TestClient


@pytest.mark.integration
def test_objects_list_public(client: TestClient, db_available: None) -> None:
    r = client.get("/api/v1/objects")
    assert r.status_code == 200
    body = r.json()
    assert isinstance(body, dict)
    assert "items" in body and "total" in body
    assert isinstance(body["items"], list)
    assert isinstance(body["total"], int)


@pytest.mark.integration
def test_register_me_login(client: TestClient, db_available: None) -> None:
    suffix = uuid.uuid4().hex[:10]
    email = f"qa_{suffix}@example.com"
    password = "testpass12"

    reg = client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "role": "worker"},
    )
    assert reg.status_code == 200, reg.text
    token = reg.json()["access_token"]
    assert isinstance(token, str) and len(token) > 10

    me = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me.status_code == 200
    body = me.json()
    assert body["email"] == email
    assert body["role"] == "worker"

    login = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )
    assert login.status_code == 200
    assert login.json()["access_token"]
