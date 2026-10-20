import { create } from 'zustand';

interface AuthUser {
    id: string;
}

interface AuthState {
    user: AuthUser | null;
    setUser: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: {id: 'minji'},
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
