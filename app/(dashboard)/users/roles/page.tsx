import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { RolesTable } from "@/components/roles/roles-table"
import { RolePermissionsMatrix } from "@/components/users/role-permissions-matrix"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage user roles and configure granular permissions"
        actions={
          <Link href="/users/roles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </Link>
        }
      />

      <RolesTable />

      <RolePermissionsMatrix />
    </div>
  )
}
