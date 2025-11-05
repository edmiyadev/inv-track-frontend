"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", stock: 186 },
  { month: "Feb", stock: 305 },
  { month: "Mar", stock: 237 },
  { month: "Apr", stock: 273 },
  { month: "May", stock: 209 },
  { month: "Jun", stock: 314 },
]

const chartConfig = {
  stock: {
    label: "Stock Level",
    color: "hsl(var(--chart-1))",
  },
}

export function InventoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Levels Overview</CardTitle>
        <CardDescription>Monthly inventory trends for the past 6 months</CardDescription>
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
