"use client"

import { use } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { CategoryForm } from "@/components/categories/category-form"

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Editar Categoría"
        description="Actualiza la información de la categoría"
      />
      <CategoryForm categoryId={parseInt(resolvedParams.id)} />
    </div>
  )
}
