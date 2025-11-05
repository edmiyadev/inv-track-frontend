import { PageHeader } from "@/components/layout/page-header"
import { ProductForm } from "@/components/products/product-form"

export default function EditProductPage({ params }: { params: { id: string } }) {
  // Mock data - would fetch from API/database
  const product = {
    name: "Wireless Mouse",
    sku: "MSE-001",
    category: "electronics",
    price: 29.99,
    stock: 145,
    reorderPoint: 20,
    description: "High-precision wireless mouse with ergonomic design and long battery life.",
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Product" description={`Editing: ${product.name}`} />

      <ProductForm mode="edit" defaultValues={product} />
    </div>
  )
}
