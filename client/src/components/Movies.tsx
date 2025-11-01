import React from "react";
import { motion } from "framer-motion";
import type { Movie } from "../types/Movie";
import { FaTrash, FaPlusCircle } from "react-icons/fa";

interface MovieListProps {
  movies: Movie[];
  deleteMovie: (id: string) => void;
  openPlaylistModal: () => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  deleteMovie,
  openPlaylistModal,
}) => {
  return (
    <div>
      <h2>Movies</h2>
      {movies && movies.length > 0 ? (
        <motion.div
          className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {movies.map((movie: Movie) => (
            <div
              key={movie.imdbID}
              className="bg-white shadow-md rounded-lg p-2"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-64 rounded-md"
              />
              <h2 className="text-xl font-semibold mt-2">{movie.title}</h2>
              <p className="text-gray-600">{movie.year}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => deleteMovie(movie.id)}
                  className="px-4 py-2 bg-secondary text-white rounded-md flex items-center shadow-md hover:bg-primary"
                >
                  <FaTrash className="inline-block mr-2" />
                  Delete
                </button>
                <button
                  onClick={() => openPlaylistModal(movie.id)}
                  className="px-4 py-2 bg-info text-black rounded-md flex items-center shadow-md hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <FaPlusCircle className="inline-block mr-2" />
                  Add to Playlist
                </button>
              </div>
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

export default MovieList;
