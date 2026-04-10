"use client"

import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"
import { useAuthStore } from "@/lib/store/auth"

export function Header() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <MobileNav />

      <div className="flex-1">
      </div>

      <div className="flex items-center gap-2">
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
