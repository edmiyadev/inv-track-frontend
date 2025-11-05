import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesOrderTable } from "@/components/sales/sales-order-table"
import { CustomerTable } from "@/components/sales/customer-table"
import { SalesInvoiceTable } from "@/components/sales/sales-invoice-table"

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Sales" description="Manage sales orders, customers, and invoices" />

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Sales Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Sales Orders</h2>
              <p className="text-sm text-muted-foreground">Create and manage sales orders</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/sales/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                New Sales Order
              </Link>
            </Button>
          </div>
          <SalesOrderTable />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Customers</h2>
              <p className="text-sm text-muted-foreground">Manage customer information</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/sales/customers/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Link>
            </Button>
          </div>
          <CustomerTable />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Sales Invoices</h2>
              <p className="text-sm text-muted-foreground">Track and manage sales invoices</p>
            </div>
          </div>
          <SalesInvoiceTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
