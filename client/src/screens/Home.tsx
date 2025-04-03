import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import type { Movies } from "../types/Movie";
import { MOVIE_API_URL } from "../config";


const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies | null>(null);
  const [error, setError] = useState<string | null>(null);  

  const navigate = useNavigate();

  const getMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Movies>(
        `${MOVIE_API_URL}?s=${searchQuery}&apikey=305a3406`
      );
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
    }
    setLoading(false);
  };

  const goToMovieDetails = (imdbID: string) => {
    navigate(`/movie/${imdbID}`);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Fast React Movies
      </h1>
      <div className="mb-4 flex justify-center items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for movies..."
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      <button
        onClick={() => getMovies()}
        className="px-4 py-2 bg-blue-500 mx-2 text-white rounded-md shadow-md hover:bg-blue-600"
      >
        Search
      </button>
      
      </div>

      {loading && <Loader />}
      {error && <p className="text-lg text-red-600 text-center">{error}</p>}
      {movies && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-4">
          {movies.Search.map((movie) => (
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
          <button
            onClick={() => goToMovieDetails(movie.imdbID)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
          >
            View Details
          </button>
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
