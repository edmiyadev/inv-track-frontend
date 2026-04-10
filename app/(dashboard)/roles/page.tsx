import { PageHeader } from "@/components/layout/page-header"
import { RoleTable } from "@/components/roles/role-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function RolesPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Roles y Permisos"
                description="Gestione los roles de usuario y sus permisos de acceso al sistema"
                actions={
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/roles/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Rol
                            </Link>
                        </Button>
                    </div>
                }
            />

            <RoleTable />
        </div>
    )
}
