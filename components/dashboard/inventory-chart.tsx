"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Enero", stock: 186 },
  { month: "Febrero", stock: 305 },
  { month: "Marzo", stock: 237 },
  { month: "Abril", stock: 273 },
  { month: "Mayo", stock: 209 },
  { month: "Junio", stock: 314 },
]

const chartConfig = {
  stock: {
    label: "Nivel de Stock",
    color: "hsl(var(--chart-1))",
  },
}

export function InventoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Niveles de Stock</CardTitle>
        <CardDescription>Tendencia mensual del inventario en los últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="stock" fill="var(--color-stock)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
