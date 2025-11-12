import React from "react";
import type { Playlist } from "../types/Playlist";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PlayListForm from "./PlayListForm";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface Playlist {
  id: string;
  name: string;
}

interface PlayListProps {
  playlists: Playlist[];
  addPlaylist: (name: string) => void;
  deletePlaylist: (payload : {
    id: string,
    name?: string 
  }) => void;
  openEditModal: (playlist: Playlist) => void;
}

const PlayList: React.FC<PlayListProps> = ({
  playlists,
  addPlaylist,
  deletePlaylist,
  openEditModal
}) => {

  const navigate = useNavigate();
  const goToPlaylistDetails = (imdbID: string) => {
    navigate(`/playlist/${imdbID}`);
  };
  return (
    <div>
      <h2>Playlists</h2>
      <PlayListForm addPlaylist={addPlaylist} />
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
              className="bg-white shadow-lg rounded-xl overflow-hidden"
            >
              <h2 className="text-xl font-semibold mt-2 text-light bg-primary text-center py-3">{playlist.name}</h2>
              <div className="flex items-center justify-center gap-3 p-4">
              <button
                onClick={() => deletePlaylist({ id: playlist.id, name: playlist.name })}
                className="px-4 py-2 bg-secondary text-white rounded-lg shadow-md hover:bg-primary hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FaTrash />
              </button>
              <button onClick={() => openEditModal(playlist)} className="px-4 py-2 bg-success text-white rounded-lg shadow-md hover:bg-primary hover:shadow-lg transition-all flex items-center gap-2">
                <FaEdit />
              </button>
              <button onClick={() => goToPlaylistDetails(playlist.id)} className="px-4 py-2 bg-info text-black rounded-lg shadow-md hover:bg-primary hover:text-light hover:shadow-lg transition-all flex items-center gap-2">
                <FaEye />
              </button>
              </div>
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
