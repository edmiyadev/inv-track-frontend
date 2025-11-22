import { RoleTable } from "@/components/roles/role-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RolesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Roles y Permisos</h1>
                    <p className="text-muted-foreground">
                        Gestione los roles de usuario y sus permisos de acceso al sistema
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Roles</CardTitle>
                    <CardDescription>
                        Roles definidos en el sistema y sus configuraciones
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RoleTable />
                </CardContent>
            </Card>
        </div>
    )
}
