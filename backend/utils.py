import json
from typing import List

def parse_user_interests(user) -> List[str]:
    if not user.interests:
        return []
    try:
        return json.loads(user.interests)
    except json.JSONDecodeError:
        return [user.interests]
