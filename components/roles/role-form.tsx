"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { roleFormSchema, type RoleFormData } from "@/lib/validations"
import {
  Loader2,
  Shield,
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  Settings,
  FileText,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"

interface RoleFormProps {
  mode: "create" | "edit"
  defaultValues?: Partial<RoleFormData>
  onSubmit?: (data: RoleFormData) => Promise<void>
}

const permissionModules = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permissions: [{ key: "view", label: "View Dashboard" }],
  },
  {
    key: "products",
    label: "Products",
    icon: Package,
    permissions: [
      { key: "view", label: "View Products" },
      { key: "create", label: "Create Products" },
      { key: "edit", label: "Edit Products" },
      { key: "delete", label: "Delete Products" },
      { key: "export", label: "Export Products" },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: Warehouse,
    permissions: [
      { key: "view", label: "View Inventory" },
      { key: "adjust", label: "Adjust Stock Levels" },
      { key: "transfer", label: "Transfer Stock" },
      { key: "viewHistory", label: "View Stock History" },
    ],
  },
  {
    key: "purchasing",
    label: "Purchasing",
    icon: ShoppingCart,
    permissions: [
      { key: "viewOrders", label: "View Purchase Orders" },
      { key: "createOrders", label: "Create Purchase Orders" },
      { key: "editOrders", label: "Edit Purchase Orders" },
      { key: "deleteOrders", label: "Delete Purchase Orders" },
      { key: "approveOrders", label: "Approve Purchase Orders" },
      { key: "viewSuppliers", label: "View Suppliers" },
      { key: "manageSuppliers", label: "Manage Suppliers" },
      { key: "viewInvoices", label: "View Purchase Invoices" },
      { key: "manageInvoices", label: "Manage Purchase Invoices" },
    ],
  },
  {
    key: "sales",
    label: "Sales",
    icon: TrendingUp,
    permissions: [
      { key: "viewOrders", label: "View Sales Orders" },
      { key: "createOrders", label: "Create Sales Orders" },
      { key: "editOrders", label: "Edit Sales Orders" },
      { key: "deleteOrders", label: "Delete Sales Orders" },
      { key: "viewCustomers", label: "View Customers" },
      { key: "manageCustomers", label: "Manage Customers" },
      { key: "viewInvoices", label: "View Sales Invoices" },
      { key: "manageInvoices", label: "Manage Sales Invoices" },
      { key: "manageShipments", label: "Manage Shipments" },
    ],
  },
  {
    key: "users",
    label: "Users",
    icon: Users,
    permissions: [
      { key: "view", label: "View Users" },
      { key: "create", label: "Create Users" },
      { key: "edit", label: "Edit Users" },
      { key: "delete", label: "Delete Users" },
      { key: "manageRoles", label: "Manage Roles" },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    permissions: [
      { key: "view", label: "View Settings" },
      { key: "edit", label: "Edit Settings" },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    icon: FileText,
    permissions: [
      { key: "view", label: "View Reports" },
      { key: "export", label: "Export Reports" },
    ],
  },
]

export function RoleForm({ mode, defaultValues, onSubmit }: RoleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: defaultValues || {
      permissions: {
        dashboard: { view: false },
        products: { view: false, create: false, edit: false, delete: false, export: false },
        inventory: { view: false, adjust: false, transfer: false, viewHistory: false },
        purchasing: {
          viewOrders: false,
          createOrders: false,
          editOrders: false,
          deleteOrders: false,
          approveOrders: false,
          viewSuppliers: false,
          manageSuppliers: false,
          viewInvoices: false,
          manageInvoices: false,
        },
        sales: {
          viewOrders: false,
          createOrders: false,
          editOrders: false,
          deleteOrders: false,
          viewCustomers: false,
          manageCustomers: false,
          viewInvoices: false,
          manageInvoices: false,
          manageShipments: false,
        },
        users: { view: false, create: false, edit: false, delete: false, manageRoles: false },
        settings: { view: false, edit: false },
        reports: { view: false, export: false },
      },
    },
  })

  const permissions = watch("permissions")

  const handleFormSubmit = async (data: RoleFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit?.(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSelectAll = (moduleKey: string) => {
    const module = permissionModules.find((m) => m.key === moduleKey)
    if (!module) return

    const allChecked = module.permissions.every(
      (p) => permissions[moduleKey as keyof typeof permissions]?.[p.key as keyof any],
    )

    module.permissions.forEach((p) => {
      setValue(`permissions.${moduleKey}.${p.key}` as any, !allChecked)
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="mr-2 inline h-5 w-5" />
            Role Information
          </CardTitle>
          <CardDescription>Define the role name and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Role Name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" placeholder="e.g., Warehouse Manager" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and responsibilities of this role"
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>Select the permissions for this role by module</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {permissionModules.map((module) => {
            const Icon = module.icon
            const modulePermissions = permissions[module.key as keyof typeof permissions] as any
            const allChecked = module.permissions.every((p) => modulePermissions?.[p.key])

            return (
              <div key={module.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <h4 className="font-medium">{module.label}</h4>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAll(module.key)}
                    className="h-8 text-xs"
                  >
                    {allChecked ? "Deselect All" : "Select All"}
                  </Button>
                </div>

                <div className="ml-7 space-y-2 rounded-lg border border-border p-4">
                  {module.permissions.map((permission) => (
                    <div key={permission.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${module.key}-${permission.key}`}
                        checked={modulePermissions?.[permission.key] || false}
                        onCheckedChange={(checked) =>
                          setValue(`permissions.${module.key}.${permission.key}` as any, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`${module.key}-${permission.key}`}
                        className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Role" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
