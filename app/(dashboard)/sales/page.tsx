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
      <PageHeader title="Ventas" description="Gestiona órdenes de venta, clientes y facturas" />

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Órdenes de Venta</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Órdenes de Venta</h2>
              <p className="text-sm text-muted-foreground">Crea y gestiona órdenes de venta</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/sales/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Orden de Venta
              </Link>
            </Button>
          </div>
          <SalesOrderTable />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Clientes</h2>
              <p className="text-sm text-muted-foreground">Gestiona información de clientes</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/sales/customers/new">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </Link>
            </Button>
          </div>
          <CustomerTable />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Facturas de Venta</h2>
              <p className="text-sm text-muted-foreground">Rastrea y gestiona facturas de venta</p>
            </div>
          </div>
          <SalesInvoiceTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
