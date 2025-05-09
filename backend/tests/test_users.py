from fastapi.testclient import TestClient
import os
import sys

# Get the directory one level above the 'tests' directory
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Add this directory to Python's sys.path
sys.path.append(backend_dir)


from main import app  # Replace 'main' with the name of your FastAPI app file if different

client = TestClient(app)

def test_create_user():
    payload = {
        "name": "John Doe",
        "email": "johndoe@example.com",
        "password": "securepassword123"
    }
    response = client.post("/data", json=payload)
    assert response.status_code == 201
    response_data = response.json()
    assert response_data["status"] == "success"
    assert response_data["message"] == "User created successfully"
    assert response_data["data"]["name"] == payload["name"]
    assert response_data["data"]["email"] == payload["email"]
