import { PageHeader } from "@/components/layout/page-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { LowStockAlert } from "@/components/dashboard/low-stock-alert"
import { Package, TrendingDown, DollarSign, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de Control"
        description="Vista general de tu sistema de gestión de inventario"
        actions={
          <Button asChild>
            <Link href="/dashboard/products/new">Agregar Producto</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Productos"
          value="1,284"
          change={{ value: 12, trend: "up" }}
          icon={Package}
          description="Productos activos en inventario"
        />
        <StatsCard
          title="Productos con Stock Bajo"
          value="23"
          change={{ value: 8, trend: "down" }}
          icon={TrendingDown}
          description="Productos por debajo del punto de reorden"
        />
        <StatsCard
          title="Valor Total del Inventario"
          value="$284,392"
          change={{ value: 5, trend: "up" }}
          icon={DollarSign}
          description="Valoración actual del stock"
        />
        <StatsCard
          title="Pedidos Recientes"
          value="156"
          change={{ value: 18, trend: "up" }}
          icon={ShoppingCart}
          description="Pedidos este mes"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <InventoryChart />
        </div>
        <div className="lg:col-span-3">
          <LowStockAlert />
        </div>
      </div>

      <RecentActivity />
    </div>
  )
}
