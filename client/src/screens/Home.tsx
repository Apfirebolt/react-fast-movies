import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Content from "../components/Content";
import { FaSearch, FaEye, FaSave } from "react-icons/fa";
import type { Movies, MovieDetails } from "../types/Movie";
import useAuthStore from "../stores/auth";
import { toast } from "react-toastify";
import { MOVIE_API_URL, API_URL } from "../config";

const Home: React.FC = () => {
  const mapApiKey = import.meta.env.VITE_MAP_API_KEY;
  const [searchQuery, setSearchQuery] = useState<string>("man");
  const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  const saveMovie = async (movie: MovieDetails) => {
    if (!user) {
      toast.error("You need to be logged in to save a movie.");
      return;
    }
    try {
      const payload = {
        year: movie.Year,
        title: movie.Title,
        imdbID: movie.imdbID,
        type: movie.Type,
        poster: movie.Poster,
      };
      const response = await axios.post<MovieDetails>(
        `${API_URL}/movies`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Movie saved successfully!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to save movie.");
      }
    }
  };

  const navigate = useNavigate();

  const getMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Movies>(
        `${MOVIE_API_URL}?s=${debouncedQuery}&apikey=${mapApiKey}`
      );
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError("An unexpected error occurred. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
    setLoading(false);
  }, [debouncedQuery, mapApiKey]);

  const goToMovieDetails = (imdbID: string) => {
    navigate(`/movie/${imdbID}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Adjust the debounce delay as needed (e.g., 500ms)

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  return (
    <div className="flex flex-col items-center justify-center bg-light p-4">
      <Content
        title="Welcome to Movie Finder"
        content="Discover the latest movies, explore your favorites, and enjoy a seamless browsing experience."
      />
      <div className="mb-4 flex justify-center items-center w-1/2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for movies..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => getMovies()}
          className="px-4 py-2 bg-tertiary mx-2 text-white rounded-md shadow-md hover:bg-blue-600 flex items-center"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </div>

      {loading && <Loader />}
      {error && (
        <p className="text-lg text-secondary text-center border-2 border-primary px-2 py-3">
          {error}
        </p>
      )}
      {movies && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-4">
          {movies.Search && movies.Search.map((movie) => (
            <div
              key={movie.imdbID}
              className="break-inside-avoid p-4 border rounded-md shadow-md mb-4"
            >
              <h2 className="text-xl font-bold">{movie.Title}</h2>
              <p>{movie.Year}</p>
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-auto mt-2 rounded-md"
              />
              <div className="flex">
                <button
                  onClick={() => goToMovieDetails(movie.imdbID)}
                  className="mt-2 px-4 py-2 bg-tertiary text-white rounded-md shadow-md flex items-center hover:bg-blue-600"
                >
                  <FaEye className="mx-1" />
                  View Details
                </button>
                <button
                  onClick={() => saveMovie(movie)}
                  className="mt-2 mx-2 px-4 py-2 bg-success text-light rounded-md shadow-md flex items-center hover:bg-green-600"
                >
                  <FaSave className="mx-1" />
                  Save Movie
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-lg text-gray-600 text-center max-w-2xl">
        Discover the latest movies, explore your favorites, and enjoy a seamless
        browsing experience. Built with React, TypeScript, and Tailwind CSS, our
        platform is designed to bring you closer to the world of cinema.
      </p>
      <p className="text-lg text-gray-600 text-center max-w-2xl mt-4">
        Start exploring now and dive into the world of movies like never before!
      </p>
    </div>
  );
};

export default Home;
