import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authApi } from '@/lib/api/auth'
import type { User, LoginCredentials } from '@/lib/api/types'

interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  _hasHydrated: boolean

  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
  setHasHydrated: (hasHydrated: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (hasHydrated: boolean) => {
        set({ _hasHydrated: hasHydrated })
      },

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authApi.login(credentials)          
          const userWithPermissions = await authApi.getProfile(response.data.access_token)
          
          set({
            user: userWithPermissions,
            accessToken: response.data.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          })
          throw error
        }
      },

      logout: async () => {
        const { accessToken } = get()
        
        try {
          if (accessToken) {
            await authApi.logout(accessToken)
          }
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      checkAuth: async () => {
        const { accessToken, user } = get()
        
        if (!accessToken) {
          set({ isAuthenticated: false, isLoading: false })
          return
        }

        try {
          // Si no tenemos usuario cargado, mostramos loading.
          // Si ya tenemos usuario (persistido), verificamos en "segundo plano" sin bloquear la UI
          if (!user) {
            set({ isLoading: true })
          }

          const userData = await authApi.getProfile(accessToken)
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          console.warn('Check auth failed, clearing session:', error)
          // En caso de error (token inválido, usuario borrado), limpiar la sesión
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
