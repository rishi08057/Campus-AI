from datetime import datetime, timezone
import pytest
from ..models import Event

@pytest.fixture(scope="function")
def test_event(db_session):
    event = Event(
        title="Test Event",
        description="A test event",
        venue="Test Venue",
        category="Workshop",
        event_datetime=datetime.now(timezone.utc)
    )
    db_session.add(event)
    db_session.commit()
    db_session.refresh(event)
    return event

def test_admin_stats_unauthorized(client, test_user):
    # Login as normal user
    login_res = client.post("/auth/login", data={"username": "test@example.com", "password": "testpassword123"})
    token = login_res.json()["access_token"]
    
    response = client.get("/admin/stats", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 403

def test_admin_stats_authorized(client, admin_user):
    # Login as admin
    login_res = client.post("/auth/login", data={"username": "admin@example.com", "password": "adminpassword123"})
    token = login_res.json()["access_token"]
    
    response = client.get("/admin/stats", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert "total_events" in response.json()

def test_register_for_event(client, test_user, test_event):
    # Login
    login_res = client.post("/auth/login", data={"username": "test@example.com", "password": "testpassword123"})
    token = login_res.json()["access_token"]
    
    response = client.post("/events/register", 
                           headers={"Authorization": f"Bearer {token}"},
                           json={"eventId": test_event.id})
    assert response.status_code == 200
    assert response.json()["success"] is True

def test_register_duplicate(client, test_user, test_event):
    login_res = client.post("/auth/login", data={"username": "test@example.com", "password": "testpassword123"})
    token = login_res.json()["access_token"]
    
    # Register first time
    client.post("/events/register", 
                headers={"Authorization": f"Bearer {token}"},
                json={"eventId": test_event.id})
                
    # Register second time
    response = client.post("/events/register", 
                           headers={"Authorization": f"Bearer {token}"},
                           json={"eventId": test_event.id})
    assert response.status_code == 200
    assert response.json()["success"] is False
    assert "already registered" in response.json()["message"]
