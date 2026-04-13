import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { SupplierTable } from "@/components/suppliers/supplier-table"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CanAccess } from "@/components/auth/can-access"

export default function SuppliersPage() {
  return (
    <ProtectedRoute action="view" subject="Supplier" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Proveedores"
          description="Gestiona los proveedores de tu inventario"
          actions={
            <CanAccess action="create" subject="Supplier">
              <Button asChild>
                <Link href="/suppliers/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Proveedor
                </Link>
              </Button>
            </CanAccess>
          }
        />

        <SupplierTable />
      </div>
    </ProtectedRoute>
  )
}
