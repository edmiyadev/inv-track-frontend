import { PageHeader } from "@/components/layout/page-header"
import { CategoryForm } from "@/components/categories/category-form"

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nueva Categoría"
        description="Crea una nueva categoría de productos"
      />
      <CategoryForm />
    </div>
  )
}
