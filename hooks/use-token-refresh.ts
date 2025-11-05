import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/store/auth'

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000 // 14 minutes

export function useTokenRefresh() {
  const refreshAuth = useAuthStore((state) => state.refreshAuth)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isAuthenticated) {
      intervalRef.current = setInterval(async () => {
        try {
          await refreshAuth()
        } catch (error) {
          console.error('Token refresh failed:', error)
        }
      }, TOKEN_REFRESH_INTERVAL)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [isAuthenticated, refreshAuth])
}
