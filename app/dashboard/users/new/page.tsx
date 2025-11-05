import { PageHeader } from "@/components/layout/page-header"
import { UserForm } from "@/components/users/user-form"

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create User" description="Add a new user to the system" />

      <UserForm mode="create" />
    </div>
  )
}
