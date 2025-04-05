import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../stores/auth";
import { Movie, Movies } from "../types/Movie";
import { API_URL } from "../config";
import Loader from "../components/Loader";
import Content from "../components/Content";
import { motion } from "framer-motion";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Movie>(`${API_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (err) {
      if (err.status === 401) {
        toast.dismiss();
        toast.error("Session expired. Please log in again.");
      }
      setError("Failed to fetch movies. Please try again.");
    }
    setLoading(false);
  };

  const deleteMovie = async (movie: MovieDetails) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${API_URL}/movies/${movie.imdbID}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      if (response.status === 204) {
        toast.dismiss();
        toast.success("Movie deleted successfully.");
        await fetchMovies();
      }
    } catch (err) {
      setError("Failed to delete movie. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const filteredMovies = movies?.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center bg-light p-4">
      <Content
        title="Welcome to Your Dashboard"
        content="Welcome to your dashboard! Here you can manage your account, track your
        favorite movies, and explore personalized recommendations."
      />
      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md"
        />
      </div>

      {loading && <Loader />}
      {error && <p className="text-lg text-secondary text-center border-2 border-primary px-2 py-3">{error}</p>}
      {filteredMovies && filteredMovies.length > 0 ? (
        <motion.div
          className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {filteredMovies.map((movie) => (
            <div
            key={movie.imdbID}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-64 rounded-md"
            />
            <h2 className="text-xl font-semibold mt-2">{movie.title}</h2>
            <p className="text-gray-600">{movie.year}</p>
            <button
              onClick={() => deleteMovie(movie)}
              className="mt-2 px-4 py-2 bg-secondary text-white rounded-md shadow-md hover:bg-primary"
            >
              Delete
            </button>
          </div>
          ))}
        </motion.div>
      ) : (
        <p className="text-lg text-gray-600 text-center mt-4">
          No movies found.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
