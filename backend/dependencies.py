from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from .database import get_db
from .models import User
from .schemas.user import TokenData
from .services.auth_service import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

def get_token_from_request(request: Request, token: Optional[str] = Depends(oauth2_scheme)) -> Optional[str]:
    # Check cookie first, fallback to bearer token
    cookie_token = request.cookies.get("token")
    if cookie_token:
        return cookie_token
    return token

async def get_current_user(token: Optional[str] = Depends(get_token_from_request), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
        
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    token_data = TokenData(email=email)
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user
