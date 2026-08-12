import pytest
import asyncio
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime
import json
import os
import sys

# Get the directory one level above the 'tests' directory
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Add this directory to Python's sys.path
sys.path.append(backend_dir)

from backend.kafkaConnection import KafkaConnection, send_kafka_message, get_kafka_connection
from backend.kafka_consumer import EventProcessor, KafkaEventConsumer

# Test Fixtures
@pytest.fixture
def mock_kafka_connection():
    """Mock Kafka connection for testing"""
    mock_conn = Mock(spec=KafkaConnection)
    mock_conn.producer = Mock()
    mock_conn.consumer = Mock()
    mock_conn._producer_started = True
    mock_conn._consumer_started = True
    return mock_conn

@pytest.fixture
def sample_user_event():
    """Sample user event message"""
    return {
        "event": "user_registered",
        "user_id": 123,
        "username": "testuser",
        "email": "test@example.com",
        "role": "user",
        "registered_at": datetime.now().isoformat(),
        "timestamp": datetime.now().isoformat(),
    }

@pytest.fixture
def sample_movie_event():
    """Sample movie event message"""
    return {
        "event": "movie_created",
        "movie_id": 456,
        "imdb_id": "tt1234567",
        "title": "Test Movie",
        "year": "2023",
        "type": "movie",
        "owner_id": 123,
        "created_at": datetime.now().isoformat(),
        "timestamp": datetime.now().isoformat(),
    }

@pytest.fixture
def sample_playlist_event():
    """Sample playlist event message"""
    return {
        "event": "playlist_created",
        "playlist_id": 789,
        "owner_id": 123,
        "name": "My Test Playlist",
        "created_at": datetime.now().isoformat(),
        "timestamp": datetime.now().isoformat(),
    }

# Kafka Connection Tests
class TestKafkaConnection:
    @pytest.mark.asyncio
    async def test_kafka_connection_creation(self):
        """Test Kafka connection object creation"""
        kafka_conn = KafkaConnection()
        assert kafka_conn.bootstrap_servers == "localhost:9092"
        assert kafka_conn.producer is None
        assert kafka_conn.consumer is None
        assert kafka_conn._producer_started == False
        assert kafka_conn._consumer_started == False

    @pytest.mark.asyncio
    async def test_kafka_connection_with_custom_servers(self):
        """Test Kafka connection with custom bootstrap servers"""
        custom_servers = "kafka1:9092,kafka2:9092"
        kafka_conn = KafkaConnection(bootstrap_servers=custom_servers)
        assert kafka_conn.bootstrap_servers == custom_servers

    @pytest.mark.asyncio
    async def test_create_producer_success(self, mock_kafka_connection):
        """Test successful producer creation"""
        with patch('backend.kafkaConnection.AIOKafkaProducer') as mock_producer_class:
            mock_producer = Mock()
            mock_producer.start = AsyncMock()
            mock_producer_class.return_value = mock_producer
            
            kafka_conn = KafkaConnection()
            result = await kafka_conn.create_producer()
            
            assert result == mock_producer
            mock_producer.start.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_consumer_success(self, mock_kafka_connection):
        """Test successful consumer creation"""
        with patch('backend.kafkaConnection.AIOKafkaConsumer') as mock_consumer_class:
            mock_consumer = Mock()
            mock_consumer.start = AsyncMock()
            mock_consumer_class.return_value = mock_consumer
            
            kafka_conn = KafkaConnection()
            result = await kafka_conn.create_consumer("test-topic", "test-group")
            
            assert result == mock_consumer
            mock_consumer.start.assert_called_once()

    @pytest.mark.asyncio
    async def test_send_message_success(self, mock_kafka_connection):
        """Test successful message sending"""
        mock_producer = Mock()
        mock_producer.send_and_wait = AsyncMock()
        
        kafka_conn = KafkaConnection()
        kafka_conn.producer = mock_producer
        kafka_conn._producer_started = True
        
        message = {"test": "data"}
        result = await kafka_conn.send_message("test-topic", message, "test-key")
        
        assert result == True
        mock_producer.send_and_wait.assert_called_once_with(
            "test-topic", value=message, key="test-key"
        )

    @pytest.mark.asyncio
    async def test_send_message_failure(self, mock_kafka_connection):
        """Test message sending failure"""
        mock_producer = Mock()
        mock_producer.send_and_wait = AsyncMock(side_effect=Exception("Send failed"))
        
        kafka_conn = KafkaConnection()
        kafka_conn.producer = mock_producer
        kafka_conn._producer_started = True
        
        message = {"test": "data"}
        result = await kafka_conn.send_message("test-topic", message, "test-key")
        
        assert result == False

    @pytest.mark.asyncio
    async def test_close_connections_success(self):
        """Test successful connection closure"""
        kafka_conn = KafkaConnection()
        
        # Mock producer and consumer
        mock_producer = Mock()
        mock_producer.stop = AsyncMock()
        mock_consumer = Mock()
        mock_consumer.stop = AsyncMock()
        
        kafka_conn.producer = mock_producer
        kafka_conn.consumer = mock_consumer
        kafka_conn._producer_started = True
        kafka_conn._consumer_started = True
        
        await kafka_conn.close_connections()
        
        mock_producer.stop.assert_called_once()
        mock_consumer.stop.assert_called_once()
        assert kafka_conn._producer_started == False
        assert kafka_conn._consumer_started == False

# Utility Function Tests
class TestKafkaUtilities:
    @pytest.mark.asyncio
    async def test_send_kafka_message_success(self):
        """Test send_kafka_message utility function"""
        with patch('backend.kafkaConnection.get_kafka_connection') as mock_get_conn:
            mock_conn = Mock()
            mock_conn.send_message = AsyncMock(return_value=True)
            mock_get_conn.return_value = mock_conn
            
            result = await send_kafka_message("test-topic", {"test": "data"}, "test-key")
            
            assert result == True
            mock_conn.send_message.assert_called_once_with(
                "test-topic", {"test": "data"}, "test-key"
            )

    @pytest.mark.asyncio
    async def test_send_kafka_message_failure(self):
        """Test send_kafka_message utility function failure"""
        with patch('backend.kafkaConnection.get_kafka_connection') as mock_get_conn:
            mock_get_conn.side_effect = Exception("Connection failed")
            
            result = await send_kafka_message("test-topic", {"test": "data"}, "test-key")
            
            assert result == False

    @pytest.mark.asyncio
    async def test_get_kafka_connection_singleton(self):
        """Test get_kafka_connection returns singleton"""
        with patch('backend.kafkaConnection.KafkaConnection') as mock_kafka_class, \
             patch('backend.kafkaConnection.kafka_connection', None):
            
            mock_instance = Mock()
            mock_instance.create_producer = AsyncMock()
            mock_kafka_class.return_value = mock_instance
            
            # Import to reset module-level variable
            from backend.kafkaConnection import get_kafka_connection
            
            # First call should create new instance
            result1 = await get_kafka_connection()
            # Second call should return same instance
            result2 = await get_kafka_connection()
            
            mock_kafka_class.assert_called_once()
            assert result1 == result2

# Event Processor Tests
class TestEventProcessor:
    @pytest.mark.asyncio
    async def test_process_user_event_registration(self, sample_user_event):
        """Test processing user registration event"""
        processor = EventProcessor()
        
        with patch.object(processor, '_handle_user_registration', new_callable=AsyncMock) as mock_handler:
            await processor.process_user_event(sample_user_event)
            mock_handler.assert_called_once_with(sample_user_event)

    @pytest.mark.asyncio
    async def test_process_user_event_login(self):
        """Test processing user login event"""
        login_event = {
            "event": "user_login",
            "user_id": 123,
            "username": "testuser",
            "login_time": datetime.now().isoformat(),
            "timestamp": datetime.now().isoformat(),
        }
        
        processor = EventProcessor()
        
        with patch.object(processor, '_handle_user_login', new_callable=AsyncMock) as mock_handler:
            await processor.process_user_event(login_event)
            mock_handler.assert_called_once_with(login_event)

    @pytest.mark.asyncio
    async def test_process_user_event_unknown(self):
        """Test processing unknown user event"""
        unknown_event = {
            "event": "user_unknown",
            "user_id": 123,
            "timestamp": datetime.now().isoformat(),
        }
        
        processor = EventProcessor()
        await processor.process_user_event(unknown_event)
        # Should not raise exception, just log warning

    @pytest.mark.asyncio
    async def test_process_movie_event_creation(self, sample_movie_event):
        """Test processing movie creation event"""
        processor = EventProcessor()
        
        with patch.object(processor, '_handle_movie_creation', new_callable=AsyncMock) as mock_handler:
            await processor.process_movie_event(sample_movie_event)
            mock_handler.assert_called_once_with(sample_movie_event)

    @pytest.mark.asyncio
    async def test_process_playlist_event_creation(self, sample_playlist_event):
        """Test processing playlist creation event"""
        processor = EventProcessor()
        
        with patch.object(processor, '_handle_playlist_creation', new_callable=AsyncMock) as mock_handler:
            await processor.process_playlist_event(sample_playlist_event)
            mock_handler.assert_called_once_with(sample_playlist_event)

    @pytest.mark.asyncio
    async def test_handle_user_registration(self, sample_user_event):
        """Test user registration handler"""
        processor = EventProcessor()
        # This should not raise an exception
        await processor._handle_user_registration(sample_user_event)

    @pytest.mark.asyncio
    async def test_handle_user_login(self):
        """Test user login handler"""
        login_event = {
            "user_id": 123,
            "username": "testuser",
            "login_time": datetime.now().isoformat(),
        }
        
        processor = EventProcessor()
        # This should not raise an exception
        await processor._handle_user_login(login_event)

    @pytest.mark.asyncio
    async def test_handle_movie_creation(self, sample_movie_event):
        """Test movie creation handler"""
        processor = EventProcessor()
        # This should not raise an exception
        await processor._handle_movie_creation(sample_movie_event)

    @pytest.mark.asyncio
    async def test_handle_playlist_creation(self, sample_playlist_event):
        """Test playlist creation handler"""
        processor = EventProcessor()
        # This should not raise an exception
        await processor._handle_playlist_creation(sample_playlist_event)

    @pytest.mark.asyncio
    async def test_process_event_exception_handling(self):
        """Test event processing with malformed message"""
        processor = EventProcessor()
        
        # Malformed message (no 'event' field)
        malformed_event = {"user_id": 123}
        
        # Should not raise exception, should handle gracefully
        await processor.process_user_event(malformed_event)
        await processor.process_movie_event(malformed_event)
        await processor.process_playlist_event(malformed_event)

# Kafka Consumer Tests
class TestKafkaEventConsumer:
    def test_kafka_event_consumer_initialization(self):
        """Test KafkaEventConsumer initialization"""
        consumer = KafkaEventConsumer()
        
        # Use string comparison instead of isinstance due to import path differences
        assert "KafkaConnection" in str(type(consumer.kafka_connection))
        assert isinstance(consumer.event_processor, EventProcessor)
        assert len(consumer.topics) == 3
        assert 'user-events' in consumer.topics
        assert 'movie-events' in consumer.topics
        assert 'playlist-events' in consumer.topics

    @pytest.mark.asyncio
    async def test_start_consuming_no_consumers(self):
        """Test start consuming when no consumers can be created"""
        consumer = KafkaEventConsumer()
        
        with patch.object(consumer.kafka_connection, 'create_consumer', return_value=None):
            # Should exit gracefully when no consumers created
            await consumer.start_consuming()

    @pytest.mark.asyncio
    async def test_consume_messages_success(self):
        """Test successful message consumption"""
        consumer = KafkaEventConsumer()
        mock_handler = AsyncMock()
        
        # Mock consumer with async iterator
        mock_consumer = Mock()
        mock_message = Mock()
        mock_message.value = {"event": "test", "data": "value"}
        
        async def mock_iter():
            yield mock_message
            return  # End iteration to prevent infinite loop
        
        mock_consumer.__aiter__ = mock_iter
        
        # This would run indefinitely in real scenario, so we'll just test the setup
        with patch('asyncio.create_task') as mock_create_task:
            await consumer._consume_messages(mock_consumer, mock_handler, "test-topic")

# Integration Tests
class TestKafkaIntegration:
    @pytest.mark.asyncio
    async def test_end_to_end_message_flow(self):
        """Test end-to-end message flow from sending to processing"""
        # This test would require a real Kafka instance, so we'll mock it
        with patch('backend.kafkaConnection.AIOKafkaProducer') as mock_producer_class, \
             patch('backend.kafkaConnection.AIOKafkaConsumer') as mock_consumer_class:
            
            # Mock producer
            mock_producer = Mock()
            mock_producer.start = AsyncMock()
            mock_producer.send_and_wait = AsyncMock()
            mock_producer_class.return_value = mock_producer
            
            # Test sending a message
            kafka_conn = KafkaConnection()
            await kafka_conn.create_producer()
            
            test_message = {"event": "test", "data": "value"}
            result = await kafka_conn.send_message("test-topic", test_message, "test-key")
            
            assert result == True
            mock_producer.send_and_wait.assert_called_once()

    @pytest.mark.asyncio
    async def test_kafka_error_recovery(self):
        """Test Kafka error recovery scenarios"""
        kafka_conn = KafkaConnection()
        
        # Test producer creation failure
        with patch('backend.kafkaConnection.AIOKafkaProducer', side_effect=Exception("Kafka unavailable")):
            result = await kafka_conn.create_producer()
            assert result is None

        # Test consumer creation failure
        with patch('backend.kafkaConnection.AIOKafkaConsumer', side_effect=Exception("Kafka unavailable")):
            result = await kafka_conn.create_consumer("test-topic", "test-group")
            assert result is None

# Performance Tests
class TestKafkaPerformance:
    @pytest.mark.asyncio
    async def test_message_serialization_performance(self):
        """Test JSON serialization performance"""
        import time
        
        large_message = {
            "event": "test_event",
            "data": ["item"] * 1000,  # Large data structure
            "timestamp": datetime.now().isoformat()
        }
        
        start_time = time.time()
        serialized = json.dumps(large_message).encode('utf-8')
        end_time = time.time()
        
        # Should serialize quickly
        assert end_time - start_time < 0.1
        assert len(serialized) > 100

    def test_event_processing_performance(self):
        """Test event processing performance"""
        import time
        
        processor = EventProcessor()
        test_event = {
            "event": "user_registered",
            "user_id": 123,
            "username": "testuser",
            "timestamp": datetime.now().isoformat()
        }
        
        start_time = time.time()
        # Synchronous call for performance testing
        asyncio.run(processor._handle_user_registration(test_event))
        end_time = time.time()
        
        # Should process quickly
        assert end_time - start_time < 0.01

# Edge Cases and Error Handling
class TestKafkaEdgeCases:
    @pytest.mark.asyncio
    async def test_empty_message_handling(self):
        """Test handling of empty or null messages"""
        processor = EventProcessor()
        
        # Empty message
        await processor.process_user_event({})
        
        # None message (should be handled gracefully)
        try:
            await processor.process_user_event(None)
        except AttributeError:
            # Expected if None.get() is called
            pass

    @pytest.mark.asyncio
    async def test_malformed_json_handling(self):
        """Test handling of malformed JSON in messages"""
        kafka_conn = KafkaConnection()
        
        # This test is more relevant for the deserializer in actual consumer
        # For now, we'll test that our handlers can deal with missing fields
        processor = EventProcessor()
        
        incomplete_event = {"user_id": 123}  # Missing 'event' field
        await processor.process_user_event(incomplete_event)

    @pytest.mark.asyncio
    async def test_large_message_handling(self):
        """Test handling of very large messages"""
        large_message = {
            "event": "test_event",
            "large_data": "x" * 10000,  # Very large string
            "timestamp": datetime.now().isoformat()
        }
        
        # Should handle large messages without issues
        with patch('backend.kafkaConnection.get_kafka_connection') as mock_get_conn:
            mock_conn = Mock()
            mock_conn.send_message = AsyncMock(return_value=True)
            mock_get_conn.return_value = mock_conn
            
            result = await send_kafka_message("test-topic", large_message)
            assert result == True

    @pytest.mark.asyncio
    async def test_concurrent_message_sending(self):
        """Test sending multiple messages concurrently"""
        with patch('backend.kafkaConnection.get_kafka_connection') as mock_get_conn:
            mock_conn = Mock()
            mock_conn.send_message = AsyncMock(return_value=True)
            mock_get_conn.return_value = mock_conn
            
            # Send multiple messages concurrently
            tasks = []
            for i in range(10):
                message = {"event": f"test_event_{i}", "data": i}
                task = send_kafka_message("test-topic", message)
                tasks.append(task)
            
            results = await asyncio.gather(*tasks)
            assert all(result == True for result in results)