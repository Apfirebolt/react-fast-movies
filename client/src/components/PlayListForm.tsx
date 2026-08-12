import React, { useState } from "react";
import { FaPlus, FaFolderPlus } from "react-icons/fa";

interface PlayListFormProps {
  addPlaylist: (name: string) => void;
}

const PlayListForm: React.FC<PlayListFormProps> = ({ addPlaylist }) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;
    
    addPlaylist(playlistName.trim());
    setPlaylistName("");
  };

  return (
    <div className="space-y-4">
      {/* Form Header */}
      <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
        <FaFolderPlus className="w-3.5 h-3.5" />
        <span>Create Collection</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label
          htmlFor="playlistName"
          className="block text-sm font-semibold text-white tracking-tight"
        >
          Playlist Name
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Input with Icon */}
          <div className="relative w-full flex-grow">
            <FaPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
            <input
              type="text"
              id="playlistName"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
              placeholder="e.g., Sci-Fi Classics, Weekend Binge..."
              required
            />
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={!playlistName.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-950/40 transition-all flex items-center justify-center space-x-2 flex-shrink-0 cursor-pointer"
          >
            <FaPlus className="w-3 h-3" />
            <span>Create Playlist</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayListForm;