"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, User, Bell, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const settingsNav = [
  { name: "General", href: "/settings", icon: Building2 },
  { name: "Profile", href: "/settings/profile", icon: User },
  { name: "Notifications", href: "/settings/notifications", icon: Bell },
  { name: "Appearance", href: "/settings/appearance", icon: Palette },
]

export function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {settingsNav.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
