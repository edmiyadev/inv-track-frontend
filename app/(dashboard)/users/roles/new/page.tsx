"use client"

import { PageHeader } from "@/components/layout/page-header"
import { RoleForm } from "@/components/roles/role-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewRolePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/users/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <PageHeader title="Create New Role" description="Define a custom role with specific permissions" />
      </div>

      <RoleForm
        mode="create"
        onSubmit={async (data) => {
          console.log("[v0] Creating role:", data)
          // Handle role creation
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }}
      />
    </div>
  )
}
