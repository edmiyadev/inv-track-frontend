import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Acceso Denegado</CardTitle>
          <CardDescription>
            No tienes los permisos necesarios para acceder a esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/dashboard">Volver al Dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard/settings">Configuración</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
