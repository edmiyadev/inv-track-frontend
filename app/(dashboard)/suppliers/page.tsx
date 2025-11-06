import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { SupplierTable } from "@/components/suppliers/supplier-table"

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Proveedores"
        description="Gestiona los proveedores de tu inventario"
        actions={
          <Button asChild>
            <Link href="/suppliers/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proveedor
            </Link>
          </Button>
        }
      />

      <SupplierTable />
    </div>
  )
}
