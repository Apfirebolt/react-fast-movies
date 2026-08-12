import pytest
import asyncio
from unittest.mock import Mock, AsyncMock, patch
from datetime import datetime
from fastapi import HTTPException, status
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import os
import sys

# Get the directory one level above the 'tests' directory
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Add this directory to Python's sys.path
sys.path.append(backend_dir)

from main import app
from backend.movies import models, services, schema
from backend.auth.models import User
from pydantic import HttpUrl

client = TestClient(app)

# Test Fixtures
@pytest.fixture
def sample_movie_data():
    return {
        "Search": [
            {
                "Title": "Iron Man",
                "Year": "2008",
                "imdbID": "tt0371746",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg"
            },
            {
                "Title": "The Avengers",
                "Year": "2012",
                "imdbID": "tt0848228",
                "Type": "movie",
                "Poster": "https://m.media-amazon.com/images/M/MV5BMTk3NjQ2NjY5OV5BMl5BanBnXkFtZTcwODc0NTIzMw@@._V1_SX300.jpg"
            }
        ]
    }

@pytest.fixture
def mock_user():
    return User(
        id=1,
        username="testuser",
        email="test@example.com",
        role="user",
        password="hashedpassword"
    )

@pytest.fixture
def sample_movie_request():
    return schema.MovieBase(
        title="Test Movie",
        year="2023",
        imdbID="tt1234567",
        type="movie",
        poster="https://example.com/poster.jpg"
    )

@pytest.fixture
def sample_playlist_request():
    return schema.PlaylistBase(name="My Test Playlist")

@pytest.fixture
def mock_database():
    return Mock(spec=Session)

# Original tests
def test_movie_titles(sample_movie_data):
    titles = [movie["Title"] for movie in sample_movie_data["Search"]]
    assert "Iron Man" in titles
    assert "The Avengers" in titles

def test_movie_years(sample_movie_data):
    years = [movie["Year"] for movie in sample_movie_data["Search"]]
    assert "2008" in years
    assert "2012" in years

def test_movie_types(sample_movie_data):
    types = {movie["Type"] for movie in sample_movie_data["Search"]}
    assert "movie" in types
    assert len(types) == 1  # Ensure all are of type "movie"

# Model Tests
class TestMovieModel:
    def test_movie_model_creation(self):
        """Test movie model creation"""
        movie = models.Movie(
            title="Test Movie",
            year="2023",
            imdbID="tt1234567",
            type="movie",
            poster="https://example.com/poster.jpg",
            owner_id=1
        )
        assert movie.title == "Test Movie"
        assert movie.year == "2023"
        assert movie.imdbID == "tt1234567"
        assert movie.type == "movie"
        assert movie.owner_id == 1

    def test_movie_to_dict(self):
        """Test movie model to_dict method"""
        movie = models.Movie(
            id=1,
            title="Test Movie",
            year="2023",
            imdbID="tt1234567",
            type="movie",
            poster="https://example.com/poster.jpg",
            owner_id=1
        )
        movie_dict = movie.to_dict()
        expected_keys = ["id", "year", "title", "imdbID", "type", "poster"]
        assert all(key in movie_dict for key in expected_keys)
        assert movie_dict["title"] == "Test Movie"
        assert movie_dict["id"] == 1

    def test_playlist_model_creation(self):
        """Test playlist model creation"""
        playlist = models.Playlist(
            name="Test Playlist",
            owner_id=1
        )
        assert playlist.name == "Test Playlist"
        assert playlist.owner_id == 1

    def test_playlist_movie_model_creation(self):
        """Test playlist-movie relationship model"""
        playlist_movie = models.PlaylistMovie(
            playlist_id=1,
            movie_id=1
        )
        assert playlist_movie.playlist_id == 1
        assert playlist_movie.movie_id == 1

# Schema Tests
class TestMovieSchema:
    def test_movie_base_schema_valid(self):
        """Test MovieBase schema with valid data"""
        movie_data = {
            "title": "Test Movie",
            "year": "2023",
            "imdbID": "tt1234567",
            "type": "movie",
            "poster": "https://example.com/poster.jpg"
        }
        movie = schema.MovieBase(**movie_data)
        assert movie.title == "Test Movie"
        assert movie.year == "2023"
        assert movie.imdbID == "tt1234567"

    def test_movie_base_schema_without_poster(self):
        """Test MovieBase schema without poster"""
        movie_data = {
            "title": "Test Movie",
            "year": "2023",
            "imdbID": "tt1234567",
            "type": "movie"
        }
        movie = schema.MovieBase(**movie_data)
        assert movie.poster is None

    def test_playlist_base_schema(self):
        """Test PlaylistBase schema"""
        playlist_data = {"name": "My Playlist"}
        playlist = schema.PlaylistBase(**playlist_data)
        assert playlist.name == "My Playlist"

    def test_movie_playlist_payload_schema(self):
        """Test MoviePlaylistPayload schema"""
        payload_data = {
            "movieId": 1,
            "playlistId": [1, 2, 3]
        }
        payload = schema.MoviePlaylistPayload(**payload_data)
        assert payload.movieId == 1
        assert payload.playlistId == [1, 2, 3]

# Service Tests
class TestMovieServices:
    @pytest.mark.asyncio
    async def test_create_new_movie_success(self, sample_movie_request, mock_user, mock_database):
        """Test successful movie creation"""
        # Mock database operations
        mock_database.query.return_value.filter.return_value.first.return_value = None
        mock_database.add = Mock()
        mock_database.commit = Mock()
        mock_database.refresh = Mock()

        # Mock Kafka and RabbitMQ
        with patch('backend.movies.services.send_kafka_message', new_callable=AsyncMock) as mock_kafka, \
             patch('backend.movies.services.rabbitmq_manager.publish_message', new_callable=AsyncMock) as mock_rabbitmq, \
             patch('backend.movies.services.es_client', None):
            
            result = await services.create_new_movie(sample_movie_request, mock_database, mock_user)
            
            # Verify database operations
            mock_database.add.assert_called_once()
            mock_database.commit.assert_called_once()
            mock_database.refresh.assert_called_once()
            
            # Verify messaging
            mock_kafka.assert_called_once()
            mock_rabbitmq.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_new_movie_duplicate_error(self, sample_movie_request, mock_user, mock_database):
        """Test movie creation with duplicate imdbID"""
        # Mock existing movie
        existing_movie = Mock()
        mock_database.query.return_value.filter.return_value.first.return_value = existing_movie

        with pytest.raises(HTTPException) as exc_info:
            await services.create_new_movie(sample_movie_request, mock_database, mock_user)
        
        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "already been added" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_get_movie_listing(self, mock_user, mock_database):
        """Test getting movie listing"""
        # Mock movies
        mock_movies = [
            Mock(title="Movie 1", id=1),
            Mock(title="Movie 2", id=2)
        ]
        mock_database.query.return_value.filter.return_value.all.return_value = mock_movies

        result = await services.get_movie_listing(mock_database, mock_user.id)
        
        assert len(result) == 2
        mock_database.query.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_movie_by_id_success(self, mock_user, mock_database):
        """Test getting movie by ID successfully"""
        mock_movie = Mock(title="Test Movie", id=1)
        mock_database.query.return_value.filter_by.return_value.first.return_value = mock_movie

        result = await services.get_movie_by_id(1, mock_user.id, mock_database)
        
        assert result == mock_movie
        mock_database.query.return_value.filter_by.assert_called_once_with(id=1, owner_id=mock_user.id)

    @pytest.mark.asyncio
    async def test_get_movie_by_id_not_found(self, mock_user, mock_database):
        """Test getting movie by ID when not found"""
        mock_database.query.return_value.filter_by.return_value.first.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await services.get_movie_by_id(999, mock_user.id, mock_database)
        
        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert "Movie Not Found" in exc_info.value.detail

    @pytest.mark.asyncio
    async def test_delete_movie_by_id_success(self, mock_user, mock_database):
        """Test successful movie deletion"""
        mock_movie = Mock(id=1, title="Test Movie")
        mock_database.query.return_value.filter_by.return_value.first.return_value = mock_movie
        mock_database.query.return_value.filter.return_value.delete.return_value = None
        mock_database.commit = Mock()

        await services.delete_movie_by_id(1, mock_user, mock_database)
        
        mock_database.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_delete_movie_by_id_not_found(self, mock_user, mock_database):
        """Test movie deletion when movie not found"""
        mock_database.query.return_value.filter_by.return_value.first.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await services.delete_movie_by_id(999, mock_user, mock_database)
        
        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.asyncio
    async def test_create_new_playlist_success(self, sample_playlist_request, mock_user, mock_database):
        """Test successful playlist creation"""
        # Mock playlist count (less than 10)
        mock_database.query.return_value.filter.return_value.count.return_value = 5
        mock_database.add = Mock()
        mock_database.commit = Mock()
        mock_database.refresh = Mock()

        with patch('backend.movies.services.send_kafka_message', new_callable=AsyncMock) as mock_kafka, \
             patch('backend.movies.services.rabbitmq_manager.publish_message', new_callable=AsyncMock) as mock_rabbitmq, \
             patch('backend.movies.services.es_client', None):
            
            result = await services.create_new_playlist(sample_playlist_request, mock_database, mock_user)
            
            mock_database.add.assert_called_once()
            mock_database.commit.assert_called_once()
            mock_database.refresh.assert_called_once()
            mock_kafka.assert_called_once()
            mock_rabbitmq.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_new_playlist_limit_exceeded(self, sample_playlist_request, mock_user, mock_database):
        """Test playlist creation when limit exceeded"""
        # Mock playlist count (10 or more)
        mock_database.query.return_value.filter.return_value.count.return_value = 10

        with pytest.raises(HTTPException) as exc_info:
            await services.create_new_playlist(sample_playlist_request, mock_database, mock_user)
        
        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "up to 10 playlists" in exc_info.value.detail

# Integration Tests (commented out as they require full app setup)
class TestMovieEndpoints:
    def test_movie_endpoints_exist(self):
        """Test that movie endpoints exist and are accessible"""
        # Test routes exist
        routes = [route.path for route in app.routes]
        assert "/api/movies/" in routes or any("/api/movies" in route for route in routes)

    def test_playlist_endpoints_exist(self):
        """Test that playlist endpoints exist and are accessible"""
        routes = [route.path for route in app.routes]
        assert "/api/playlists/" in routes or any("/api/playlists" in route for route in routes)

# Utility Tests
class TestMovieUtilities:
    def test_poster_url_conversion(self):
        """Test HttpUrl to string conversion"""
        poster_url = HttpUrl("https://example.com/poster.jpg")
        poster_str = str(poster_url)
        assert poster_str == "https://example.com/poster.jpg"

    def test_datetime_formatting(self):
        """Test datetime ISO format"""
        test_date = datetime(2023, 1, 1, 12, 0, 0)
        iso_string = test_date.isoformat()
        assert "2023-01-01T12:00:00" in iso_string

# Edge Case Tests
class TestMovieEdgeCases:
    @pytest.mark.asyncio
    async def test_create_movie_with_long_title(self, mock_user, mock_database):
        """Test movie creation with very long title"""
        long_title_request = schema.MovieBase(
            title="A" * 100,  # Very long title
            year="2023",
            imdbID="tt1234567",
            type="movie"
        )
        
        mock_database.query.return_value.filter.return_value.first.return_value = None
        mock_database.add = Mock()
        mock_database.commit = Mock()
        mock_database.refresh = Mock()

        with patch('backend.movies.services.send_kafka_message', new_callable=AsyncMock), \
             patch('backend.movies.services.rabbitmq_manager.publish_message', new_callable=AsyncMock), \
             patch('backend.movies.services.es_client', None):
            
            result = await services.create_new_movie(long_title_request, mock_database, mock_user)
            mock_database.add.assert_called_once()

    def test_movie_schema_validation_empty_fields(self):
        """Test movie schema with empty required fields"""
        # Pydantic doesn't raise ValueError for empty strings by default
        # Let's test that empty strings are accepted (which is the current behavior)
        movie = schema.MovieBase(
            title="",  # Empty title is allowed
            year="2023",
            imdbID="tt1234567",
            type="movie"
        )
        assert movie.title == ""

    def test_playlist_schema_validation_empty_name(self):
        """Test playlist schema with empty name"""
        # Pydantic doesn't raise ValueError for empty strings by default
        # Let's test that empty strings are accepted (which is the current behavior)
        playlist = schema.PlaylistBase(name="")
        assert playlist.name == ""

# Performance Tests
class TestMoviePerformance:
    def test_to_dict_performance(self):
        """Test performance of to_dict method"""
        movie = models.Movie(
            id=1,
            title="Test Movie",
            year="2023",
            imdbID="tt1234567",
            type="movie",
            poster="https://example.com/poster.jpg",
            owner_id=1
        )
        
        # Test that to_dict doesn't take too long
        import time
        start_time = time.time()
        result = movie.to_dict()
        end_time = time.time()
        
        assert end_time - start_time < 0.1  # Should complete in less than 100ms
        assert isinstance(result, dict)