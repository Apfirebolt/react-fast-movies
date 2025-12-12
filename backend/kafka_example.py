"""
Example usage of Kafka utilities for the Fast React Movies application.
This file demonstrates how to use the KafkaManager and related utilities.
"""

import asyncio
import logging
from typing import Dict, Any, Optional
from kafkaUtils import (
    KafkaConfig, 
    KafkaManager, 
    send_user_event, 
    send_movie_event,
    send_recommendation_event,
    handle_user_event,
    handle_movie_event,
    handle_recommendation_event
)
from config import (
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_CLIENT_ID,
    KAFKA_GROUP_ID,
    KAFKA_TOPICS
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MovieKafkaService:
    """Service class for handling Kafka operations in the movies application."""
    
    def __init__(self):
        self.config = KafkaConfig(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            client_id=KAFKA_CLIENT_ID
        )
        self.kafka_manager = KafkaManager(self.config)
    
    async def initialize(self):
        """Initialize the Kafka service."""
        try:
            await self.kafka_manager.start_producer()
            logger.info("Movie Kafka service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Movie Kafka service: {e}")
            raise
    
    async def shutdown(self):
        """Shutdown the Kafka service."""
        await self.kafka_manager.shutdown()
        logger.info("Movie Kafka service shutdown completed")
    
    # User-related events
    async def track_user_login(self, user_id: str, user_data: Dict[str, Any]) -> bool:
        """Track user login event."""
        return await send_user_event(
            self.kafka_manager,
            user_id,
            "user_login",
            {
                "email": user_data.get("email"),
                "login_time": user_data.get("login_time"),
                "ip_address": user_data.get("ip_address")
            }
        )
    
    async def track_user_logout(self, user_id: str) -> bool:
        """Track user logout event."""
        return await send_user_event(
            self.kafka_manager,
            user_id,
            "user_logout",
            {"logout_time": asyncio.get_event_loop().time()}
        )
    
    async def track_user_registration(self, user_id: str, user_data: Dict[str, Any]) -> bool:
        """Track user registration event."""
        return await send_user_event(
            self.kafka_manager,
            user_id,
            "user_registration",
            {
                "email": user_data.get("email"),
                "registration_time": user_data.get("registration_time"),
                "referral_source": user_data.get("referral_source")
            }
        )
    
    # Movie-related events
    async def track_movie_view(self, movie_id: str, user_id: str, view_data: Dict[str, Any]) -> bool:
        """Track movie view event."""
        return await send_movie_event(
            self.kafka_manager,
            movie_id,
            "movie_view",
            {
                "user_id": user_id,
                "view_duration": view_data.get("view_duration"),
                "view_time": view_data.get("view_time"),
                "device_type": view_data.get("device_type")
            }
        )
    
    async def track_movie_rating(self, movie_id: str, user_id: str, rating: float) -> bool:
        """Track movie rating event."""
        return await send_movie_event(
            self.kafka_manager,
            movie_id,
            "movie_rating",
            {
                "user_id": user_id,
                "rating": rating,
                "rating_time": asyncio.get_event_loop().time()
            }
        )
    
    async def track_movie_search(self, search_query: str, user_id: str, results_count: int) -> bool:
        """Track movie search event."""
        return await send_movie_event(
            self.kafka_manager,
            f"search_{hash(search_query)}",
            "movie_search",
            {
                "user_id": user_id,
                "search_query": search_query,
                "results_count": results_count,
                "search_time": asyncio.get_event_loop().time()
            }
        )
    
    # Playlist-related events
    async def track_playlist_creation(self, playlist_id: str, user_id: str, playlist_data: Dict[str, Any]) -> bool:
        """Track playlist creation event."""
        message = {
            "playlist_id": playlist_id,
            "user_id": user_id,
            "event_type": "playlist_created",
            "event_data": {
                "name": playlist_data.get("name"),
                "description": playlist_data.get("description"),
                "is_public": playlist_data.get("is_public", False),
                "creation_time": asyncio.get_event_loop().time()
            },
            "timestamp": asyncio.get_event_loop().time()
        }
        return await self.kafka_manager.send_message(
            KAFKA_TOPICS['PLAYLIST_EVENTS'], 
            message, 
            key=playlist_id
        )
    
    async def track_playlist_update(self, playlist_id: str, user_id: str, update_data: Dict[str, Any]) -> bool:
        """Track playlist update event."""
        message = {
            "playlist_id": playlist_id,
            "user_id": user_id,
            "event_type": "playlist_updated",
            "event_data": update_data,
            "timestamp": asyncio.get_event_loop().time()
        }
        return await self.kafka_manager.send_message(
            KAFKA_TOPICS['PLAYLIST_EVENTS'], 
            message, 
            key=playlist_id
        )
    
    # Recommendation events
    async def send_user_recommendations(self, user_id: str, recommendations: list) -> bool:
        """Send recommendations for a user."""
        return await send_recommendation_event(
            self.kafka_manager,
            user_id,
            recommendations
        )
    
    # Consumer methods
    async def start_event_consumers(self):
        """Start consumers for different event types."""
        try:
            # Start user events consumer
            user_consumer = await self.kafka_manager.create_consumer(
                "user_events_consumer",
                [KAFKA_TOPICS['USER_EVENTS']],
                f"{KAFKA_GROUP_ID}_users"
            )
            
            # Start movie events consumer
            movie_consumer = await self.kafka_manager.create_consumer(
                "movie_events_consumer",
                [KAFKA_TOPICS['MOVIE_EVENTS']],
                f"{KAFKA_GROUP_ID}_movies"
            )
            
            # Start recommendation events consumer
            recommendation_consumer = await self.kafka_manager.create_consumer(
                "recommendation_events_consumer",
                [KAFKA_TOPICS['RECOMMENDATIONS']],
                f"{KAFKA_GROUP_ID}_recommendations"
            )
            
            # Start playlist events consumer
            playlist_consumer = await self.kafka_manager.create_consumer(
                "playlist_events_consumer",
                [KAFKA_TOPICS['PLAYLIST_EVENTS']],
                f"{KAFKA_GROUP_ID}_playlists"
            )
            
            # Start consuming messages
            await asyncio.gather(
                user_consumer.consume_messages(handle_user_event),
                movie_consumer.consume_messages(handle_movie_event),
                recommendation_consumer.consume_messages(handle_recommendation_event),
                playlist_consumer.consume_messages(self.handle_playlist_event)
            )
            
        except Exception as e:
            logger.error(f"Error starting event consumers: {e}")
    
    async def handle_playlist_event(self, topic: str, message: Any, key: Optional[str]) -> None:
        """Handle playlist events."""
        try:
            logger.info(f"Received playlist event from topic '{topic}': {message}")
            
            event_type = message.get("event_type")
            playlist_id = message.get("playlist_id")
            user_id = message.get("user_id")
            event_data = message.get("event_data", {})
            
            if event_type == "playlist_created":
                await self._handle_playlist_created(playlist_id, user_id, event_data)
            elif event_type == "playlist_updated":
                await self._handle_playlist_updated(playlist_id, user_id, event_data)
            elif event_type == "playlist_deleted":
                await self._handle_playlist_deleted(playlist_id, user_id)
                
        except Exception as e:
            logger.error(f"Error handling playlist event: {e}")
    
    async def _handle_playlist_created(self, playlist_id: str, user_id: str, event_data: Dict[str, Any]):
        """Handle playlist creation event."""
        # Add your business logic here
        logger.info(f"Processing playlist creation for playlist {playlist_id} by user {user_id}")
        # Example: Update analytics, send notifications, etc.
    
    async def _handle_playlist_updated(self, playlist_id: str, user_id: str, event_data: Dict[str, Any]):
        """Handle playlist update event."""
        # Add your business logic here
        logger.info(f"Processing playlist update for playlist {playlist_id} by user {user_id}")
    
    async def _handle_playlist_deleted(self, playlist_id: str, user_id: str):
        """Handle playlist deletion event."""
        # Add your business logic here
        logger.info(f"Processing playlist deletion for playlist {playlist_id} by user {user_id}")

# Example usage and testing functions
async def test_kafka_operations():
    """Test basic Kafka operations."""
    service = MovieKafkaService()
    
    try:
        # Initialize the service
        await service.initialize()
        
        # Test user events
        await service.track_user_login("user123", {
            "email": "user@example.com",
            "login_time": asyncio.get_event_loop().time(),
            "ip_address": "192.168.1.1"
        })
        
        # Test movie events
        await service.track_movie_view("movie456", "user123", {
            "view_duration": 120,
            "view_time": asyncio.get_event_loop().time(),
            "device_type": "web"
        })
        
        await service.track_movie_rating("movie456", "user123", 4.5)
        
        # Test playlist events
        await service.track_playlist_creation("playlist789", "user123", {
            "name": "My Favorite Movies",
            "description": "A collection of my favorite films",
            "is_public": True
        })
        
        # Test recommendations
        recommendations = [
            {"movie_id": "movie101", "score": 0.95, "reason": "Similar to liked movies"},
            {"movie_id": "movie102", "score": 0.89, "reason": "Popular in your genre"},
            {"movie_id": "movie103", "score": 0.87, "reason": "Trending now"}
        ]
        await service.send_user_recommendations("user123", recommendations)
        
        logger.info("All Kafka operations completed successfully")
        
    except Exception as e:
        logger.error(f"Error in Kafka operations test: {e}")
    finally:
        # Shutdown the service
        await service.shutdown()

async def run_consumer_example():
    """Example of running consumers to process events."""
    service = MovieKafkaService()
    
    try:
        await service.initialize()
        logger.info("Starting event consumers...")
        
        # This will run indefinitely, consuming events
        await service.start_event_consumers()
        
    except KeyboardInterrupt:
        logger.info("Consumer interrupted by user")
    except Exception as e:
        logger.error(f"Error running consumers: {e}")
    finally:
        await service.shutdown()

if __name__ == "__main__":
    # Uncomment the function you want to test
    
    # Test basic operations
    asyncio.run(test_kafka_operations())
    
    # Test consumers (runs indefinitely)
    # asyncio.run(run_consumer_example())