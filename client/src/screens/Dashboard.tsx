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
import MoviesList from "../components/Movies";
import PlayListFormModal from "../components/PlayListFormModal";
import PlaylistModal from "../components/PlayListModal";
import ConfirmModal from "../components/ConfirmModal";
import PlayList from "../components/PlayList";
import { FaSave, FaEye, FaTimes } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("movies");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { deletePlaylist, addPlaylist, updatePlaylist, addMovieToPlaylist } =
    usePlaylistStore();
  const { deleteMovie } = useMovieStore();

  const openEditModal = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setIsEditModalOpen(true);
  };

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

  const deleteMovieUtil = async (movieId: number) => {
    await deleteMovie(movieId);
    await fetchMovies();
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

  const openDeleteConfirmModal = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setIsConfirmModalOpen(true);
  };

  const openPlaylistModal = (movie: Movie) => {
    console.log("Movie selected is ", movie);
    setSelectedMovie(movie);
    setIsPlaylistModalOpen(true);
  };

  const closePlaylistModal = () => {
    setIsPlaylistModalOpen(false);
  };

  const saveToPlaylists = async (playlistIds: string[]) => {
    // print the playlist Ids and selected movie
    if (!selectedMovie) {
      toast.error("No movie selected to add to playlists.");
      return;
    }
    try {
      // send array of playlist Ids and movie Id to backend
      await addMovieToPlaylist(selectedMovie.id, playlistIds);
      closePlaylistModal();
    } catch (error) {
      toast.error("Failed to save movie to playlists.");
    }
  };

  const filteredMovies = movies?.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchMovies();
    fetchPlaylists();
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
          title="Welcome to Your Dashboard"
          content="Welcome to your dashboard! Here you can manage your account, track your
      favorite movies, and explore personalized recommendations."
        />
      </motion.div>

      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {selectedTab === "movies" && (
          <motion.input
            type="text"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md w-full sm:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        <motion.div
          className="flex justify-center my-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.button
            onClick={() => handleTabChange("movies")}
            className={`px-4 py-2 mx-2 ${
              selectedTab === "movies"
                ? "bg-primary text-white"
                : "bg-gray-200 text-black"
            } rounded-md shadow-md flex items-center justify-around`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FaSave className="mx-1" />
            Saved Movies
          </motion.button>
          <motion.button
            onClick={() => handleTabChange("playlist")}
            className={`px-4 py-2 mx-2 ${
              selectedTab === "playlist"
                ? "bg-primary text-white"
                : "bg-gray-200 text-black"
            } rounded-md shadow-md flex items-center justify-around`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <FaEye className="mx-1" />
            Playlist
          </motion.button>
        </motion.div>
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

      <AnimatePresence mode="wait">
        {selectedTab === "movies" && (
          <motion.div
            key="movies"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <MoviesList
              movies={filteredMovies}
              deleteMovie={deleteMovieUtil}
              openPlaylistModal={openPlaylistModal}
            />
          </motion.div>
        )}
        {selectedTab === "playlist" && (
          <motion.div
            key="playlist"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <PlayList
              playlists={playlists}
              addPlaylist={addPlaylistUtil}
              deletePlaylist={openDeleteConfirmModal}
              openEditModal={openEditModal}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
              <motion.button
                onClick={closeEditModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes size={20} />
              </motion.button>
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

      {/* Confirm Modal */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeConfirmModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={close}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes size={20} />
              </motion.button>
              <ConfirmModal
                isOpen={isConfirmModalOpen}
                message="Are you sure you want to delete this playlist? This action cannot be undone."
                confirmAction={async () => {
                  if (selectedPlaylist) {
                    await deletePlaylistUtil(selectedPlaylist.id);
                    setIsConfirmModalOpen(false);
                  }
                }}
                cancelAction={() => setIsConfirmModalOpen(false)}
                confirmText="Delete"
                cancelText="Cancel"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlist Modal */}
      <AnimatePresence>
        {isPlaylistModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closePlaylistModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={closePlaylistModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes size={20} />
              </motion.button>
              <PlaylistModal
                playlists={playlists}
                saveToPlaylists={saveToPlaylists}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
