import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../stores/auth";
import usePlaylistStore from "../stores/playlist";
import useMovieStore from "../stores/movie";
import { Movie, Movies } from "../types/Movie";
import type { Playlist } from "../types/Playlist";
import { API_URL } from "../config";
import Loader from "../components/Loader";
import Content from "../components/Content";

const Recommendations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { deleteMovie } = useMovieStore();

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

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

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <motion.div
      className="bg-light p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Content
          title="Recommendations Dashboard"
          content="Here, based on your saved movies, we provide personalized movie recommendations to enhance your viewing experience."
        />
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            className="text-lg text-secondary text-center border-2 border-primary px-2 py-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Recommendations;
