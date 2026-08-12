import React from "react";
import type { Playlist as PlaylistType } from "../types/Playlist";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PlayListForm from "./PlayListForm";
import { FaEdit, FaTrash, FaEye, FaListUl } from "react-icons/fa";

interface PlayListProps {
  playlists: PlaylistType[];
  addPlaylist: (name: string) => void;
  deletePlaylist: (payload: { id: string | number; name?: string }) => void;
  openEditModal: (playlist: PlaylistType) => void;
}

const PlayList: React.FC<PlayListProps> = ({
  playlists,
  addPlaylist,
  deletePlaylist,
  openEditModal,
}) => {
  const navigate = useNavigate();

  const goToPlaylistDetails = (playlistId: string | number) => {
    navigate(`/playlist/${playlistId}`);
  };

  return (
    <div className="space-y-8">
      {/* Playlist Creation Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <PlayListForm addPlaylist={addPlaylist} />
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Your Playlists
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize and manage your custom movie collections
          </p>
        </div>
        {playlists && playlists.length > 0 && (
          <span className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            {playlists.length} {playlists.length === 1 ? "Playlist" : "Playlists"}
          </span>
        )}
      </div>

      {/* Playlist Cards Grid */}
      {playlists && playlists.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <AnimatePresence>
            {playlists.map((playlist: PlaylistType) => (
              <motion.div
                key={playlist.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Playlist Header & Title */}
                <div className="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-800/30 to-transparent">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <FaListUl className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                        {playlist.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                        Collection ID: #{playlist.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-slate-950/40 flex items-center justify-between gap-2">
                  <button
                    onClick={() => goToPlaylistDetails(playlist.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    title="View Playlist Details"
                  >
                    <FaEye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => openEditModal(playlist)}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    title="Edit Playlist Name"
                  >
                    <FaEdit className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    onClick={() =>
                      deletePlaylist({ id: String(playlist.id), name: playlist.name })
                    }
                    className="py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 text-red-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    title="Delete Playlist"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800/80">
          <span className="text-4xl block mb-2 opacity-80">📑</span>
          <h3 className="text-lg font-bold text-white">No Playlists Created</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Use the form above to create your first playlist and start organizing movies!
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayList;