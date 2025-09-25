import { create } from 'zustand';
import type { AuthState, User } from '../types';

export const useAuthStore = create<
  AuthState & { isLoading: boolean; fetchMe: () => Promise<void> }
>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  isLoading: true,

  login: async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(
        'https://supercultivated-neumic-rose.ngrok-free.dev/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) return false;

      const data = await res.json();
      console.log('LOGIN RESPONSE:', data);

      localStorage.setItem('token', data.access_token);

      set({
        user: {
          ...data.user,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        } as User,
        isAuthenticated: true,
        token: data.access_token,
        isLoading: false,
      });

      return true;
    } catch (err) {
      console.error('Login error:', err);
      set({ isLoading: false });
      return false;
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('token');
    console.log('FETCH ME TOKEN:', token);
    
    if (!token) {
     return set({ isLoading: false });
      
    }

    try {
      const resp = await fetch(
        'https://supercultivated-neumic-rose.ngrok-free.dev/auth/me',
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      
      

      if (!resp.ok) {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          isLoading: false,
        });
        return;
      }

      const data = await resp.json();
      console.log('FETCH ME DATA:', data);

      set({
        user: {
          ...data,
          firstName: data.firstName,
          lastName: data.lastName,
        } as User,
        isAuthenticated: true,
        token,
        isLoading: false,
      });
      console.log('User set in store:', get().user);
      
    } catch (err) {
      console.error('Fetch me error:', err);
      set({ isLoading: false });
    }
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    const token = get().token || localStorage.getItem('token');
    if (!token) return false;

    try {
      const res = await fetch(
        'https://supercultivated-neumic-rose.ngrok-free.dev/auth/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      return res.ok;
    } catch (err) {
      console.error('Change password error:', err);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      isAuthenticated: false,
      token: null,
      isLoading: false,
    });
  },
}));
