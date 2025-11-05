"use client"

import { PageHeader } from "@/components/layout/page-header"
import { RoleForm } from "@/components/roles/role-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditRolePage({ params }: { params: { id: string } }) {
  // Mock data - in real app, fetch from API
  const mockRole = {
    name: "Warehouse Manager",
    description: "Manage warehouse operations and stock transfers",
    permissions: {
      dashboard: { view: true },
      products: { view: true, create: false, edit: true, delete: false, export: true },
      inventory: { view: true, adjust: true, transfer: true, viewHistory: true },
      purchasing: {
        viewOrders: true,
        createOrders: false,
        editOrders: true,
        deleteOrders: false,
        approveOrders: false,
        viewSuppliers: true,
        manageSuppliers: false,
        viewInvoices: true,
        manageInvoices: false,
      },
      sales: {
        viewOrders: true,
        createOrders: false,
        editOrders: true,
        deleteOrders: false,
        viewCustomers: true,
        manageCustomers: false,
        viewInvoices: true,
        manageInvoices: false,
        manageShipments: false,
      },
      users: { view: false, create: false, edit: false, delete: false, manageRoles: false },
      settings: { view: true, edit: false },
      reports: { view: true, export: true },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <PageHeader title="Edit Role" description="Modify role permissions and settings" />
      </div>

      <RoleForm
        mode="edit"
        defaultValues={mockRole}
        onSubmit={async (data) => {
          console.log("[v0] Updating role:", data)
          // Handle role update
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }}
      />
    </div>
  )
}
