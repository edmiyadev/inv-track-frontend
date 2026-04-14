import { PageHeader } from "@/components/layout/page-header"
import { UserForm } from "@/components/users/user-form"

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Crear Usuario" description="Agrega un nuevo usuario al sistema" />

      <UserForm mode="create" />
    </div>
  )
}
