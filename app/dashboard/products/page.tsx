import { PageHeader } from "@/components/layout/page-header"
import { ProductTable } from "@/components/products/product-table"
import { ProductFilters } from "@/components/products/product-filters"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import Link from "next/link"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        description="Gestiona tu catálogo de productos y artículos de inventario"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button asChild>
              <Link href="/dashboard/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Producto
              </Link>
            </Button>
          </div>
        }
      />

      <ProductFilters />

      <ProductTable />
    </div>
  )
}
