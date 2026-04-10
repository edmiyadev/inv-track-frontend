import type React from "react"
import { PageHeader } from "@/components/layout/page-header"
import { SettingsNav } from "@/components/settings/settings-nav"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and application preferences" />
      <div>{children}</div>
    </div>
  )
}
