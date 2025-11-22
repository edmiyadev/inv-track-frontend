"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { USER_ROLES } from "@/lib/constants"
import { userFormSchema, type UserFormData } from "@/lib/validations"
import { Loader2, Eye, EyeOff, Shield, User, Mail, Lock } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth"
import { usersApi } from "@/lib/api/users"

interface UserFormProps {
  mode: "create" | "edit"
  userId?: number
  defaultValues?: Partial<UserFormData>
}

export function UserForm({ mode, userId, defaultValues }: UserFormProps) {
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.accessToken)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      status: "active",
      role: "viewer",
      ...defaultValues,
    },
  })

  const status = watch("status")
  const selectedRole = watch("role")

  const handleFormSubmit = async (data: UserFormData) => {
    if (!accessToken) return

    setIsSubmitting(true)
    try {
      if (mode === "create") {
        await usersApi.create(data, accessToken)
      } else {
        if (!userId) return

        // Remove password fields if they are empty
        const updateData = { ...data }
        if (!updateData.password) {
          delete updateData.password
          delete updateData.password_confirmation
        }

        await usersApi.update(userId, updateData, accessToken)
      }
      router.push("/users")
      router.refresh()
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Hubo un error al guardar el usuario. Por favor intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleDescription = (role: string) => {
    const descriptions = {
      admin: "Acceso total al sistema, incluyendo gestión de usuarios y configuraciones.",
      manager: "Gestionar productos, inventario y ver reportes. No puede gestionar usuarios.",
      staff: "Actualizar inventario y procesar órdenes. Acceso limitado a configuraciones.",
      viewer: "Acceso de solo lectura a datos de inventario. No puede realizar cambios.",
    }
    return descriptions[role as keyof typeof descriptions] || ""
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
          <CardDescription>Ingrese los detalles del usuario y asigne el rol apropiado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="mr-1 inline h-4 w-4" />
                Nombre Completo <span className="text-destructive">*</span>
              </Label>
              <Input id="name" placeholder="Ingrese nombre completo" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">
                <User className="mr-1 inline h-4 w-4" />
                Nombre de Usuario <span className="text-destructive">*</span>
              </Label>
              <Input id="username" placeholder="Ingrese nombre de usuario" {...register("username")} />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mr-1 inline h-4 w-4" />
                Correo Electrónico <span className="text-destructive">*</span>
              </Label>
              <Input id="email" type="email" placeholder="usuario@ejemplo.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              <Lock className="mr-1 inline h-4 w-4" />
              Contraseña {mode === 'edit' && <span className="text-muted-foreground font-normal">(Dejar en blanco para mantener actual)</span>} {mode === 'create' && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={mode === 'create' ? "Ingrese contraseña segura" : "Nueva contraseña (opcional)"}
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            <p className="text-xs text-muted-foreground">
              Debe tener al menos 8 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">
              <Lock className="mr-1 inline h-4 w-4" />
              Confirmar Contraseña {mode === 'create' && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="Confirme la contraseña"
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="status">Estado de la Cuenta</Label>
              <p className="text-sm text-muted-foreground">
                {status === "active" ? "El usuario puede acceder al sistema" : "El usuario está suspendido"}
              </p>
            </div>
            <Switch
              id="status"
              checked={status === "active"}
              onCheckedChange={(checked) => setValue("status", checked ? "active" : "suspended")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="mr-2 inline h-5 w-5" />
            Rol y Permisos
          </CardTitle>
          <CardDescription>Asigne un rol para determinar el nivel de acceso del usuario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">
              Rol de Usuario <span className="text-destructive">*</span>
            </Label>
            <Select
              defaultValue={defaultValues?.role || "viewer"}
              onValueChange={(value) => setValue("role", value as any)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Seleccione un rol" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="mb-2 text-sm font-medium">
              Rol Seleccionado: {USER_ROLES.find((r) => r.value === selectedRole)?.label}
            </p>
            <p className="text-sm text-muted-foreground">{getRoleDescription(selectedRole)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Crear Usuario" : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  )
}

