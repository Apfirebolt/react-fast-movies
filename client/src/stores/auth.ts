import { create } from "zustand";
import { API_URL } from "../config";
import axios from "axios";
import { toast } from "react-toastify";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => {
  let navigate: ReturnType<typeof useNavigate>; // Store the navigate function

  return {
    user: Cookie.get("user") ? JSON.parse(Cookie.get("user") as string) : null,
    login: async (userData) => {
      try {
        const response = await axios.post(`${API_URL}/auth/login`, userData, {
          headers: { "Content-Type": "application/json" },
        });
        if (response.status === 200) {
          set({ user: response.data });
          toast.success("Login successful!");
          Cookie.set("user", JSON.stringify(response.data), { expires: 7 });
          if (navigate) {
            // Check if navigate is available
            navigate("/dashboard"); // Navigate to dashboard
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          toast.error(error.response.data.detail);
        } else {
          toast.error("An unexpected error occurred while logging in.");
        }
      }
    },
    logout: () => {
      set({ user: null });
      Cookie.remove("user");
      toast.success("Logout successful!");
      if (navigate) {
        navigate("/");
      }
    },
    register: async (userData) => {
      try {
        const response = await axios.post(
          `${API_URL}/auth/register`,
          userData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.status === 201) {
          set({ user: response.data });
          toast.success("Registration successful!");
          if (navigate) {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.detail
        ) {
          toast.error(error.response.data.detail);
        } else {
          toast.error("An unexpected error occurred while registering.");
        }
      }
    },
    setNavigate: (nav: ReturnType<typeof useNavigate>) => {
      // Add setNavigate
      navigate = nav;
    },
  };
});

// Add a setNavigate function to the store
export const useAuthStoreWithNavigate = () => {
  const store = useAuthStore();
  const navigate = useNavigate();

  store.setNavigate(navigate);
  return store;
};

export default useAuthStoreWithNavigate;
