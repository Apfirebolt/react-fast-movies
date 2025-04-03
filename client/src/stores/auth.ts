import { create } from 'zustand';
import { API_URL } from '../config';
import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    login: (userData: { email: string; password: string }) => Promise<void>;
    logout: () => void;
    register: (userData: { name: string; email: string; password: string }) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    login: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, userData, {
                headers: { 'Content-Type': 'application/json' },
            });
            set({ user: response.data });
        } catch (error) {
            throw new Error('Login failed');
        }
    },
    logout: () => set({ user: null }),
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData, {
                headers: { 'Content-Type': 'application/json' },
            });
            set({ user: response.data });
        } catch (error) {
            throw new Error('Registration failed');
        }
    },
}));

export default useAuthStore;
