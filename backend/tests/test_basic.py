import pytest
from fastapi.testclient import TestClient
from backend.main import create_app

# Create a test app instance
app = create_app()
client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
