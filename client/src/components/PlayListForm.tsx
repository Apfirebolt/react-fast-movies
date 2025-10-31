import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

interface PlayListFormProps {
  addPlaylist: (name: string) => void;
}

const PlayListForm: React.FC<PlayListFormProps> = ({ addPlaylist }) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaylistName("");
    // api call to add playlist
    addPlaylist(playlistName);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="playlistName"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Playlist Name
          </label>
          <div className="relative">
            <FaPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="playlistName"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter playlist name"
              required
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="mx-auto px-4 py-2 text-white flex justify-around items-center bg-tertiary rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FaPlus className="mx-1" />
            Create Playlist
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayListForm;
