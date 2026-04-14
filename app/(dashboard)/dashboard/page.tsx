"use client"

import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Package, TrendingDown, DollarSign, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { productsApi } from "@/lib/api"
import { inventoryApi } from "@/lib/api/inventory"
import { salesApi } from "@/lib/api/sales"
import { useAuthStore } from "@/lib/store/auth"

export default function DashboardPage() {
  const accessToken = useAuthStore((state) => state.accessToken)

  const { data: productsData } = useQuery({
    queryKey: ["dashboard", "products-total"],
    queryFn: () => productsApi.getAll(accessToken!, 1, 1),
    enabled: !!accessToken,
    staleTime: 30000,
  })

  const { data: lowStockData } = useQuery({
    queryKey: ["dashboard", "low-stock"],
    queryFn: () => inventoryApi.getLowStock(accessToken!),
    enabled: !!accessToken,
    staleTime: 30000,
  })

  const { data: stocksData } = useQuery({
    queryKey: ["dashboard", "stock-value"],
    queryFn: () => inventoryApi.getAllStocks(accessToken!),
    enabled: !!accessToken,
    staleTime: 30000,
  })

  const { data: salesData } = useQuery({
    queryKey: ["dashboard", "sales-total"],
    queryFn: () => salesApi.getAllSales(accessToken!, 1, 1),
    enabled: !!accessToken,
    staleTime: 30000,
  })

  const totalInventoryValue = useMemo(() => {
    if (!stocksData?.data?.length) return 0

    return stocksData.data.reduce((total, stock) => {
      const unitPrice = Number(stock.product?.price ?? 0)
      return total + stock.quantity * unitPrice
    }, 0)
  }, [stocksData])

  const currencyFormatter = new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 2,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de Control"
        description="Vista general de tu sistema de gestión de inventario"
        actions={
          <Button asChild>
            <Link href="/products/new">Agregar Producto</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Productos"
          value={productsData?.data.total.toString() || "0"}
          icon={Package}
          description="Productos activos en inventario"
        />
        <StatsCard
          title="Productos con Stock Bajo"
          value={(lowStockData?.data.length ?? 0).toString()}
          icon={TrendingDown}
          description="Productos por debajo del punto de reorden"
        />
        <StatsCard
          title="Valor Total del Inventario"
          value={currencyFormatter.format(totalInventoryValue)}
          icon={DollarSign}
          description="Valoración actual del stock"
        />
        <StatsCard
          title="Ventas Registradas"
          value={(salesData?.data.total ?? 0).toString()}
          icon={ShoppingCart}
          description="Total de ventas creadas en el sistema"
        />
      </div>
    </div>
  )
}
