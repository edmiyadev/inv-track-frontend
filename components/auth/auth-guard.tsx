'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'

const PUBLIC_ROUTES = ['/login']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, checkAuth, _hasHydrated } = useAuthStore()

  useEffect(() => {
    // Solo ejecutar checkAuth después de que Zustand haya hidratado desde localStorage
    if (_hasHydrated) {
      checkAuth()
    }
  }, [checkAuth, _hasHydrated])

  useEffect(() => {
    // Solo hacer redirects después de la hidratación y cuando no esté cargando
    if (_hasHydrated && !isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
      )

      if (!isAuthenticated && !isPublicRoute) {
        router.push('/login')
      } else if (isAuthenticated && isPublicRoute) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, _hasHydrated])

  // Mostrar loading mientras hidrata o está cargando
  if (!_hasHydrated || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
