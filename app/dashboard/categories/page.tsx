import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { CategoryTable } from "@/components/categories/category-table"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categorías de Productos"
        description="Gestiona las categorías de tus productos"
        actions={
          <Button asChild>
            <Link href="/dashboard/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoría
            </Link>
          </Button>
        }
      />

      <CategoryTable />
    </div>
  )
}
