def test_signup_success(client):
    response = client.post("/auth/signup", json={
        "email": "newuser@example.com",
        "password": "strongpassword123",
        "name": "New User"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["name"] == "New User"
    assert "hashed_password" not in data

def test_signup_duplicate_email(client, test_user):
    response = client.post("/auth/signup", json={
        "email": test_user.email,
        "password": "anotherpassword",
        "name": "Another User"
    })
    assert response.status_code == 409
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client, test_user):
    response = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "testpassword123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.cookies.get("token") is not None
    assert response.cookies.get("logged_in") == "true"

def test_login_failure(client, test_user):
    response = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert "access_token" not in response.json()
