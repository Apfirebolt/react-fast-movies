from fastapi import HTTPException, status
from typing import List
from . import models
import json
from backend.auth.models import User
from datetime import datetime
from backend.elastic import es_client
from backend.rabbitMQ import RabbitMQManager

from sqlalchemy.orm import Session
from pydantic import HttpUrl

rabbitmq_manager = RabbitMQManager()

async def create_new_movie(
    request, database: Session, current_user: User
) -> models.Movie:
    try:
        # Check if request.poster is an HttpUrl object and convert to string if so
        poster_str = (
            str(request.poster)
            if isinstance(request.poster, HttpUrl)
            else request.poster
        )

        # error if the same movie has been added by the same user
        existing_movie = (
            database.query(models.Movie)
            .filter(
                models.Movie.imdbID == request.imdbID,
                models.Movie.owner_id == current_user.id,
            )
            .first()
        )
        if existing_movie:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This movie has already been added by you.",
            )

        new_movie = models.Movie(
            title=request.title,
            imdbID=request.imdbID,
            poster=poster_str,  # Use the converted string
            year=request.year,
            type=request.type,
            owner_id=current_user.id,
            createdDate=datetime.now(),
        )
        database.add(new_movie)
        database.commit()
        database.refresh(new_movie)
        return new_movie
    except Exception as e:
        database.rollback()
        if isinstance(e, HTTPException) and e.status_code == status.HTTP_400_BAD_REQUEST:
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the movie: {str(e)}",
        )
        

async def get_movie_listing(database, current_user) -> List[models.Movie]:
    try:
        movies = (
            database.query(models.Movie)
            .filter(models.Movie.owner_id == current_user)
            .all()
        )
        return movies
    except Exception as e:
        if isinstance(e, HTTPException) and e.status_code == status.HTTP_400_BAD_REQUEST:
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching movies: {str(e)}",
        )


async def get_movie_by_id(movie_id, current_user, database):
    try:
        movie = (
            database.query(models.Movie)
            .filter_by(id=movie_id, owner_id=current_user)
            .first()
        )
        if not movie:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Movie Not Found!"
            )
        return movie
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the movie: {str(e)}",
        )


async def delete_movie_by_id(movie_id, current_user: User, database: Session):
    try:
        # check if movie belongs to the user
        movie = (
            database.query(models.Movie)
            .filter_by(id=movie_id, owner_id=current_user.id)
            .first()
        )
        if not movie:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Movie Not Found!"
            )
        database.query(models.Movie).filter(models.Movie.id == movie_id).delete()
        database.commit()
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the movie: {str(e)}",
        )


# Playlist services
async def create_new_playlist(
    request, database: Session, current_user: User
) -> models.Playlist:
    try:
        # More than 10 playlists for a user is not allowed
        existing_playlists = (
            database.query(models.Playlist)
            .filter(models.Playlist.owner_id == current_user.id)
            .count()
        )
        if existing_playlists >= 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You can only create up to 10 playlists.",
            )
        new_playlist = models.Playlist(
            name=request.name,
            owner_id=current_user.id,
            createdDate=datetime.now(),
        )
        database.add(new_playlist)
        database.commit()
        database.refresh(new_playlist)

        # add entry to elasticsearch index
        if es_client:
            await es_client.index(
                index="playlists",
                id=new_playlist.id,
                document={
                    "name": new_playlist.name,
                    "owner_id": new_playlist.owner_id,
                    "createdDate": new_playlist.createdDate.isoformat(),
                },
            )
        else:
            print("Elasticsearch client is not initialized.")

        # publish message to RabbitMQ
        message_payload = {
                "event": "playlist_created",
                "playlist_id": new_playlist.id,
                "owner_id": new_playlist.owner_id,
                "name": new_playlist.name,
                "created_at": new_playlist.createdDate.isoformat(),
            }

        await rabbitmq_manager.publish_message(message=json.dumps(message_payload))

        return new_playlist
    except Exception as e:
        database.rollback()
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the playlist: {str(e)}",
        )


async def get_playlist_listing(database, current_user) -> List[models.Playlist]:
    try:
        playlists = (
            database.query(models.Playlist)
            .filter(models.Playlist.owner_id == current_user)
            .all()
        )
        return playlists
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching playlists: {str(e)}",
        )


async def get_playlist_by_id(playlist_id, current_user, database):
    try:
        playlist = (
            database.query(models.Playlist)
            .filter_by(id=playlist_id, owner_id=current_user)
            .first()
        )
        if not playlist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Playlist Not Found!"
            )
        # get all movies in the playlist
        movies = (
            database.query(models.Movie)
            .join(models.PlaylistMovie)
            .filter(models.PlaylistMovie.playlist_id == playlist.id)
            .all()
        )
        return {"playlist": playlist, "movies": movies}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the playlist: {str(e)}",
        )


async def delete_playlist_by_id(playlist_id: int, current_user: User, database: Session):
    try:
        # check if playlist belongs to the user
        playlist = (
            database.query(models.Playlist)
            .filter_by(id=playlist_id, owner_id=current_user.id)
            .first()
        )
        if not playlist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Playlist Not Found!"
            )
        database.query(models.Playlist).filter(
            models.Playlist.id == playlist_id
        ).delete()
        database.commit()
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the playlist: {str(e)}",
        )
    

async def update_playlist(playlist_id: int, request, current_user: User, database):
    try:
        # check if playlist belongs to the user
        playlist = (
            database.query(models.Playlist)
            .filter_by(id=playlist_id, owner_id=current_user.id)
            .first()
        )
        if not playlist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Playlist Not Found!"
            )
        playlist = database.query(models.Playlist).filter(
            models.Playlist.id == playlist_id
        ).first()
        if not playlist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Playlist Not Found!"
            )
        playlist.name = request.name
        database.commit()
        database.refresh(playlist)
        return playlist
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while updating the playlist: {str(e)}",
        )


async def add_movie_to_playlist(
    request, current_user: User, database: Session,
) -> models.PlaylistMovie:
    try:
        movie_id = request.movieId
        playlist_ids = request.playlistId
        
        # Verify the movie exists and belongs to the user
        movie = (
            database.query(models.Movie)
            .filter_by(id=movie_id, owner_id=current_user.id)
            .first()
        )
        if not movie:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Movie Not Found!"
            )
        
        created_entries = []
        
        for playlist_id in playlist_ids:
            # Verify the playlist exists and belongs to the user
            playlist = (
                database.query(models.Playlist)
                .filter_by(id=playlist_id, owner_id=current_user.id)
                .first()
            )
            if not playlist:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Playlist with id {playlist_id} not found!"
                )
            
            # Check if the movie is already in the playlist
            existing_entry = (
                database.query(models.PlaylistMovie)
                .filter_by(movie_id=movie_id, playlist_id=playlist_id)
                .first()
            )
            
            if not existing_entry:
                # Create new entry if it doesn't exist
                new_entry = models.PlaylistMovie(
                    movie_id=movie_id,
                    playlist_id=playlist_id
                )
                database.add(new_entry)
                created_entries.append(new_entry)
        
        database.commit()
        for entry in created_entries:
            database.refresh(entry)
        
        return created_entries[0] if created_entries else None
        
    except Exception as e:
        database.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while adding movie to playlists: {str(e)}",
        )

async def remove_movie_from_playlist(
    playlist_id: int, movie_id: int, current_user: User, database: Session
) -> None:
    try:
        database.query(models.PlaylistMovie).filter(
            models.PlaylistMovie.movie_id == movie_id,
            models.PlaylistMovie.playlist_id == playlist_id,
        ).delete()
        database.commit()
    except Exception as e:
        database.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while removing the movie from the playlist: {str(e)}",
        )


async def get_movies_in_playlist(
    playlist_id: int, database: Session
) -> List[models.Movie]:
    try:
        movies = (
            database.query(models.Movie)
            .join(models.PlaylistMovie)
            .filter(models.PlaylistMovie.playlist_id == playlist_id)
            .all()
        )
        return movies
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching movies in the playlist: {str(e)}",
        )
    

async def get_playlist_recommendations(
    playlist_id: int, database: Session
) -> List[models.Movie]:
    try:
        # Get all movies in the playlist
        movies_in_playlist = (
            database.query(models.Movie)
            .join(models.PlaylistMovie)
            .filter(models.PlaylistMovie.playlist_id == playlist_id)
            .all()
        )
        
        # For simplicity, return movies in the playlist as recommendations
        return movies_in_playlist
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching recommendations: {str(e)}",
        )
