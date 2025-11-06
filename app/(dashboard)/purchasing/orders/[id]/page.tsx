import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, FileText, Truck } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  // Mock data - in real app, fetch based on params.id
  const order = {
    id: params.id,
    poNumber: "PO-2024-001",
    supplierName: "Global Tech Supplies",
    orderDate: new Date("2024-03-15"),
    expectedDeliveryDate: new Date("2024-03-25"),
    status: "approved",
    items: [
      { id: "1", productName: "Wireless Mouse", sku: "WM-001", quantity: 50, unitPrice: 29.99, total: 1499.5 },
      { id: "2", productName: "USB-C Cable", sku: "UC-002", quantity: 100, unitPrice: 12.99, total: 1299 },
    ],
    subtotal: 2798.5,
    tax: 279.85,
    total: 3078.35,
    notes: "Urgent order - please expedite shipping",
    createdBy: "Admin User",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={order.poNumber}
        description={`Purchase order for ${order.supplierName}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/purchasing/orders/${params.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Invoice
            </Button>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Receive Goods
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">PO Number:</span>
              <span className="font-medium">{order.poNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Supplier:</span>
              <span className="font-medium">{order.supplierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Date:</span>
              <span className="font-medium">{order.orderDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expected Delivery:</span>
              <span className="font-medium">{order.expectedDeliveryDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge>{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created By:</span>
              <span className="font-medium">{order.createdBy}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span className="font-medium">${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-lg font-semibold">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${item.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
