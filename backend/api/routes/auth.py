import os

from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from ...limiter import limiter

from ...database import get_db
from ...dependencies import get_current_user
from ...models import User
from ...schemas.user import Token, UserCreate, UserOut
from ...services.auth_service import (
    create_access_token,
    get_password_hash,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])

# --------------------------------------------------
# Cookie Configuration
# --------------------------------------------------

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
SECURE_COOKIES = ENVIRONMENT == "production"

# --------------------------------------------------
# Authentication Routes
# --------------------------------------------------

@router.post(
    "/signup",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("5/minute")
def signup(
    request: Request,
    user_in: UserCreate,
    db: Session = Depends(get_db),
):
    hashed_password = get_password_hash(user_in.password)

    new_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        name=user_in.name,
    )

    db.add(new_user)

    try:
        db.commit()

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
@limiter.limit("10/minute")
def login(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "is_admin": getattr(user, "is_admin", False),
        }
    )

    # HttpOnly JWT cookie
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        secure=SECURE_COOKIES,
        samesite="strict",
        max_age=60 * 60 * 24,
        path="/",
    )

    # Frontend state cookie
    response.set_cookie(
        key="logged_in",
        value="true",
        httponly=False,
        secure=SECURE_COOKIES,
        samesite="strict",
        max_age=60 * 60 * 24,
        path="/",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="token",
        path="/",
    )

    response.delete_cookie(
        key="logged_in",
        path="/",
    )

    return {
        "message": "Logged out successfully",
    }
@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user