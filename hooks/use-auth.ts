import { useAuthStore } from '@/lib/store/auth'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()
  const store = useAuthStore()

  const handleLogout = async () => {
    await store.logout()
    router.push('/login')
  }

  return {
    user: store.user,
    accessToken: store.accessToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    logout: handleLogout,
    checkAuth: store.checkAuth,
    clearError: store.clearError,
  }
}
