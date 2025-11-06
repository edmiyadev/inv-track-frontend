import { PageHeader } from "@/components/layout/page-header"
import { UserTable } from "@/components/users/user-table"
import { Button } from "@/components/ui/button"
import { UserPlus, Download } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Gestiona cuentas de usuario y permisos de acceso"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button asChild>
              <Link href="/users/new">
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar Usuario
              </Link>
            </Button>
          </div>
        }
      />

      <UserTable />
    </div>
  )
}
