import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaFolderPlus } from "react-icons/fa";

interface Playlist {
  id: string | number;
  name: string;
}

interface PlayListFormProps {
  addPlaylist: (name: string) => void;
  updatePlaylist?: (payload: { id: string | number; name: string }) => void;
  playlist?: Playlist | null;
  onClose?: () => void;
}

const PlayListFormModal: React.FC<PlayListFormProps> = ({
  playlist,
  addPlaylist,
  updatePlaylist,
  onClose,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const isEditing = !!playlist;

  useEffect(() => {
    if (playlist) {
      setPlaylistName(playlist.name);
    } else {
      setPlaylistName("");
    }
  }, [playlist]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;

    if (isEditing && updatePlaylist && playlist) {
      updatePlaylist({
        id: playlist.id,
        name: playlistName.trim(),
      });
    } else {
      addPlaylist(playlistName.trim());
    }

    setPlaylistName("");
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Modal Section Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <FaFolderPlus className="w-3.5 h-3.5" />
          <span>{isEditing ? "Collection Settings" : "New Collection"}</span>
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isEditing ? "Edit Playlist" : "Create New Playlist"}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {isEditing
            ? "Update the title of your movie collection"
            : "Give your new movie playlist a memorable name"}
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="playlistName"
            className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2"
          >
            Playlist Name
          </label>
          <div className="relative">
            {isEditing ? (
              <FaEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
            ) : (
              <FaPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
            )}
            <input
              type="text"
              id="playlistName"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder-slate-500"
              placeholder="e.g., Marvel Cinematic Universe, Horror Nights..."
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={!playlistName.trim()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-indigo-950/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isEditing ? <FaEdit className="w-3.5 h-3.5" /> : <FaPlus className="w-3.5 h-3.5" />}
            <span>{isEditing ? "Update Playlist" : "Create Playlist"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayListFormModal;