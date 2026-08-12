import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../stores/auth";
import usePlaylistStore from "../stores/playlist";
import useMovieStore from "../stores/movie";
import type { Movie, Movies } from "../types/Movie";
import type { Playlist } from "../types/Playlist";
import { API_URL } from "../config";
import Loader from "../components/Loader";
import Content from "../components/Content";
import MoviesList from "../components/Movies";
import PlayListFormModal from "../components/PlayListFormModal";
import PlaylistModal from "../components/PlayListModal";
import ConfirmModal from "../components/ConfirmModal";
import PlayList from "../components/PlayList";
import { FaBookmark, FaListUl, FaTimes, FaSearch } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("movies");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();
  const { deletePlaylist, addPlaylist, updatePlaylist, addMovieToPlaylist } =
    usePlaylistStore();
  const { deleteMovie } = useMovieStore();

  const openEditModal = (playlist: Playlist): void => {
    setSelectedPlaylist(playlist);
    setIsEditModalOpen(true);
  };

  const closeEditModal = (): void => {
    setIsEditModalOpen(false);
  };

  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
  };

  const fetchMovies = async (): Promise<void> => {
    if (!user?.access_token) return;
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Movies>(`${API_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.status === 401) {
        toast.dismiss();
        toast.error("Session expired. Please log in again.");
      }
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async (): Promise<void> => {
    if (!user?.access_token) return;
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Playlist[]>(`${API_URL}/playlists`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (response.status === 200) {
        setPlaylists(response.data);
      }
    } catch (err: any) {
      if (err?.response?.status === 401 || err?.status === 401) {
        toast.dismiss();
        toast.error("Session expired. Please log in again.");
      }
      setError("Failed to fetch playlists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteMovieUtil = async (movieId: number): Promise<void> => {
    await deleteMovie(movieId);
    await fetchMovies();
  };

  const deletePlaylistUtil = async (playlistId: number): Promise<void> => {
    await deletePlaylist(playlistId);
    await fetchPlaylists();
  };

  const addPlaylistUtil = async (playlist: any): Promise<void> => {
    await addPlaylist(playlist);
    await fetchPlaylists();
  };

  const updatePlaylistUtil = async (playlistData: any): Promise<void> => {
    await updatePlaylist(playlistData);
    await fetchPlaylists();
    closeEditModal();
  };

  const handleTabChange = (tab: string): void => {
    setSelectedTab(tab);
    setSearchQuery("");
  };

  const openDeleteConfirmModal = (playlist: Playlist): void => {
    setSelectedPlaylist(playlist);
    setIsConfirmModalOpen(true);
  };

  const openPlaylistModal = (movie: Movie): void => {
    setSelectedMovie(movie);
    setIsPlaylistModalOpen(true);
  };

  const closePlaylistModal = (): void => {
    setIsPlaylistModalOpen(false);
  };

  const saveToPlaylists = async (playlistIds: string[]): Promise<void> => {
    if (!selectedMovie) {
      toast.error("No movie selected to add to playlists.");
      return;
    }
    try {
      await addMovieToPlaylist(selectedMovie.id, playlistIds);
      closePlaylistModal();
    } catch (error) {
      toast.error("Failed to save movie to playlists.");
    }
  };

  const filteredMovies = movies
    ? (movies as Movie[]).filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    fetchMovies();
    fetchPlaylists();
  }, []);

  return (
    <motion.div
      className="relative min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Content
            title="Welcome to Your Dashboard"
            content="Manage your personal library, curate custom playlists, and organize your favorite cinematic collections in one place."
          />
        </motion.div>

        {/* Search & Navigation Bar */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Search Input (Only shown on Movies tab) */}
          {selectedTab === "movies" ? (
            <div className="relative w-full sm:w-80">
              <FaSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filter saved movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
              />
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium">
              Manage and organize your custom playlists
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <motion.button
              onClick={() => handleTabChange("movies")}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2 ${
                selectedTab === "movies"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaBookmark className="w-3.5 h-3.5" />
              <span>Saved Movies ({movies ? (movies as Movie[]).length : 0})</span>
            </motion.button>

            <motion.button
              onClick={() => handleTabChange("playlist")}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2 ${
                selectedTab === "playlist"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaListUl className="w-3.5 h-3.5" />
              <span>Playlists ({playlists.length})</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading Spinner State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="py-12 flex justify-center"
            >
              <Loader />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State Banner */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              className="max-w-md mx-auto p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-center text-red-300 text-sm font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {selectedTab === "movies" && !loading && (
            <motion.div
              key="movies"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <MoviesList
                movies={filteredMovies as any}
                deleteMovie={deleteMovieUtil}
                openPlaylistModal={openPlaylistModal}
              />
            </motion.div>
          )}

          {selectedTab === "playlist" && !loading && (
            <motion.div
              key="playlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
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

        {/* Modal: Edit Playlist */}
        <AnimatePresence>
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeEditModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-slate-200"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <button
                  onClick={closeEditModal}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
                >
                  <FaTimes size={18} />
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

        {/* Modal: Confirm Playlist Delete */}
        <AnimatePresence>
          {isConfirmModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closeConfirmModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-slate-200"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <button
                  onClick={closeConfirmModal}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
                >
                  <FaTimes size={18} />
                </button>
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

        {/* Modal: Add Movie to Playlist */}
        <AnimatePresence>
          {isPlaylistModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={closePlaylistModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 400 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-slate-200"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <button
                  onClick={closePlaylistModal}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
                >
                  <FaTimes size={18} />
                </button>
                <PlaylistModal
                  playlists={playlists}
                  saveToPlaylists={saveToPlaylists}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default Dashboard;