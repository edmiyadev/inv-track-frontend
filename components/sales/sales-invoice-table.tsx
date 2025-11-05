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
import type { SalesInvoice } from "@/types"

const mockInvoices: SalesInvoice[] = [
  {
    id: "1",
    invoiceNumber: "SINV-2024-001",
    salesOrderId: "1",
    soNumber: "SO-2024-001",
    customerId: "1",
    customerName: "Acme Corporation",
    invoiceDate: new Date("2024-03-17"),
    dueDate: new Date("2024-04-16"),
    status: "paid",
    subtotal: 12000,
    tax: 1200,
    discount: 500,
    total: 12700,
    paidAmount: 12700,
    balanceAmount: 0,
    paymentDate: new Date("2024-04-10"),
    createdAt: new Date("2024-03-17"),
  },
  {
    id: "2",
    invoiceNumber: "SINV-2024-002",
    salesOrderId: "2",
    soNumber: "SO-2024-002",
    customerId: "2",
    customerName: "Tech Solutions Inc.",
    invoiceDate: new Date("2024-03-20"),
    dueDate: new Date("2024-05-04"),
    status: "outstanding",
    subtotal: 8500,
    tax: 850,
    discount: 0,
    total: 9350,
    paidAmount: 0,
    balanceAmount: 9350,
    createdAt: new Date("2024-03-20"),
  },
  {
    id: "3",
    invoiceNumber: "SINV-2024-003",
    salesOrderId: "3",
    soNumber: "SO-2024-003",
    customerId: "1",
    customerName: "Acme Corporation",
    invoiceDate: new Date("2024-03-22"),
    dueDate: new Date("2024-04-21"),
    status: "partial",
    subtotal: 15500,
    tax: 1550,
    discount: 1000,
    total: 16050,
    paidAmount: 8000,
    balanceAmount: 8050,
    createdAt: new Date("2024-03-22"),
  },
]

const statusColors = {
  outstanding: "secondary",
  partial: "default",
  paid: "default",
  overdue: "destructive",
} as const

export function SalesInvoiceTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [invoices] = useState<SalesInvoice[]>(mockInvoices)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.soNumber.toLowerCase().includes(searchQuery.toLowerCase())

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
              <TableHead>SO Number</TableHead>
              <TableHead>Customer</TableHead>
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
                  <TableCell>{invoice.soNumber}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
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
