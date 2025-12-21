# Test Configuration for Fast React Movies Backend

import pytest
import os
import sys
from unittest.mock import Mock
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Add backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)

# Test Database Configuration
TEST_DATABASE_URL = "sqlite:///./test.db"

# Mock configurations for external services
MOCK_KAFKA_CONFIG = {
    "bootstrap_servers": "localhost:9092",
    "client_id": "test-client",
    "topics": {
        "user-events": "test-user-events",
        "movie-events": "test-movie-events",
        "playlist-events": "test-playlist-events"
    }
}

MOCK_ELASTICSEARCH_CONFIG = {
    "host": "localhost:9200",
    "indices": {
        "movies": "test-movies",
        "playlists": "test-playlists"
    }
}

MOCK_RABBITMQ_CONFIG = {
    "host": "localhost",
    "port": 5672,
    "queue": "test-queue"
}

# Test fixtures available across all test files
@pytest.fixture(scope="session")
def test_app():
    """Create test FastAPI app instance"""
    from main import app
    return app

@pytest.fixture(scope="session")
def test_client(test_app):
    """Create test client for FastAPI app"""
    return TestClient(test_app)

@pytest.fixture
def mock_db_session():
    """Create mock database session"""
    return Mock()

@pytest.fixture
def test_user_data():
    """Sample user data for tests"""
    return {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com",
        "role": "user",
        "password": "hashedpassword"
    }

@pytest.fixture
def test_movie_data():
    """Sample movie data for tests"""
    return {
        "id": 1,
        "title": "Test Movie",
        "year": "2023",
        "imdbID": "tt1234567",
        "type": "movie",
        "poster": "https://example.com/poster.jpg",
        "owner_id": 1
    }

@pytest.fixture
def test_playlist_data():
    """Sample playlist data for tests"""
    return {
        "id": 1,
        "name": "Test Playlist",
        "owner_id": 1,
        "movies": []
    }

# Test markers
pytest_markers = [
    "unit: Unit tests",
    "integration: Integration tests",
    "auth: Authentication tests", 
    "movies: Movie-related tests",
    "playlists: Playlist-related tests",
    "kafka: Kafka integration tests",
    "database: Database tests",
    "api: API endpoint tests",
    "slow: Tests that take longer to run",
    "external: Tests that require external services"
]

# Pytest configuration
def pytest_configure(config):
    """Configure pytest with custom markers"""
    for marker in pytest_markers:
        config.addinivalue_line("markers", marker)

# Setup test environment
def setup_test_env():
    """Setup test environment variables"""
    os.environ["TESTING"] = "1"
    os.environ["DATABASE_URL"] = TEST_DATABASE_URL
    os.environ["KAFKA_BOOTSTRAP_SERVERS"] = MOCK_KAFKA_CONFIG["bootstrap_servers"]
    os.environ["ELASTICSEARCH_HOST"] = MOCK_ELASTICSEARCH_CONFIG["host"]

# Teardown test environment  
def teardown_test_env():
    """Clean up test environment"""
    test_vars = ["TESTING", "DATABASE_URL", "KAFKA_BOOTSTRAP_SERVERS", "ELASTICSEARCH_HOST"]
    for var in test_vars:
        os.environ.pop(var, None)

# Mock external services for testing
class MockExternalServices:
    """Mock external services for testing"""
    
    @staticmethod
    def mock_kafka():
        """Mock Kafka connection"""
        mock_kafka = Mock()
        mock_kafka.send_message = Mock(return_value=True)
        mock_kafka.create_producer = Mock(return_value=Mock())
        mock_kafka.create_consumer = Mock(return_value=Mock())
        return mock_kafka
    
    @staticmethod
    def mock_elasticsearch():
        """Mock Elasticsearch client"""
        mock_es = Mock()
        mock_es.index = Mock(return_value={"result": "created"})
        mock_es.search = Mock(return_value={"hits": {"hits": []}})
        return mock_es
    
    @staticmethod
    def mock_rabbitmq():
        """Mock RabbitMQ manager"""
        mock_rabbitmq = Mock()
        mock_rabbitmq.publish_message = Mock(return_value=True)
        mock_rabbitmq.connect = Mock(return_value=True)
        mock_rabbitmq.disconnect = Mock(return_value=True)
        return mock_rabbitmq

# Test data generators
class TestDataGenerator:
    """Generate test data for various scenarios"""
    
    @staticmethod
    def generate_users(count=5):
        """Generate test user data"""
        users = []
        for i in range(count):
            users.append({
                "id": i + 1,
                "username": f"testuser{i+1}",
                "email": f"test{i+1}@example.com",
                "role": "user",
                "password": f"password{i+1}"
            })
        return users
    
    @staticmethod
    def generate_movies(count=10, owner_id=1):
        """Generate test movie data"""
        movies = []
        for i in range(count):
            movies.append({
                "id": i + 1,
                "title": f"Test Movie {i+1}",
                "year": str(2020 + (i % 4)),
                "imdbID": f"tt{1234567 + i}",
                "type": "movie",
                "poster": f"https://example.com/poster{i+1}.jpg",
                "owner_id": owner_id
            })
        return movies
    
    @staticmethod
    def generate_playlists(count=3, owner_id=1):
        """Generate test playlist data"""
        playlists = []
        for i in range(count):
            playlists.append({
                "id": i + 1,
                "name": f"Test Playlist {i+1}",
                "owner_id": owner_id,
                "created_date": "2023-01-01T00:00:00"
            })
        return playlists

# Test utilities
class TestUtils:
    """Utility functions for tests"""
    
    @staticmethod
    def create_mock_user(user_data=None):
        """Create mock user object"""
        from backend.auth.models import User
        
        default_data = {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "role": "user",
            "password": "hashedpassword"
        }
        
        if user_data:
            default_data.update(user_data)
            
        mock_user = Mock(spec=User)
        for key, value in default_data.items():
            setattr(mock_user, key, value)
            
        return mock_user
    
    @staticmethod
    def create_mock_movie(movie_data=None):
        """Create mock movie object"""
        from backend.movies.models import Movie
        
        default_data = {
            "id": 1,
            "title": "Test Movie",
            "year": "2023",
            "imdbID": "tt1234567",
            "type": "movie",
            "poster": "https://example.com/poster.jpg",
            "owner_id": 1
        }
        
        if movie_data:
            default_data.update(movie_data)
            
        mock_movie = Mock(spec=Movie)
        for key, value in default_data.items():
            setattr(mock_movie, key, value)
            
        # Add to_dict method
        mock_movie.to_dict.return_value = {k: v for k, v in default_data.items() if k != "owner_id"}
        
        return mock_movie
    
    @staticmethod
    def assert_kafka_message_sent(mock_kafka_send, topic, event_type):
        """Assert that a Kafka message was sent with correct parameters"""
        mock_kafka_send.assert_called()
        call_args = mock_kafka_send.call_args
        
        assert call_args[0][0] == topic  # First positional arg should be topic
        message = call_args[0][1]  # Second positional arg should be message
        assert message.get("event") == event_type
        
    @staticmethod
    def assert_valid_jwt_token(token):
        """Assert that a string is a valid JWT token format"""
        import re
        jwt_pattern = r'^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$'
        assert re.match(jwt_pattern, token), "Token is not in valid JWT format"
        assert len(token) > 50, "Token seems too short for a JWT"

# Database test utilities
class DatabaseTestUtils:
    """Utilities for database testing"""
    
    @staticmethod
    def create_test_engine():
        """Create test database engine"""
        from sqlalchemy import create_engine
        return create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    
    @staticmethod
    def create_test_session():
        """Create test database session"""
        engine = DatabaseTestUtils.create_test_engine()
        TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        return TestingSessionLocal()
    
    @staticmethod
    def create_test_tables():
        """Create test database tables"""
        from backend.db import Base
        engine = DatabaseTestUtils.create_test_engine()
        Base.metadata.create_all(bind=engine)
    
    @staticmethod
    def drop_test_tables():
        """Drop test database tables"""
        from backend.db import Base
        engine = DatabaseTestUtils.create_test_engine()
        Base.metadata.drop_all(bind=engine)

# Performance test utilities
class PerformanceTestUtils:
    """Utilities for performance testing"""
    
    @staticmethod
    def time_function(func, *args, **kwargs):
        """Time a function execution"""
        import time
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        return result, end_time - start_time
    
    @staticmethod
    def assert_performance_threshold(execution_time, threshold_seconds):
        """Assert that execution time is below threshold"""
        assert execution_time < threshold_seconds, f"Execution took {execution_time:.3f}s, expected < {threshold_seconds}s"

# API test utilities
class APITestUtils:
    """Utilities for API endpoint testing"""
    
    @staticmethod
    def get_auth_headers(token):
        """Get authorization headers for API requests"""
        return {"Authorization": f"Bearer {token}"}
    
    @staticmethod
    def assert_http_error(response, expected_status, expected_detail=None):
        """Assert HTTP error response"""
        assert response.status_code == expected_status
        if expected_detail:
            response_data = response.json()
            assert expected_detail in response_data.get("detail", "")
    
    @staticmethod
    def assert_successful_response(response, expected_status=200):
        """Assert successful HTTP response"""
        assert response.status_code == expected_status
        assert response.json() is not None

# Export all utilities for easy import
__all__ = [
    "TEST_DATABASE_URL",
    "MOCK_KAFKA_CONFIG", 
    "MOCK_ELASTICSEARCH_CONFIG",
    "MOCK_RABBITMQ_CONFIG",
    "MockExternalServices",
    "TestDataGenerator",
    "TestUtils",
    "DatabaseTestUtils",
    "PerformanceTestUtils",
    "APITestUtils"
]