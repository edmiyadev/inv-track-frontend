"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Pencil, Trash2, Truck } from "lucide-react"
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
import type { SalesOrder } from "@/types"

const mockSalesOrders: SalesOrder[] = [
  {
    id: "1",
    soNumber: "SO-2024-001",
    customerId: "1",
    customerName: "Acme Corporation",
    orderDate: new Date("2024-03-16"),
    expectedDeliveryDate: new Date("2024-03-23"),
    status: "confirmed",
    items: [],
    subtotal: 12000,
    tax: 1200,
    discount: 500,
    total: 12700,
    createdBy: "Admin User",
    createdAt: new Date("2024-03-16"),
    updatedAt: new Date("2024-03-16"),
  },
  {
    id: "2",
    soNumber: "SO-2024-002",
    customerId: "2",
    customerName: "Tech Solutions Inc.",
    orderDate: new Date("2024-03-19"),
    expectedDeliveryDate: new Date("2024-03-26"),
    status: "processing",
    items: [],
    subtotal: 8500,
    tax: 850,
    discount: 0,
    total: 9350,
    createdBy: "Sales Manager",
    createdAt: new Date("2024-03-19"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "3",
    soNumber: "SO-2024-003",
    customerId: "1",
    customerName: "Acme Corporation",
    orderDate: new Date("2024-03-21"),
    expectedDeliveryDate: new Date("2024-03-28"),
    status: "shipped",
    items: [],
    subtotal: 15500,
    tax: 1550,
    discount: 1000,
    total: 16050,
    createdBy: "Admin User",
    createdAt: new Date("2024-03-21"),
    updatedAt: new Date("2024-03-25"),
  },
]

const statusColors = {
  draft: "secondary",
  confirmed: "default",
  processing: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "secondary",
} as const

export function SalesOrderTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [orders] = useState<SalesOrder[]>(mockSalesOrders)

  const filteredOrders = orders.filter(
    (order) =>
      order.soNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search sales orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SO Number</TableHead>
              <TableHead>Customer</TableHead>
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
                  No sales orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.soNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
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
                          <Link href={`/sales/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" />
                          Create Shipment
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
