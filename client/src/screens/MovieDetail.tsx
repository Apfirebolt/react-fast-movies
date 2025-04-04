import React, { useState, useEffect } from "react";
import axios from "axios";
import type { Movie } from "../types/Movie";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { MOVIE_API_URL } from "../config";

const MovieDetail: React.FC = () => {
  const mapApiKey = import.meta.env.VITE_MAP_API_KEY;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const imdbID = useParams<{ id: string }>().id;

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Movie>(
        `${MOVIE_API_URL}?i=${imdbID}&apikey=${mapApiKey}`
      );
      if (response.status === 200) {
        setMovie(response.data);
      }
    } catch (error: unknown) {
      setError("An unexpected error occurred. Please try again.", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  if (loading) {
    return (<Loader />);
  }
  if (error) {
    return <p className="text-lg text-secondary text-center border-2 border-primary px-2 py-3">{error}</p>;
  }

  if (!movie) {
    return <p className="text-lg text-gray-600 text-center">No movie found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
      >
        Go Back
      </button>
      <div className="max-w-2xl p-4 border rounded-md shadow-md bg-white">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{movie.Title}</h1>
        <p className="text-lg text-gray-600 mb-2">Year: {movie.Year}</p>
        <p className="text-lg text-gray-600 mb-2">Genre: {movie.Genre}</p>
        <p className="text-lg text-gray-600 mb-2">Director: {movie.Director}</p>
        <p className="text-lg text-gray-600 mb-2">Actors: {movie.Actors}</p>
        <p className="text-lg text-gray-600 mb-4">Plot: {movie.Plot}</p>
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-auto rounded-md"
        />
      </div>
    </div>
  );
};

export default MovieDetail;
