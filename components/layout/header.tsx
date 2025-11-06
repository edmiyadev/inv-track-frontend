"use client"

import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/store/auth"

export function Header() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <MobileNav />

      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Buscar productos, inventario..." className="pl-9 bg-background" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            3
          </Badge>
          <span className="sr-only">Notificaciones</span>
        </Button>
        <ThemeToggle />
        {user && (
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-border text-xs text-muted-foreground">
            <span>{user.name}</span>
          </div>
        )}
      </div>
    </header>
  )
}
