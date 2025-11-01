import React, { useState, useEffect } from "react";
import type { Movie } from "../types/Movie";
import { useParams, useNavigate } from "react-router-dom";
import usePlaylistStore from "../stores/playlist";
import Loader from "../components/Loader";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  movies: Movie[];
  createdDate: string;
}

const PlaylistDetail: React.FC = () => {
  const { getSinglePlaylist } = usePlaylistStore();

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const playlist = await getSinglePlaylist(id);
      if (playlist) {
        setPlaylist(playlist);
      }
      setLoading(false);
    };
    fetchPlaylist();
  }, [id, getSinglePlaylist]);

  console.log("Playlist details:", playlist);

  if (loading) {
    return <Loader />;
  }

  if (!playlist) {
    return (
      <p className="text-lg text-gray-600 text-center">No playlist found.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
      >
        Go Back
      </button>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2">{playlist.name}</h2>
        <p className="text-sm text-gray-500 mb-6">
          Created At: {new Date(playlist.createdDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PlaylistDetail;
