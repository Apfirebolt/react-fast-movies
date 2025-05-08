import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";
import Cookie from "js-cookie";

interface Playlist {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface PlaylistState {
  playlists: Playlist[];
  fetchPlaylists: () => Promise<void>;
  addPlaylist: (playlistData: {
    name: string;
    description: string;
  }) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
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
  addPlaylist: async (playlistData) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const response = await axios.post(`${API_URL}/playlists`, playlistData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        set({ playlists: [...get().playlists, response.data] });
        toast.success("Playlist added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add playlist.");
    }
  },
  deletePlaylist: async (playlistId) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).token
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
}));

export default usePlaylistStore;
