"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Shield, Save } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth"
import { rolesApi } from "@/lib/api/roles"
import { permissionsApi } from "@/lib/api/permissions"
import { Permission } from "@/lib/api/types"

const roleFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  permissions: z.array(z.string()).min(1, "Debe seleccionar al menos un permiso"),
})

type RoleFormData = z.infer<typeof roleFormSchema>

interface RoleFormProps {
  mode: "create" | "edit"
  roleId?: number
  defaultValues?: Partial<RoleFormData>
}

export function RoleForm({ mode, roleId, defaultValues }: RoleFormProps) {
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch permissions
  const { data: permissionsData, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => permissionsApi.getAll(accessToken!),
    enabled: !!accessToken,
  })

  const permissions = permissionsData?.data || []

  // Group permissions by resource (e.g., "products", "users")
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const [resource] = permission.name.split(".")
    if (!acc[resource]) {
      acc[resource] = []
    }
    acc[resource].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      permissions: [],
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name || "",
        permissions: defaultValues.permissions || [],
      })
    }
  }, [defaultValues, reset])

  const selectedPermissions = watch("permissions")

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    if (checked) {
      setValue("permissions", [...selectedPermissions, permissionName])
    } else {
      setValue(
        "permissions",
        selectedPermissions.filter((p) => p !== permissionName)
      )
    }
  }

  const handleSelectAllGroup = (resource: string, checked: boolean) => {
    const groupPermissions = groupedPermissions[resource].map((p) => p.name)
    if (checked) {
      const newPermissions = Array.from(new Set([...selectedPermissions, ...groupPermissions]))
      setValue("permissions", newPermissions)
    } else {
      setValue(
        "permissions",
        selectedPermissions.filter((p) => !groupPermissions.includes(p))
      )
    }
  }

  const handleFormSubmit = async (data: RoleFormData) => {
    if (!accessToken) return

    setIsSubmitting(true)
    try {
      if (mode === "create") {
        await rolesApi.create(data, accessToken)
      } else {
        if (!roleId) return
        await rolesApi.update(roleId, data, accessToken)
      }
      router.push("/roles")
      router.refresh()
    } catch (error) {
      console.error("Error saving role:", error)
      alert("Hubo un error al guardar el rol. Por favor intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingPermissions) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Rol</CardTitle>
          <CardDescription>Defina el nombre del rol y sus permisos asociados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre del Rol <span className="text-destructive">*</span>
            </Label>
            <Input id="name" placeholder="Ej: Encargado de Inventario" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="mr-2 inline h-5 w-5" />
            Permisos del Sistema
          </CardTitle>
          <CardDescription>Seleccione los permisos que tendrá este rol</CardDescription>
        </CardHeader>
        <CardContent>
          {errors.permissions && (
            <p className="mb-4 text-sm text-destructive">{errors.permissions.message}</p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedPermissions).map(([resource, groupPermissions]) => {
              const allGroupSelected = groupPermissions.every((p) => selectedPermissions.includes(p.name))

              return (
                <div key={resource} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2 border-b pb-2">
                    <Checkbox
                      id={`group-${resource}`}
                      checked={allGroupSelected}
                      onCheckedChange={(checked) => handleSelectAllGroup(resource, checked as boolean)}
                    />
                    <Label htmlFor={`group-${resource}`} className="font-semibold capitalize cursor-pointer">
                      {resource.replace("_", " ")}
                    </Label>
                  </div>
                  <div className="space-y-2">
                    {groupPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center gap-2">
                        <Checkbox
                          id={permission.name}
                          checked={selectedPermissions.includes(permission.name)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.name, checked as boolean)}
                        />
                        <Label htmlFor={permission.name} className="text-sm font-normal cursor-pointer">
                          {permission.name.split(".")[1] || permission.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          {mode === "create" ? "Crear Rol" : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  )
}
