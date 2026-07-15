import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ROLES } from '../lib/constants';

// Mock user for initial development
const MOCK_USER = {
  id: '1',
  name: 'Sarah Jenkins',
  email: 'sarah.j@example.com',
  role: ROLES.CANDIDATE,
  avatar: 'https://i.pravatar.cc/150?u=sarah',
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Initially null, set to MOCK_USER if you want auto-login for dev
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Mock authentication logic based on email to switch roles easily during dev
        let role = ROLES.CANDIDATE;
        if (email.includes('recruiter')) role = ROLES.RECRUITER;
        if (email.includes('hm') || email.includes('manager')) role = ROLES.HIRING_MANAGER;
        if (email.includes('admin')) role = ROLES.ADMIN;

        set({
          user: { ...MOCK_USER, email, role },
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
