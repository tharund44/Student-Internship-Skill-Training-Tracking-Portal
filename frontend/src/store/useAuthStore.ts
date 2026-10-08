import { create } from 'zustand';
import api from '../utils/axios';

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: true,

  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const { accessToken, user } = res.data.data;
    localStorage.setItem('token', accessToken);
    set({ token: accessToken, user });
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data);
    const { accessToken, user } = res.data.data;
    // Don't auto-login if pending
    if (user.role === 'ORGANIZATION') {
        // Just return, handled in UI
        return;
    }
    localStorage.setItem('token', accessToken);
    set({ token: accessToken, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.data, loading: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ token: null, user: null, loading: false });
    }
  },
}));
