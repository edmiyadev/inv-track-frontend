"use client"

import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { usePermission } from '@/components/auth/can-access'
import type { Actions, Subjects } from '@/lib/casl'

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
  
  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>
    }
    redirect(redirectTo)
  }
  
  return <>{children}</>
}
