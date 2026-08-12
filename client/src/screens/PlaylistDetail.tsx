import React, { useState, useEffect } from "react";
import type { Movie } from "../types/Movie";
import { useParams, useNavigate } from "react-router-dom";
import usePlaylistStore from "../stores/playlist";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaTrash, FaFilm, FaCalendarAlt } from "react-icons/fa";

interface Playlist {
  playlist: {
    createdDate: string;
    name: string;
    owner_id: number;
    id: number;
  };
  movies: Movie[];
}

const PlaylistDetail: React.FC = () => {
  const { getSinglePlaylist, removeMovieFromPlaylist } = usePlaylistStore();

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      const data = await getSinglePlaylist(id);
      if (data) {
        setPlaylist(data);
      }
      setLoading(false);
    };
    fetchPlaylist();
  }, [id, getSinglePlaylist]);

  const deletePlaylistMovie = async (movieId: string) => {
    if (!id) return;
    try {
      setRemovingId(movieId);
      await removeMovieFromPlaylist(id, movieId);
      // Refresh playlist details after deletion
      const updatedPlaylist = await getSinglePlaylist(id);
      if (updatedPlaylist) {
        setPlaylist(updatedPlaylist);
      }
    } catch (error) {
      console.error("Failed to remove movie from playlist:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 py-16 px-4 flex flex-col items-center justify-center">
        <div className="text-center py-16 px-6 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 max-w-md w-full">
          <span className="text-5xl block mb-3 opacity-80">🎬</span>
          <h3 className="text-xl font-bold text-white mb-2">Playlist Not Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            The playlist you are looking for might have been deleted or doesn&apos;t exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <main className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Navigation & Header Banner */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mb-2 cursor-pointer"
            >
              <FaArrowLeft className="w-3 h-3" />
              <span>Back to Dashboard</span>
            </button>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {playlist.playlist.name}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <FaCalendarAlt className="w-3.5 h-3.5 text-slate-500" />
                <span>Created {formatDate(playlist.playlist.createdDate)}</span>
              </span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20">
                {playlist.movies.length} {playlist.movies.length === 1 ? "Movie" : "Movies"}
              </span>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {playlist.movies.length === 0 ? (
          <div className="text-center py-20 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
            <span className="text-5xl block mb-3 opacity-80">🍿</span>
            <h3 className="text-lg font-bold text-white mb-1">Playlist is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
              You haven&apos;t added any movies to this playlist yet. Explore movies and save them here!
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence>
              {playlist.movies.map((movie) => {
                const movieIdStr = String(movie.id);
                const isRemoving = removingId === movieIdStr;
                const hasPoster = movie.poster && movie.poster !== "N/A";

                return (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="group relative bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Poster Image Container */}
                    <div className="relative aspect-[2/3] w-full bg-slate-950 overflow-hidden">
                      {hasPoster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 p-4 text-center">
                          <FaFilm className="w-10 h-10 mb-2 opacity-40" />
                          <span className="text-xs">No Poster Available</span>
                        </div>
                      )}

                      {/* Release Year Badge */}
                      {movie.year && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300 backdrop-blur-md">
                          {movie.year}
                        </span>
                      )}
                    </div>

                    {/* Movie Information & Action Footer */}
                    <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                          {movie.title}
                        </h3>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60">
                        <button
                          onClick={() => deletePlaylistMovie(movieIdStr)}
                          disabled={isRemoving}
                          className="w-full py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 text-red-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <FaTrash className="w-3 h-3 text-red-400 flex-shrink-0" />
                          <span>{isRemoving ? "Removing..." : "Remove from Playlist"}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </main>
    </div>
  );
};

export default PlaylistDetail;