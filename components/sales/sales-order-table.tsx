"use client"

import { useState } from "react"
import { MoreHorizontal, Eye, Pencil, Trash2, Loader2 } from "lucide-react"
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
import { useQuery } from "@tanstack/react-query"
import { salesApi } from "@/lib/api/sales"
import { useAuthStore } from "@/lib/store/auth"
import type { Sale } from "@/lib/api/types"
import { parseApiDateToLocalDate } from "@/lib/utils"

const statusColors = {
  draft: "secondary",
  posted: "default",
  canceled: "destructive",
} as const

export function SalesOrderTable() {
  const { accessToken } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: () => salesApi.getAllSales(accessToken!, 1, 50),
    enabled: !!accessToken,
  })

  const responseData = ordersResponse as any
  const orders: Sale[] = responseData?.data?.data || responseData?.data || []

  const filteredOrders = orders.filter(
    (order) =>
      (order.customer?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery),
  )

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Buscar órdenes de venta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° de Orden</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha de Orden</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No se encontraron órdenes de venta.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order: Sale) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">SO-{order.id.toString().padStart(6, '0')}</TableCell>
                  <TableCell>{order.customer?.name || "Cliente desconocido"}</TableCell>
                  <TableCell>
                    {order.date
                      ? parseApiDateToLocalDate(order.date)?.toLocaleDateString() ?? "Sin fecha"
                      : "Sin fecha"}
                  </TableCell>
                  <TableCell className="font-medium">${parseFloat(order.total_amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[order.status as keyof typeof statusColors] || "default"}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/sales/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </Link>
                        </DropdownMenuItem>
                        {order.status === 'draft' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/sales/orders/${order.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </>
                        )}
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
