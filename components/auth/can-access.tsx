"use client"

import { ReactNode } from 'react'
import { isAdmin, useAbility } from '@/lib/casl'
import type { Actions, Subjects } from '@/lib/casl'
import { useAuthStore } from '@/lib/store/auth'

interface CanAccessProps {
  action: Actions
  subject: Subjects
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Componente que muestra contenido solo si el usuario tiene el permiso
 * 
 * @example
 * <CanAccess action="create" subject="Product">
 *   <Button>Crear Producto</Button>
 * </CanAccess>
 */
export function CanAccess({ action, subject, children, fallback = null }: CanAccessProps) {
  const ability = useAbility()
  const user = useAuthStore((state) => state.user)

  if (isAdmin(user)) {
    return <>{children}</>;
  }

  if (ability.can(action, subject)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

/**
 * Hook para verificar permisos programáticamente
 * 
 * @example
 * const canCreate = usePermission('create', 'Product')
 * if (canCreate) {
 *   // hacer algo
 * }
 */
export function usePermission(action: Actions, subject: Subjects): boolean {
  const ability = useAbility()
  if (action === 'view') {
    return ability.can('view', subject) || ability.can('viewAny', subject)
  }
  return ability.can(action, subject)
}
