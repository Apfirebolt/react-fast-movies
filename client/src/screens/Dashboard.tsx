import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../stores/auth";
import usePlaylistStore from "../stores/playlist";
import { Movie, Movies } from "../types/Movie";
import type { Playlist } from "../types/Playlist";
import { API_URL } from "../config";
import Loader from "../components/Loader";
import Content from "../components/Content";
import MoviesList from "../components/Movies";
import PlayListFormModal from "../components/PlayListFormModal";
import PlayList from "../components/PlayList";
import { FaSave, FaEye, FaTimes } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("movies");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { deletePlaylist, addPlaylist, updatePlaylist } = usePlaylistStore();

  const openEditModal = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
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

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/playlists`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (response.status === 200) {
        setPlaylists(response.data);
      }
    } catch (err) {
      if (err.status === 401) {
        toast.dismiss();
        toast.error("Session expired. Please log in again.");
      }
      setError("Failed to fetch playlists. Please try again.");
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

  const deletePlaylistUtil = async (playlistId: number) => {
    await deletePlaylist(playlistId);
    await fetchPlaylists();
  };

  const addPlaylistUtil = async (playlist: any) => {
    await addPlaylist(playlist);
    await fetchPlaylists();
  };

  const updatePlaylistUtil = async (playlistData: any) => {
    await updatePlaylist(playlistData);
    await fetchPlaylists();
    closeEditModal();
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setSearchQuery("");
  };

  const filteredMovies = movies?.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchMovies();
    fetchPlaylists();
  }, []);

  return (
    <div className="bg-light p-4">
      <Content
        title="Welcome to Your Dashboard"
        content="Welcome to your dashboard! Here you can manage your account, track your
      favorite movies, and explore personalized recommendations."
      />

      <div className="flex justify-between items-center">
        {selectedTab === "movies" && (
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-1/2"
          />
        )}

        <div className="flex justify-center my-4">
          <button
            onClick={() => handleTabChange("movies")}
            className={`px-4 py-2 mx-2 ${
              selectedTab === "movies"
                ? "bg-primary text-white"
                : "bg-gray-200 text-black"
            } rounded-md shadow-md flex items-center justify-around`}
          >
            <FaSave className="mx-1" />
            Saved Movies
          </button>
          <button
            onClick={() => handleTabChange("playlist")}
            className={`px-4 py-2 mx-2 ${
              selectedTab === "playlist"
                ? "bg-primary text-white"
                : "bg-gray-200 text-black"
            } rounded-md shadow-md flex items-center justify-around`}
          >
            <FaEye className="mx-1" />
            Playlist
          </button>
        </div>
      </div>

      {loading && <Loader />}
      {error && (
        <p className="text-lg text-secondary text-center border-2 border-primary px-2 py-3">
          {error}
        </p>
      )}
      {selectedTab === "movies" && (
        <MoviesList movies={filteredMovies} deleteMovie={deleteMovie} />
      )}
      {selectedTab === "playlist" && (
        <PlayList
          playlists={playlists}
          addPlaylist={addPlaylistUtil}
          deletePlaylist={deletePlaylistUtil}
          openEditModal={openEditModal}
        />
      )}

      {/* Playlist Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeEditModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeEditModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
              <PlayListFormModal
                addPlaylist={addPlaylistUtil}
                updatePlaylist={updatePlaylistUtil}
                playlist={selectedPlaylist}
                onClose={closeEditModal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
