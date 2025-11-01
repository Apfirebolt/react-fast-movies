import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../config";
import Cookie from "js-cookie";

interface Movie {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
}

interface Error {
  message: string;
}

interface MovieState {
  movies: Movie[];
  fetchMovies: () => Promise<void>;
  addMovie: (movieData: {
    title: string;
    description: string;
    releaseDate: string;
  }) => Promise<void>;
  deleteMovie: (movieId: string) => Promise<void>;
}

const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  fetchMovies: async () => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const response = await axios.get(`${API_URL}/movies`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        set({ movies: response.data });
      }
    } catch (error: Error | any) {
      console.log(error);
      toast.error("Failed to fetch movies.");
    }
  },
  addMovie: async (movieData) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      const response = await axios.post(`${API_URL}/movies`, movieData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        set({ movies: [...get().movies, response.data] });
        toast.success("Movie added successfully!");
      }
    } catch (error: Error | any) {
      console.log(error);
      toast.error("Failed to add movie.");
    }
  },
  deleteMovie: async (movieId) => {
    try {
      const token = Cookie.get("user")
        ? JSON.parse(Cookie.get("user") as string).access_token
        : null;
      if (!token) {
        toast.error("User is not authenticated.");
        return;
      }

      console.log('Before api call to delete movie with id:', movieId);

      const response = await axios.delete(`${API_URL}/movies/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        set({ movies: get().movies.filter((movie) => movie.id !== movieId) });
        toast.success("Movie deleted successfully!");
      }
    } catch (error: Error | any) {
      console.log(error);
      toast.error("Failed to delete movie.");
    }
  },
}));

export default useMovieStore;
