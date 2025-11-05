"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  Package,
  LayoutDashboard,
  Warehouse,
  Users,
  Settings,
  LogOut,
  User,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth"
import { Separator } from "@/components/ui/separator"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Inventory", href: "/dashboard/inventory", icon: Warehouse },
  { name: "Purchasing", href: "/dashboard/purchasing", icon: ShoppingCart },
  { name: "Sales", href: "/dashboard/sales", icon: TrendingUp },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const userInitial = user?.username?.charAt(0)?.toUpperCase() || "U"
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 flex flex-col">
        <div className="flex h-16 items-center border-b border-border px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <span className="text-lg">Inventory</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <Separator />

        {/* User section in mobile nav */}
        <div className="border-t border-border p-3 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
              {userInitial}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.username || "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
          <Link href="/dashboard/settings/profile" onClick={() => setOpen(false)} className="w-full">
            <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive bg-transparent"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
