from typing import List
from ..schemas.recommendation import Recommendation
from ..schemas.event import Event, EventSave, EventRegistration
from ..schemas.user import UserProfile
from ..data.mock_events import MOCK_EVENTS

class RecommendationService:
    def get_personalized_recommendations(
        self, 
        user: UserProfile, 
        saved_events: List[EventSave], 
        registered_events: List[EventRegistration]
    ) -> List[Recommendation]:
        """
        Generate personalized event recommendations based on user interests,
        saved events, and registration history.
        """
        recommendations = []
        
        # Get IDs of events the user already interacted with to avoid recommending them again
        # Actually, sometimes we might want to recommend similar events
        interacted_event_ids = {s.eventId for s in saved_events} | {r.eventId for r in registered_events}
        
        # Categories the user is interested in based on their profile
        user_interests = [i.lower() for i in user.interests]
        
        # Categories the user is interested in based on their actions
        action_categories = set()
        for event_id in interacted_event_ids:
            event = next((e for e in MOCK_EVENTS if e.id == event_id), None)
            if event:
                action_categories.add(event.category.lower())

        for event in MOCK_EVENTS:
            # Skip events the user is already registered for
            if any(r.eventId == event.id for r in registered_events):
                continue
                
            score = 0.0
            reason = "popular"
            
            # Match by interest (category)
            if event.category.lower() in user_interests:
                score += 0.5
                reason = "category-match"
                
            # Match by previous actions (category)
            if event.category.lower() in action_categories:
                score += 0.3
                if score > 0.5:
                    reason = "personalized"
            
            # Keyword match in description/title based on interests
            for interest in user_interests:
                if interest in event.title.lower() or interest in event.description.lower():
                    score += 0.2
                    reason = "personalized"
            
            # Default to popular if no other matches
            if score == 0:
                score = 0.1
                reason = "popular"
                
            # Cap score at 0.95
            final_score = min(score + 0.5, 0.95) # Adding base confidence
            
            recommendations.append(Recommendation(
                event=event,
                reason=reason,
                confidence=final_score,
                score=final_score
            ))
            
        # Sort by score descending
        recommendations.sort(key=lambda x: x.score, reverse=True)
        
        return recommendations[:6]

recommendation_service = RecommendationService()
