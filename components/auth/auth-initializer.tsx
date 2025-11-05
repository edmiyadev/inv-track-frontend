'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAuth()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [checkAuth])

  return <>{children}</>
}
