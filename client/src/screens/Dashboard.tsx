import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthStore from "../stores/auth";
import { Movie, Movies } from "../types/Movie";
import type { Playlist } from "../types/Playlist";
import { API_URL } from "../config";
import Loader from "../components/Loader";
import Content from "../components/Content";
import MoviesList from "../components/Movies";
import PlayList from "../components/PlayList";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("movies");
  const [loading, setLoading] = useState<boolean>(false);
  const [movies, setMovies] = useState<Movies | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Movie>(`${API_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (response.status === 200) {
        setMovies(response.data);
      }
    } catch (err) {
      if (err.status === 401) {
        toast.dismiss();
        toast.error("Session expired. Please log in again.");
      }
      setError("Failed to fetch movies. Please try again.");
    }
    setLoading(false);
  };

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/playlists`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      if (response.status === 200) {
        setPlaylists(response.data);
      }
    } catch (err) {
      if (err.status === 401) {
        toast.dismiss();
        toast.error("Session expired. Please log in again.");
      }
      setError("Failed to fetch playlists. Please try again.");
    }
    setLoading(false);
  };

  const addPlaylist = async (playlistName: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${API_URL}/playlists`,
        { name: playlistName },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        toast.dismiss();
        toast.success("Playlist created successfully.");
        await fetchPlaylists();
      }
    } catch (err) {
      if (err.status === 401) {
        toast.dismiss();
        toast.error("Session expired. Please log in again.");
      }
      setError("Failed to create playlist. Please try again.");
    }
    setLoading(false);
  };

  const deleteMovie = async (movie: MovieDetails) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(`${API_URL}/movies/${movie.imdbID}`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      if (response.status === 204) {
        toast.dismiss();
        toast.success("Movie deleted successfully.");
        await fetchMovies();
      }
    } catch (err) {
      setError("Failed to delete movie. Please try again.");
    }
    setLoading(false);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setSearchQuery("");
  };

  const filteredMovies = movies?.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchMovies();
    fetchPlaylists();
  }, []);

  return (
    <div className="bg-light p-4">
      <Content
        title="Welcome to Your Dashboard"
        content="Welcome to your dashboard! Here you can manage your account, track your
      favorite movies, and explore personalized recommendations."
      />

      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-full sm:w-1/2"
        />

        <div className="flex justify-center my-4">
          <button
            onClick={() => handleTabChange("movies")}
            className={`px-4 py-2 mx-2 ${
              selectedTab === "movies"
                ? "bg-primary text-white"
                : "bg-gray-200 text-black"
            } rounded-md shadow-md`}
          >
            Saved Movies
          </button>
          <button
            onClick={() => handleTabChange("playlist")}
            className={`px-4 py-2 mx-2 ${
              selectedTab === "playlist"
                ? "bg-primary text-white"
                : "bg-gray-200 text-black"
            } rounded-md shadow-md`}
          >
            Playlist
          </button>
        </div>
      </div>

      {loading && <Loader />}
      {error && (
        <p className="text-lg text-secondary text-center border-2 border-primary px-2 py-3">
          {error}
        </p>
      )}
      {selectedTab === "movies" && (
        <MoviesList movies={filteredMovies} deleteMovie={deleteMovie} />
      )}
      {selectedTab === "playlist" && <PlayList playlists={playlists} addPlaylist={addPlaylist} />}
    </div>
  );
};

export default Dashboard;
