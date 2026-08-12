import React, { useState } from "react";
import type { Playlist } from "../types/Playlist";
import { FaBookmark, FaCheck, FaFolderPlus } from "react-icons/fa";

interface PlayListProps {
  playlists: Playlist[];
  movieId?: string;
  saveToPlaylists?: (playlistIds: string[]) => void;
}

const PlayList: React.FC<PlayListProps> = ({ playlists, saveToPlaylists }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  const handleCheckboxChange = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlaylists.length === 0) return;
    saveToPlaylists?.(selectedPlaylists);
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <FaFolderPlus className="w-3.5 h-3.5" />
          <span>Add to Collection</span>
        </div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Select Playlists
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Choose one or more playlists to add this movie to:
        </p>
      </div>

      {playlists && playlists.length > 0 ? (
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Playlists Selection List */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {playlists.map((playlist: Playlist) => {
              const playlistIdStr = String(playlist.id);
              const isChecked = selectedPlaylists.includes(playlistIdStr);

              return (
                <div
                  key={playlist.id}
                  onClick={() => handleCheckboxChange(playlistIdStr)}
                  className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isChecked
                      ? "bg-indigo-950/40 border-indigo-500/80 text-white shadow-md shadow-indigo-950/20"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    {/* Custom Checkbox Indicator */}
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                        isChecked
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-slate-700 bg-slate-900 group-hover:border-slate-600"
                      }`}
                    >
                      {isChecked && <FaCheck className="w-2.5 h-2.5" />}
                    </div>

                    <span className="text-sm font-semibold truncate">
                      {playlist.name}
                    </span>
                  </div>

                  {isChecked && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      Selected
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={selectedPlaylists.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FaBookmark className="w-3.5 h-3.5" />
              <span>
                Save to {selectedPlaylists.length}{" "}
                {selectedPlaylists.length === 1 ? "Playlist" : "Playlists"}
              </span>
            </button>
          </div>
        </form>
      ) : (
        /* Empty State */
        <div className="text-center py-10 px-4 bg-slate-950/60 rounded-2xl border border-dashed border-slate-800">
          <span className="text-3xl block mb-2 opacity-80">📑</span>
          <h3 className="text-sm font-bold text-white mb-1">No Playlists Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            You haven&apos;t created any playlists yet. Head over to your Dashboard to create one!
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayList;