"""
Test script for Kafka integration in Fast React Movies application.
This script tests sending messages to Kafka topics.
"""

import asyncio
import json
import logging
from datetime import datetime
from backend.kafkaConnection import send_kafka_message, get_kafka_connection

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_kafka_messages():
    """Test sending various types of messages to Kafka."""
    logger.info("🚀 Testing Kafka message sending...")
    
    try:
        # Initialize Kafka connection
        await get_kafka_connection()
        logger.info("✅ Kafka connection established")
        
        # Test user registration event
        user_event = {
            "event": "user_registered",
            "user_id": 12345,
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "registered_at": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat(),
        }
        
        success = await send_kafka_message("user-events", user_event, "12345")
        logger.info(f"User registration event sent: {'✅' if success else '❌'}")
        
        # Test user login event
        login_event = {
            "event": "user_login",
            "user_id": 12345,
            "username": "testuser",
            "email": "test@example.com",
            "login_time": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat(),
        }
        
        success = await send_kafka_message("user-events", login_event, "12345")
        logger.info(f"User login event sent: {'✅' if success else '❌'}")
        
        # Test movie creation event
        movie_event = {
            "event": "movie_created",
            "movie_id": 67890,
            "imdb_id": "tt1234567",
            "title": "Test Movie",
            "year": 2023,
            "type": "movie",
            "owner_id": 12345,
            "created_at": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat(),
        }
        
        success = await send_kafka_message("movie-events", movie_event, "67890")
        logger.info(f"Movie creation event sent: {'✅' if success else '❌'}")
        
        # Test playlist creation event
        playlist_event = {
            "event": "playlist_created",
            "playlist_id": 11111,
            "owner_id": 12345,
            "name": "My Test Playlist",
            "created_at": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat(),
        }
        
        success = await send_kafka_message("playlist-events", playlist_event, "11111")
        logger.info(f"Playlist creation event sent: {'✅' if success else '❌'}")
        
        logger.info("🎉 All test messages sent successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error in Kafka test: {e}")

async def test_kafka_batch_messages():
    """Test sending multiple messages in sequence."""
    logger.info("🚀 Testing batch message sending...")
    
    try:
        # Send multiple user login events
        for i in range(5):
            login_event = {
                "event": "user_login",
                "user_id": 12345 + i,
                "username": f"testuser{i}",
                "email": f"test{i}@example.com",
                "login_time": datetime.now().isoformat(),
                "timestamp": datetime.now().isoformat(),
            }
            
            success = await send_kafka_message("user-events", login_event, str(12345 + i))
            logger.info(f"Batch login event {i+1}/5 sent: {'✅' if success else '❌'}")
            
            # Small delay between messages
            await asyncio.sleep(0.1)
        
        logger.info("🎉 Batch test completed!")
        
    except Exception as e:
        logger.error(f"❌ Error in batch test: {e}")

async def main():
    """Main test function."""
    print("=" * 60)
    print("🎬 Fast React Movies - Kafka Integration Test")
    print("=" * 60)
    
    await test_kafka_messages()
    print()
    await test_kafka_batch_messages()
    
    print("=" * 60)
    print("✅ Test completed! Check your Kafka consumer for received messages.")
    print("💡 To run the consumer, use: python -m backend.kafka_consumer")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())