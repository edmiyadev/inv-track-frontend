"use client"

import { useAuthStore } from "@/lib/store/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Key } from "lucide-react"

/**
 * Componente de debug para mostrar roles y permisos del usuario actual
 * Útil durante desarrollo
 */
export function UserPermissionsDebug() {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permisos de Usuario
          </CardTitle>
          <CardDescription>No hay usuario autenticado</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permisos de {user.name}
        </CardTitle>
        <CardDescription>Roles y permisos del usuario actual</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Roles */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map((role) => (
                <Badge key={role.id} variant="secondary">
                  {role.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin roles asignados</p>
            )}
          </div>
        </div>

        {/* Permisos */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Permisos
          </h3>
          <div className="space-y-4">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map((role) => (
                <div key={role.id} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Permisos de {role.name}:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((permission) => (
                        <Badge key={permission.id} variant="outline" className="text-xs font-mono">
                          {permission.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">Sin permisos</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sin permisos asignados</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
