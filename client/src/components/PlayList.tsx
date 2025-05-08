import React from 'react';
import type { Playlist } from '../types/Playlist';
import { motion } from 'framer-motion';

interface PlayListProps {
    playlists: Playlist[];
}

const PlayList: React.FC<PlayListProps> = ({ playlists }) => {
    return (
        <div>
      <h2>Playlists</h2>
      {playlists && playlists.length > 0 ? (
        <motion.div
          className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {playlists.map((playlist: Playlist) => (
            <div
              key={playlist.id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold mt-2">{playlist.name}</h2>
              <button
                className="mt-2 px-4 py-2 bg-secondary text-white rounded-md shadow-md hover:bg-primary"
              >
                Delete
              </button>
            </div>
          ))}
        </motion.div>
      ) : (
        <p className="text-lg text-gray-600 text-center mt-4">
          No playlist found.
        </p>
      )}
    </div>
    );
};

export default PlayList;