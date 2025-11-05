"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StockAdjustmentForm } from "./stock-adjustment-form"

interface StockItem {
  id: string
  productName: string
  sku: string
  currentStock: number
  reorderPoint: number
  lastUpdated: Date
  status: "in-stock" | "low-stock" | "out-of-stock"
}

const mockStockData: StockItem[] = [
  {
    id: "1",
    productName: "Wireless Mouse",
    sku: "MSE-001",
    currentStock: 145,
    reorderPoint: 20,
    lastUpdated: new Date(),
    status: "in-stock",
  },
  {
    id: "2",
    productName: "USB-C Cable",
    sku: "CBL-002",
    currentStock: 8,
    reorderPoint: 50,
    lastUpdated: new Date(),
    status: "low-stock",
  },
  {
    id: "3",
    productName: "Mechanical Keyboard",
    sku: "KBD-003",
    currentStock: 0,
    reorderPoint: 10,
    lastUpdated: new Date(),
    status: "out-of-stock",
  },
  {
    id: "4",
    productName: "Office Chair",
    sku: "FUR-004",
    currentStock: 32,
    reorderPoint: 5,
    lastUpdated: new Date(),
    status: "in-stock",
  },
  {
    id: "5",
    productName: "Desk Lamp",
    sku: "LGT-005",
    currentStock: 67,
    reorderPoint: 15,
    lastUpdated: new Date(),
    status: "in-stock",
  },
]

export function StockTable() {
  const [stockData] = useState<StockItem[]>(mockStockData)
  const [selectedProduct, setSelectedProduct] = useState<StockItem | null>(null)

  const getStatusBadge = (status: StockItem["status"]) => {
    const variants = {
      "in-stock": "default",
      "low-stock": "secondary",
      "out-of-stock": "destructive",
    } as const

    const labels = {
      "in-stock": "In Stock",
      "low-stock": "Low Stock",
      "out-of-stock": "Out of Stock",
    }

    return (
      <Badge variant={variants[status]} className="font-normal">
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                Product
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                Current Stock
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Reorder Point</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.productName}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{item.sku}</TableCell>
              <TableCell className="text-right font-semibold">{item.currentStock}</TableCell>
              <TableCell className="text-right text-muted-foreground">{item.reorderPoint}</TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.lastUpdated.toLocaleDateString()}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedProduct(item)}>
                      Adjust
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adjust Stock</DialogTitle>
                      <DialogDescription>Update stock levels for {selectedProduct?.productName}</DialogDescription>
                    </DialogHeader>
                    {selectedProduct && <StockAdjustmentForm product={selectedProduct} />}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
