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
      <PageHeader title="Compras" description="Gestiona órdenes de compra, proveedores y facturas" />

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Órdenes de Compra</TabsTrigger>
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Órdenes de Compra</h2>
              <p className="text-sm text-muted-foreground">Crea y gestiona órdenes de compra</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/purchasing/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Orden de Compra
              </Link>
            </Button>
          </div>
          <PurchaseOrderTable />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Proveedores</h2>
              <p className="text-sm text-muted-foreground">Gestiona información de proveedores</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/purchasing/suppliers/new">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Proveedor
              </Link>
            </Button>
          </div>
          <SupplierTable />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Facturas de Compra</h2>
              <p className="text-sm text-muted-foreground">Rastrea y gestiona facturas de compra</p>
            </div>
          </div>
          <InvoiceTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
