import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { refreshToken } from '../api/auth';
import { authFetch } from '../api/auth.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useAuthStore = create(
    persist(
        (set, get) => ({
            tokens: null,
            currentUser: null,
            refreshing: false,

            setTokens: (tokens) => {
                if (tokens?.access && tokens?.refresh) {
                    set({ tokens });
                } else {
                    console.error('Invalid tokens');
                }
            },

            setCurrentUser: (user) => set({ currentUser: user }),

            refreshTokens: async () => {
                if (get().refreshing) return;

                set({ refreshing: true });
                try {
                    const tokens = get().tokens;
                    if (!tokens?.refresh) throw new Error('No refresh token available');

                    const newTokens = await refreshToken(tokens.refresh);
                    set({ tokens: newTokens });
                    return newTokens;
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    set({ tokens: null });
                    localStorage.removeItem('tokens');
                } finally {
                    set({ refreshing: false });
                }
            },

            fetchCurrentUser: async () => {
                const tokens = get().tokens;
                if (!tokens?.access) {
                    console.error('No access token available');
                    return;
                }

                try {
                    const response = await authFetch(`${BASE_URL}/api/user/current/`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${tokens.access}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const user = await response.json();
                        set({ currentUser: user });
                    } else if (response.status === 401) {
                        console.log('Access token expired or invalid. Refreshing...');
                        const newTokens = await get().refreshTokens();
                        if (newTokens) {
                            get().fetchCurrentUser();
                        }
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            },

            getUserId: () => {
                const currentUser = get().currentUser;
                return currentUser?.id || null;
            },

            clearTokens: () => {
                set({ tokens: null, currentUser: null });
                localStorage.removeItem('tokens');
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

export default useAuthStore;