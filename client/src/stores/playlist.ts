import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";
import type { Playlist } from "../types/Playlist";
import Cookie from "js-cookie";

interface PlaylistState {
  playlists: Playlist[];
  fetchPlaylists: () => Promise<void>;
  addPlaylist: (playlistName: string) => Promise<void>;
  getSinglePlaylist: (playlistId: string) => Promise<Playlist | undefined>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  updatePlaylist: (playlistData: { name: string }) => Promise<void>;
  addMovieToPlaylist: (playlistId: string, movieId: string) => Promise<void>;
  removeMovieFromPlaylist: (
    playlistId: string,
    movieId: string
  ) => Promise<void>;
}

const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  fetchPlaylists: async () => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const response = await axios.get(`${API_URL}/playlists`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        set({ playlists: response.data });
      }
    } catch (error) {
      toast.error("Failed to fetch playlists.");
    }
  },
  addPlaylist: async (playlistName: string) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).access_token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const response = await axios.post(
        `${API_URL}/playlists`,
        { name: playlistName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        set({ playlists: [...get().playlists, response.data] });
        toast.success("Playlist added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add playlist.");
    }
  },
  getSinglePlaylist: async (playlistId: string): Promise<Playlist | undefined> => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).access_token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return undefined;
      }

      const response = await axios.get<Playlist>(
        `${API_URL}/playlists/${playlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        return response.data;
      }
      return undefined;
    } catch (error) {
      toast.error("Failed to fetch playlist.");
      return undefined;
    }
  },
  deletePlaylist: async (playlistId) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).access_token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/playlists/${playlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        set({
          playlists: get().playlists.filter(
            (playlist) => playlist.id !== playlistId
          ),
        });
        toast.success("Playlist deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete playlist.");
    }
  },
  updatePlaylist: async (playlistData) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).access_token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const response = await axios.put(
        `${API_URL}/playlists/${playlistData.id}`,
        { name: playlistData.name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        set({
          playlists: get().playlists.filter(
            (playlist) => playlist.id !== playlistData.id
          ),
        });
        toast.success("Playlist updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to delete playlist.");
    }
  },
  addMovieToPlaylist: async (movieId, playlistIds) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).access_token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const payload = {
        movieId: movieId,
        playlistId: playlistIds,
      };

      console.log('Payload for adding movie to playlists:', payload);

      const response = await axios.post(
        `${API_URL}/playlists/add/${movieId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Movie added to playlist successfully!");
      }
    } catch (error) {
      toast.error("Failed to add movie to playlist.");
    }
  },
  removeMovieFromPlaylist: async (playlistId, movieId) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).access_token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const response = await axios.delete(
        `${API_URL}/playlists/${playlistId}/movies/${movieId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Movie removed from playlist successfully!");
      }
    } catch (error) {
      toast.error("Failed to remove movie from playlist.");
    }
  },
}));

export default usePlaylistStore;
