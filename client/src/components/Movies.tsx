import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie } from "../types/Movie";
import { FaTrash, FaPlusCircle, FaFilm } from "react-icons/fa";

interface MovieListProps {
  movies: Movie[];
  deleteMovie: (id: string) => void;
  openPlaylistModal: (movie: Movie) => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  deleteMovie,
  openPlaylistModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Saved Movies
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Your personal collection of saved films
          </p>
        </div>
        {movies && movies.length > 0 && (
          <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            {movies.length} {movies.length === 1 ? "Movie" : "Movies"}
          </span>
        )}
      </div>

      {movies && movies.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <AnimatePresence>
            {movies.map((movie: Movie) => {
              const hasPoster = movie.poster && movie.poster !== "N/A";

              return (
                <motion.div
                  key={movie.imdbID || movie.id}
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

                  {/* Details & Actions Footer */}
                  <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {movie.title}
                      </h3>
                      {movie.type && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-1 block">
                          {movie.type}
                        </span>
                      )}
                    </div>

                    {/* Actions Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => openPlaylistModal(movie)}
                        className="w-full py-2 px-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <FaPlusCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        <span className="truncate">Playlist</span>
                      </button>

                      <button
                        onClick={() => deleteMovie(movie.id)}
                        className="w-full py-2 px-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 text-red-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <FaTrash className="w-3 h-3 text-red-400 flex-shrink-0" />
                        <span className="truncate">Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800/80">
          <span className="text-4xl block mb-2 opacity-80">🎬</span>
          <h3 className="text-lg font-bold text-white">No Movies Saved Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Search for movies on the Home page and save them here to build your collection.
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieList;