import { create } from 'zustand';
import { API_URL } from '../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';


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
    user: Cookie.get('user') ? JSON.parse(Cookie.get('user') as string) : null,
    login: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, userData, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 200) {
                set({ user: response.data });
                toast.success('Login successful!');
                // Store the token in cookies
                Cookie.set('user', JSON.stringify(response.data), { expires: 7 }); // Expires in 7 days
            } if (response.status === 401) {
                toast.error('Invalid credentials');
            } if (response.status === 403) {
                toast.error('Access denied');
            } if (response.status === 404) {
                toast.error('User not found');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error('An unexpected error occurred while logging in.');
            }
        }
    },
    logout: () => {
        set({ user: null });
        Cookie.remove('user');
        toast.success('Logout successful!');
    },
    register: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 201) {
                set({ user: response.data });
                toast.success('Registration successful!');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error('An unexpected error occurred while registering.');
            }
        }
    },
}));

export default useAuthStore;
