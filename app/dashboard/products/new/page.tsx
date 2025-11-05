import { PageHeader } from "@/components/layout/page-header"
import { ProductForm } from "@/components/products/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create Product" description="Add a new product to your inventory" />

      <ProductForm mode="create" />
    </div>
  )
}
