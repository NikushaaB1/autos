import { create } from 'zustand';

interface AuthState {
  email: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AUTH_STORAGE_KEY = 'ts_auto_auth_session';

// Check if user has an active session
const getInitialState = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) {
        return { email: parsed.email, isAuthenticated: true };
      }
    }
  } catch (e) {
    console.error('Failed to parse auth session', e);
  }
  return { email: null, isAuthenticated: false };
};

const initialState = getInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  email: initialState.email,
  isAuthenticated: initialState.isAuthenticated,
  error: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    
    // Simulate brief loading delay for professional feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Hardcoded credentials as per instructions (no .env)
    if (email.trim().toLowerCase() === 'admints@gmail.com' && password === 'admints12!') {
      const session = { email: email.trim().toLowerCase() };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      set({ email: session.email, isAuthenticated: true, isLoading: false, error: null });
      return true;
    } else {
      set({ error: 'ელფოსტა ან პაროლი არასწორია', isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({ email: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));
