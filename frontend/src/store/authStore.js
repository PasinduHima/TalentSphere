import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../lib/api/auth';
import { tokenStorage } from '../lib/tokenStorage';
import { toFrontendRole } from '../lib/roleMap';
import { ROLE_LABELS } from '../lib/constants';

function mapUser(dto) {
  const role = toFrontendRole(dto.role);
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    name: `${dto.firstName} ${dto.lastName}`.trim(),
    role,
    roleLabel: ROLE_LABELS[role],
    avatar: dto.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dto.firstName + ' ' + dto.lastName)}&background=random`,
    departmentId: dto.departmentId,
    departmentName: dto.departmentName,
    status: dto.status,
    createdAt: dto.createdAt,
    lastLoginAt: dto.lastLoginAt,
  };
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(email, password);
          tokenStorage.setTokens(data.accessToken, data.refreshToken);
          set({ user: mapUser(data.user), isAuthenticated: true, isLoading: false });
          return mapUser(data.user);
        } catch (err) {
          set({ isLoading: false, error: err?.response?.data?.title || 'Invalid email or password.' });
          throw err;
        }
      },

      registerCandidate: async ({ email, password, firstName, lastName }) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.register({ email, password, firstName, lastName });
          tokenStorage.setTokens(data.accessToken, data.refreshToken);
          set({ user: mapUser(data.user), isAuthenticated: true, isLoading: false });
          return mapUser(data.user);
        } catch (err) {
          set({ isLoading: false, error: err?.response?.data?.title || 'Could not create your account.' });
          throw err;
        }
      },

      logout: () => {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          authApi.logout(refreshToken).catch(() => {});
        }
        tokenStorage.clear();
        set({ user: null, isAuthenticated: false, error: null });
      },

      refreshCurrentUser: async () => {
        if (!tokenStorage.getAccessToken()) return null;
        try {
          const dto = await authApi.me();
          const mapped = mapUser(dto);
          set({ user: mapped, isAuthenticated: true });
          return mapped;
        } catch {
          return get().user;
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
