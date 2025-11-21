/**
 * Hook personalizado para filtrar items de navegación basado en permisos
 * Optimiza el rendimiento al filtrar antes de renderizar
 */
import { useAbility } from '@/lib/casl'
import { isAdmin, type Subjects } from '@/lib/casl/ability'
import { useAuthStore } from '@/lib/store/auth'

interface NavigationItem {
  name: string
  href: string
  icon: any
  permission: Subjects
}

interface NavigationGroup {
  name: string
  icon?: any
  isCollapsible?: boolean // Indica si el grupo debe renderizarse siempre como colapsable
  items: NavigationItem[]
}

/**
 * Filtra los grupos de navegación basándose en los permisos del usuario
 * Solo retorna items y grupos que el usuario puede ver
 */
export function useFilteredNavigation(groups: NavigationGroup[]): NavigationGroup[] {
  const ability = useAbility()
  const user = useAuthStore((state) => state.user)
    
    if (isAdmin(user)) {
      return groups;
    }
  
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => 
        ability.can('view', item.permission)
      ),
    }))
    .filter((group) => group.items.length > 0) // Eliminar grupos vacíos
}
