"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Pencil, Trash2, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { PurchaseOrder } from "@/types"

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    supplierId: "1",
    supplierName: "Global Tech Supplies",
    orderDate: new Date("2024-03-15"),
    expectedDeliveryDate: new Date("2024-03-25"),
    status: "approved",
    items: [],
    subtotal: 15000,
    tax: 1500,
    total: 16500,
    createdBy: "Admin User",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    supplierId: "2",
    supplierName: "Premium Electronics Co.",
    orderDate: new Date("2024-03-18"),
    expectedDeliveryDate: new Date("2024-03-30"),
    status: "pending",
    items: [],
    subtotal: 8500,
    tax: 850,
    total: 9350,
    createdBy: "Admin User",
    createdAt: new Date("2024-03-18"),
    updatedAt: new Date("2024-03-18"),
  },
  {
    id: "3",
    poNumber: "PO-2024-003",
    supplierId: "1",
    supplierName: "Global Tech Supplies",
    orderDate: new Date("2024-03-20"),
    expectedDeliveryDate: new Date("2024-04-05"),
    status: "received",
    items: [],
    subtotal: 22000,
    tax: 2200,
    total: 24200,
    createdBy: "Manager User",
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-28"),
  },
]

const statusColors = {
  draft: "secondary",
  pending: "default",
  approved: "default",
  received: "default",
  cancelled: "secondary",
} as const

export function PurchaseOrderTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [orders] = useState<PurchaseOrder[]>(mockPurchaseOrders)

  const filteredOrders = orders.filter(
    (order) =>
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search purchase orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No purchase orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.poNumber}</TableCell>
                  <TableCell>{order.supplierName}</TableCell>
                  <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
                  <TableCell>{order.expectedDeliveryDate.toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">${order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/purchasing/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
