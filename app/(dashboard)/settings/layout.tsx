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
      <PageHeader title="Configuración" description="Gestiona tu cuenta y las preferencias de la aplicación" />
      <div>{children}</div>
    </div>
  )
}
