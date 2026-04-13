import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { CustomerTable } from "@/components/sales/customer-table"
import { CanAccess } from "@/components/auth/can-access"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CustomersPage() {
  return (
    <ProtectedRoute action="view" subject="Customer" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Clientes"
          description="Gestiona los clientes de tu inventario"
          actions={
            <CanAccess action="create" subject="Customer">
              <Button asChild>
                <Link href="/customers/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Cliente
                </Link>
              </Button>
            </CanAccess>
          }
        />

        <CustomerTable />
      </div>
    </ProtectedRoute>
  )
}
