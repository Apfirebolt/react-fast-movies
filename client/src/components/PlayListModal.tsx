import React, { useState } from "react";
import type { Playlist } from "../types/Playlist";

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
    saveToPlaylists?.(selectedPlaylists);
  };

  return (
    <div>
      <h2>Playlists</h2>
      <p>You can select multiple playlists to add the movie to:</p>
      {playlists && playlists.length > 0 ? (
        <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 gap-4">
          {playlists.map((playlist: Playlist) => (
            <div key={playlist.id} className="bg-white shadow-md rounded-lg">
              <label className="flex items-center p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={selectedPlaylists.includes(playlist.id)}
                  onChange={() => handleCheckboxChange(playlist.id)}
                />
                <span className="text-lg font-medium text-gray-800">
                  {playlist.name}
                </span>
              </label>
            </div>
          ))}
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Submit
          </button>
        </form>
      ) : (
        <p className="text-lg text-gray-600 text-center mt-4">
          No playlist found.
        </p>
      )}
    </div>
  );
};

export default PlayList;
