"use client"

import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { usePermission } from '@/components/auth/can-access'
import { isAdmin, type Actions, type Subjects } from '@/lib/casl'
import { useAuthStore } from '@/lib/store/auth'

interface ProtectedRouteProps {
  action: Actions
  subject: Subjects
  children: ReactNode
  redirectTo?: string
  fallback?: ReactNode
}

/**
 * Componente para proteger rutas completas basado en permisos
 * 
 * @example
 * // En una página:
 * export default function ProductsPage() {
 *   return (
 *     <ProtectedRoute action="read" subject="Product" redirectTo="/unauthorized">
 *       <ProductList />
 *     </ProtectedRoute>
 *   )
 * }
 */
export function ProtectedRoute({
  action,
  subject,
  children,
  redirectTo = '/dashboard',
  fallback
}: ProtectedRouteProps) {
  const hasPermission = usePermission(action, subject)
  const user = useAuthStore((state) => state.user)

  if (isAdmin(user)) {
    return <>{children}</>
  }

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>
    }
    redirect(redirectTo)
  }

  return <>{children}</>
}
