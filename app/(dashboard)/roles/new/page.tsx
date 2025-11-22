import { RoleForm } from "@/components/roles/role-form"

export default function NewRolePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nuevo Rol</h1>
                <p className="text-muted-foreground">
                    Cree un nuevo rol y asigne sus permisos correspondientes
                </p>
            </div>
            <div className="mx-auto max-w-4xl">
                <RoleForm mode="create" />
            </div>
        </div>
    )
}
