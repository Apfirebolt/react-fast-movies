import React, { useState, useEffect } from "react";
import type { Movie } from "../types/Movie";
import { useParams, useNavigate } from "react-router-dom";
import usePlaylistStore from "../stores/playlist";
import Loader from "../components/Loader";

interface Playlist {
  playlist: {
    createdDate: string;
    name: string;
    owner_id: number;
    id: number;
  };
  movies: Movie[];
}

const PlaylistDetail: React.FC = () => {
  const { getSinglePlaylist, removeMovieFromPlaylist } = usePlaylistStore();

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

  const deletePlaylistMovie = async (movieId: string) => {
    // Implement delete movie from playlist functionality here
    console.log(`Delete movie ${movieId} from playlist ${id}`);
    await removeMovieFromPlaylist(id!, movieId);
    // Refresh playlist details after deletion
    const updatedPlaylist = await getSinglePlaylist(id);
    if (updatedPlaylist) {
      setPlaylist(updatedPlaylist);
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (!playlist) {
    return (
      <p className="text-lg text-gray-600 text-center">No playlist found.</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
      >
        Go Back
      </button>

      <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2">{playlist.playlist.name}</h2>
        <p className="text-sm text-gray-500 mb-6">
          Created At: {new Date(playlist.playlist.createdDate).toLocaleDateString()}
        </p>

        {playlist.movies.length === 0 ? (
          <p className="text-lg text-gray-600">No movies in this playlist.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {playlist.movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-96 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{movie.title}</h3>
                  <p className="text-sm text-gray-600">Year: {movie.year}</p>
                  <button
                    onClick={() => deletePlaylistMovie(movie.id.toString())}
                    className="mt-2 px-3 py-1 bg-danger text-white text-sm rounded hover:bg-red-600"
                  >
                    Remove from Playlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;
