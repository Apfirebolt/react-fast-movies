import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit } from "react-icons/fa";

interface Playlist {
  id: string;
  name: string;
}

interface PlayListFormProps {
  addPlaylist: (name: string) => void;
  updatePlaylist?: (payload: { id: string; name: string }) => void;
  playlist?: Playlist;
}

const PlayListForm: React.FC<PlayListFormProps> = ({
  playlist,
  updatePlaylist,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const isEditing = !!playlist;

  useEffect(() => {
    if (playlist) {
      setPlaylistName(playlist.name);
    }
  }, [playlist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && updatePlaylist && playlist) {
      const payload = {
        id: playlist.id,
        name: playlistName
      }  
      updatePlaylist(payload);
    }
    setPlaylistName("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? "Edit Playlist" : "Create New Playlist"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="playlistName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Playlist Name
          </label>
          <div className="relative">
            {isEditing ? (
              <FaEdit className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            ) : (
              <FaPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            )}
            <input
              type="text"
              id="playlistName"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter playlist name"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
        >
          {isEditing ? <FaEdit /> : <FaPlus />}
          {isEditing ? "Update Playlist" : "Create Playlist"}
        </button>
      </form>
    </div>
  );
};

export default PlayListForm;
