"use client"

import { useState } from "react"
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

interface UserFormProps {
  mode: "create" | "edit"
  defaultValues?: Partial<UserFormData>
  onSubmit?: (data: UserFormData) => Promise<void>
}

export function UserForm({ mode, defaultValues, onSubmit }: UserFormProps) {
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
    setIsSubmitting(true)
    try {
      await onSubmit?.(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleDescription = (role: string) => {
    const descriptions = {
      admin: "Full system access including user management and system settings",
      manager: "Manage products, inventory, and view reports. Cannot manage users.",
      staff: "Update inventory and process orders. Limited access to settings.",
      viewer: "Read-only access to inventory data. Cannot make changes.",
    }
    return descriptions[role as keyof typeof descriptions] || ""
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Enter the user details and assign appropriate role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="mr-1 inline h-4 w-4" />
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input id="name" placeholder="Enter full name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mr-1 inline h-4 w-4" />
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input id="email" type="email" placeholder="user@inventory.com" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="password">
                <Lock className="mr-1 inline h-4 w-4" />
                Password <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter secure password"
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
                Must be at least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="status">Account Status</Label>
              <p className="text-sm text-muted-foreground">
                {status === "active" ? "User can access the system" : "User is suspended"}
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
            Role & Permissions
          </CardTitle>
          <CardDescription>Assign a role to determine user access level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">
              User Role <span className="text-destructive">*</span>
            </Label>
            <Select
              defaultValue={defaultValues?.role || "viewer"}
              onValueChange={(value) => setValue("role", value as any)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
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
              Selected Role: {USER_ROLES.find((r) => r.value === selectedRole)?.label}
            </p>
            <p className="text-sm text-muted-foreground">{getRoleDescription(selectedRole)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create User" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
