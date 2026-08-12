import asyncio
import logging
from kafkaConnection import KafkaConnection

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class EventProcessor:
    """Process different types of events from Kafka topics."""
    
    async def process_user_event(self, message):
        """Process user-related events."""
        try:
            event = message.get('event')
            user_id = message.get('user_id')
            timestamp = message.get('timestamp')
            
            logger.info(f"Processing user event: {event} for user {user_id}")
            
            if event == 'user_registered':
                await self._handle_user_registration(message)
            elif event == 'user_login':
                await self._handle_user_login(message)
            else:
                logger.warning(f"Unknown user event: {event}")
                
        except Exception as e:
            logger.error(f"Error processing user event: {e}")
    
    async def process_movie_event(self, message):
        """Process movie-related events."""
        try:
            event = message.get('event')
            movie_id = message.get('movie_id')
            timestamp = message.get('timestamp')
            
            logger.info(f"Processing movie event: {event} for movie {movie_id}")
            
            if event == 'movie_created':
                await self._handle_movie_creation(message)
            else:
                logger.warning(f"Unknown movie event: {event}")
                
        except Exception as e:
            logger.error(f"Error processing movie event: {e}")
    
    async def process_playlist_event(self, message):
        """Process playlist-related events."""
        try:
            event = message.get('event')
            playlist_id = message.get('playlist_id')
            timestamp = message.get('timestamp')
            
            logger.info(f"Processing playlist event: {event} for playlist {playlist_id}")
            
            if event == 'playlist_created':
                await self._handle_playlist_creation(message)
            else:
                logger.warning(f"Unknown playlist event: {event}")
                
        except Exception as e:
            logger.error(f"Error processing playlist event: {e}")
    
    async def _handle_user_registration(self, message):
        """Handle user registration event."""
        user_id = message.get('user_id')
        username = message.get('username')
        email = message.get('email')
        
        logger.info(f"New user registered: {username} ({email}) with ID: {user_id}")
    
    async def _handle_user_login(self, message):
        """Handle user login event."""
        user_id = message.get('user_id')
        username = message.get('username')
        login_time = message.get('login_time')
        
        logger.info(f"User login: {username} (ID: {user_id}) at {login_time}")
    
    
    async def _handle_movie_creation(self, message):
        """Handle movie creation event."""
        movie_id = message.get('movie_id')
        title = message.get('title')
        owner_id = message.get('owner_id')
        imdb_id = message.get('imdb_id')
        
        logger.info(f"New movie added: {title} (ID: {movie_id}) by user {owner_id}")
        
    async def _handle_playlist_creation(self, message):
        """Handle playlist creation event."""
        playlist_id = message.get('playlist_id')
        name = message.get('name')
        owner_id = message.get('owner_id')
        
        logger.info(f"New playlist created: {name} (ID: {playlist_id}) by user {owner_id}")


class KafkaEventConsumer:
    """Main Kafka consumer for processing events."""
    
    def __init__(self):
        self.kafka_connection = KafkaConnection()
        self.event_processor = EventProcessor()
        self.topics = {
            'user-events': self.event_processor.process_user_event,
            'movie-events': self.event_processor.process_movie_event,
            'playlist-events': self.event_processor.process_playlist_event,
        }
    
    async def start_consuming(self):
        """Start consuming messages from all topics."""
        logger.info("Starting Kafka event consumer...")
        
        try:
            # Create consumers for each topic
            consumers = []
            for topic, handler in self.topics.items():
                consumer = await self.kafka_connection.create_consumer(
                    topic, 
                    group_id=f'fast-movies-{topic}-consumer'
                )
                if consumer:
                    consumers.append((consumer, handler, topic))
                    logger.info(f"Created consumer for topic: {topic}")
            
            if not consumers:
                logger.error("No consumers created. Exiting.")
                return
            
            # Start consuming from all topics
            tasks = []
            for consumer, handler, topic in consumers:
                task = asyncio.create_task(
                    self._consume_messages(consumer, handler, topic)
                )
                tasks.append(task)
            
            # Wait for all consumer tasks
            await asyncio.gather(*tasks)
            
        except KeyboardInterrupt:
            logger.info("Consumer interrupted by user")
        except Exception as e:
            logger.error(f"Error in consumer: {e}")
        finally:
            await self.kafka_connection.close_connections()
    
    async def _consume_messages(self, consumer, handler, topic):
        """Consume messages from a specific topic."""
        logger.info(f"Starting to consume messages from topic: {topic}")
        
        try:
            async for message in consumer:
                try:
                    logger.debug(f"Received message from {topic}: {message.value}")
                    print(f"Received message from {topic}: {message.value}")
                    await handler(message.value)
                except Exception as e:
                    logger.error(f"Error processing message from {topic}: {e}")
                    
        except Exception as e:
            logger.error(f"Error consuming from topic {topic}: {e}")

async def main():
    """Main function to start the Kafka consumer."""
    logger.info("🚀 Starting Fast React Movies Kafka Consumer")
    
    consumer = KafkaEventConsumer()
    await consumer.start_consuming()

if __name__ == "__main__":
    # Run the consumer
    asyncio.run(main())