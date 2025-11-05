import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PurchaseOrderTable } from "@/components/purchasing/purchase-order-table"
import { SupplierTable } from "@/components/purchasing/supplier-table"
import { InvoiceTable } from "@/components/purchasing/invoice-table"

export default function PurchasingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Purchasing" description="Manage purchase orders, suppliers, and invoices" />

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Purchase Orders</h2>
              <p className="text-sm text-muted-foreground">Create and manage purchase orders</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/purchasing/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                New Purchase Order
              </Link>
            </Button>
          </div>
          <PurchaseOrderTable />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Suppliers</h2>
              <p className="text-sm text-muted-foreground">Manage supplier information</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/purchasing/suppliers/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Link>
            </Button>
          </div>
          <SupplierTable />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Purchase Invoices</h2>
              <p className="text-sm text-muted-foreground">Track and manage purchase invoices</p>
            </div>
          </div>
          <InvoiceTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
