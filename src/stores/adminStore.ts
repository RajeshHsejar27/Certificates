import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAdmin: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: async (password: string) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-auth`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: JSON.stringify({ password }),
            }
          );
          const data = await res.json();
          if (data.success) {
            set({ isAdmin: true });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'admin-session',
    }
  )
);
