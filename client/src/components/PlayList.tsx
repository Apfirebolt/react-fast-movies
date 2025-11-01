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
              className="bg-white shadow-md rounded-lg"
            >
              <h2 className="text-xl font-semibold mt-2 text-light bg-primary text-center">{playlist.name}</h2>
              <div className="flex items-center p-4">
                <button
                  onClick={() => deletePlaylist({ id: playlist.id, name: playlist.name })}
                  className="mt-2 px-4 py-2 bg-secondary text-white rounded-md shadow-md hover:bg-primary flex items-center gap-2"
                >
                  <FaTrash />
                </button>
                <button onClick={() => openEditModal(playlist)} className="mt-2 px-4 py-2 bg-success ml-2 text-white rounded-md shadow-md hover:bg-primary flex items-center gap-2">
                  <FaEdit />
                </button>
                <button onClick={() => goToPlaylistDetails(playlist.id)} className="mt-2 px-4 py-2 bg-info ml-2 text-black rounded-md shadow-md hover:bg-primary hover:text-light flex items-center gap-2">
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
