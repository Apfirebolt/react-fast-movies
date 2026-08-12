import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Content from "../components/Content";
import { FaSearch, FaEye, FaBookmark, FaFilm } from "react-icons/fa";
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
  const navigate = useNavigate();

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
        toast.success("Movie saved to playlist successfully!");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Failed to save movie.");
      }
    }
  };

  const getMovies = useCallback(async () => {
    if (!debouncedQuery.trim()) return;
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Movies>(
        `${MOVIE_API_URL}?s=${debouncedQuery}&apikey=${mapApiKey}`
      );
      if (response.status === 200) {
        if (response.data.Response === "False") {
          setError(response.data.Error || "No movies found.");
          setMovies(null);
        } else {
          setMovies(response.data);
        }
      }
    } catch (error: unknown) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, mapApiKey]);

  const goToMovieDetails = (imdbID: string) => {
    navigate(`/movie/${imdbID}`);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <main className="relative z-10 max-w-7xl mx-auto space-y-12">
        
        {/* Header & Hero Section */}
        <section className="text-center space-y-4">
          <Content
            title="Search Movies"
            content="Discover the latest releases, explore timeless classics, and build your personal movie watchlist."
          />

          {/* Search Bar Input */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center bg-slate-900/80 rounded-2xl border border-slate-800 p-1.5 shadow-xl focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <FaSearch className="w-5 h-5 text-slate-500 ml-4 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies by title (e.g., Avengers, Batman)..."
                className="w-full bg-transparent px-4 py-2.5 text-slate-100 text-sm sm:text-base focus:outline-none placeholder-slate-500"
              />
              <button
                onClick={() => getMovies()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all duration-200 flex items-center space-x-2 flex-shrink-0"
              >
                <span>Search</span>
              </button>
            </div>
          </div>
        </section>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 flex justify-center">
            <Loader />
          </div>
        )}

        {/* Error Message Banner */}
        {error && !loading && (
          <div className="max-w-md mx-auto p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-center text-red-300 text-sm font-medium">
            <p>{error}</p>
          </div>
        )}

        {/* Movie Cards Grid */}
        {!loading && movies?.Search && (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.Search.map((movie) => {
              const hasPoster = movie.Poster && movie.Poster !== "N/A";

              return (
                <div
                  key={movie.imdbID}
                  className="group relative bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Poster Container */}
                  <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
                    {hasPoster ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                        <FaFilm className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs">No Poster Available</span>
                      </div>
                    )}

                    {/* Badge: Release Year */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 backdrop-blur-md">
                      {movie.Year}
                    </span>

                    {/* Badge: Type */}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-xs font-bold uppercase tracking-wider text-indigo-300 backdrop-blur-md">
                      {movie.Type}
                    </span>
                  </div>

                  {/* Details & Actions Footer */}
                  <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {movie.Title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => goToMovieDetails(movie.imdbID)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <FaEye className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => saveMovie(movie)}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <FaBookmark className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Footer Info Text */}
        <section className="pt-12 border-t border-slate-800/60 text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Discover the latest movies, explore your favorites, and enjoy a seamless browsing experience. Built with React, TypeScript, and Tailwind CSS.
          </p>
          <p className="text-xs text-slate-500">
            Start exploring now and dive into the world of cinema with Monstella!
          </p>
        </section>

      </main>
    </div>
  );
};

export default Home;