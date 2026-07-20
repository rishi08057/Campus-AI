from typing import List

from sqlalchemy.orm import Session

from ..schemas.recommendation import Recommendation
from ..schemas.event import Event, EventSave, EventRegistration
from ..schemas.user import UserProfile
from ..models import Event as DBEvent


class RecommendationService:
    def get_personalized_recommendations(
        self,
        db: Session,
        user: UserProfile,
        saved_events: List[EventSave],
        registered_events: List[EventRegistration],
    ) -> List[Recommendation]:
        """
        Generate personalized event recommendations based on user interests,
        saved events, and registration history.
        """

        recommendations = []

        # Load events from PostgreSQL
        events = db.query(DBEvent).all()

        interacted_event_ids = (
            {s.eventId for s in saved_events}
            | {r.eventId for r in registered_events}
        )

        user_interests = [
            interest.lower()
            for interest in user.interests
        ]

        action_categories = set()

        # Find categories from previously interacted events
        for event_id in interacted_event_ids:
            event = next(
                (
                    e
                    for e in events
                    if e.id == event_id
                ),
                None,
            )

            if event:
                action_categories.add(
                    event.category.lower()
                )

        for event in events:

            # Skip already registered events
            if any(
                r.eventId == event.id
                for r in registered_events
            ):
                continue

            score = 0.0
            reason = "popular"

            # Interest/category match
            if event.category.lower() in user_interests:
                score += 0.5
                reason = "category-match"

            # Previous behavior match
            if event.category.lower() in action_categories:
                score += 0.3

                if score > 0.5:
                    reason = "personalized"

            # Keyword match
            for interest in user_interests:
                if (
                    interest in event.title.lower()
                    or interest in event.description.lower()
                ):
                    score += 0.2
                    reason = "personalized"

            # Default score
            if score == 0:
                score = 0.1
                reason = "popular"

            final_score = min(
                score + 0.5,
                0.95,
            )

            recommendations.append(
                Recommendation(
                    event=Event.model_validate(event),
                    reason=reason,
                    confidence=final_score,
                    score=final_score,
                )
            )

        recommendations.sort(
            key=lambda x: x.score,
            reverse=True,
        )

        return recommendations[:6]


recommendation_service = RecommendationService()