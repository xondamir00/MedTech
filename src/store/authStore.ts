import { create } from 'zustand';
import type{ AuthState, User } from '../types';

const defaultAdmin: User = {
  id: 'admin-1',
  email: 'admin@gmail.com',
  password: '12345678',
  role: 'admin',
  name: 'System Administrator',
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string): Promise<boolean> => {
    // Check default admin
    if (email === defaultAdmin.email && password === defaultAdmin.password) {
      set({ user: defaultAdmin, isAuthenticated: true });
      return true;
    }

    // Check other users from localStorage or users store
    const savedUsers = JSON.parse(localStorage.getItem('medtech-users') || '[]');
    const user = savedUsers.find((u: User) => u.email === email && u.password === password);
    
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }

    return false;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));