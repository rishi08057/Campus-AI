from pydantic import BaseModel, Field
from typing import List

class UserProfile(BaseModel):
    id: int = Field(..., description="The unique identifier for the user.")
    name: str = Field(..., min_length=2, max_length=100, description="The full name of the student.")
    department: str = Field(..., description="The academic department of the student.")
    year: str = Field(..., description="The current academic year of the student.")
    interests: List[str] = Field(default_factory=list, description="List of topics the student is interested in.")
