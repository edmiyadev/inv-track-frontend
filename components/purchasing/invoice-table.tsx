"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, DollarSign, FileText } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PurchaseInvoice } from "@/types"

const mockInvoices: PurchaseInvoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    purchaseOrderId: "1",
    poNumber: "PO-2024-001",
    supplierId: "1",
    supplierName: "Global Tech Supplies",
    invoiceDate: new Date("2024-03-16"),
    dueDate: new Date("2024-04-15"),
    status: "paid",
    subtotal: 15000,
    tax: 1500,
    total: 16500,
    paidAmount: 16500,
    balanceAmount: 0,
    paymentDate: new Date("2024-04-10"),
    createdAt: new Date("2024-03-16"),
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    purchaseOrderId: "2",
    poNumber: "PO-2024-002",
    supplierId: "2",
    supplierName: "Premium Electronics Co.",
    invoiceDate: new Date("2024-03-19"),
    dueDate: new Date("2024-05-03"),
    status: "outstanding",
    subtotal: 8500,
    tax: 850,
    total: 9350,
    paidAmount: 0,
    balanceAmount: 9350,
    createdAt: new Date("2024-03-19"),
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    purchaseOrderId: "3",
    poNumber: "PO-2024-003",
    supplierId: "1",
    supplierName: "Global Tech Supplies",
    invoiceDate: new Date("2024-03-21"),
    dueDate: new Date("2024-04-20"),
    status: "partial",
    subtotal: 22000,
    tax: 2200,
    total: 24200,
    paidAmount: 10000,
    balanceAmount: 14200,
    createdAt: new Date("2024-03-21"),
  },
]

const statusColors = {
  outstanding: "secondary",
  partial: "default",
  paid: "default",
  overdue: "destructive",
} as const

export function InvoiceTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [invoices] = useState<PurchaseInvoice[]>(mockInvoices)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.poNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="outstanding">Outstanding</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>PO Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Invoice Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.poNumber}</TableCell>
                  <TableCell>{invoice.supplierName}</TableCell>
                  <TableCell>{invoice.invoiceDate.toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.dueDate.toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">${invoice.total.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-destructive">
                    ${invoice.balanceAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[invoice.status]}>{invoice.status}</Badge>
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
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Record Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Download PDF
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
