import sys
import os

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.append(project_root)

from main import app
import pytest
from httpx import AsyncClient

from main import app  # Assuming your FastAPI app is in a file named main.py


@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        response = await client.post(
            "/api/auth/login", json={"email": "alexa@gmail.com", "password": "pass12345"}
        )
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_login_user_with_invalid_credentials():
    async with AsyncClient(app=app, base_url="http://localhost:8000") as client:
        response = await client.post(
            "/api/auth/login",
            json={"username": "nouser@gmail.com", "password": "wrongpassword"},
        )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
