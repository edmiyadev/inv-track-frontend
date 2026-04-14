import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, RefreshCw } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "in",
    product: "Wireless Mouse",
    quantity: 50,
    user: "John Doe",
    time: "hace 2 horas",
  },
  {
    id: 2,
    type: "out",
    product: "USB-C Cable",
    quantity: 25,
    user: "Jane Smith",
    time: "hace 4 horas",
  },
  {
    id: 3,
    type: "adjustment",
    product: "Laptop Stand",
    quantity: 5,
    user: "Admin",
    time: "hace 6 horas",
  },
  {
    id: 4,
    type: "in",
    product: "Mechanical Keyboard",
    quantity: 30,
    user: "John Doe",
    time: "hace 1 día",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimos movimientos y actualizaciones del inventario</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  activity.type === "in"
                    ? "bg-success/10 text-success"
                    : activity.type === "out"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning"
                }`}
              >
                {activity.type === "in" ? (
                  <ArrowDownIcon className="h-4 w-4" />
                ) : activity.type === "out" ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.product}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.type === "in" ? "Agregado" : activity.type === "out" ? "Retirado" : "Ajustado"}{" "}
                  {activity.quantity} unidades por {activity.user}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
