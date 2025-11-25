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
  DollarSign,
  FolderTree,
  ShoppingBag,
  ArrowRightLeft,
  Shield,
  UserCog,
  ChevronDown,
  Truck,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useFilteredNavigation } from "@/hooks/use-filtered-navigation"

// Grupos de navegación (mismo que sidebar)
const navigationGroups = [
  {
    name: "Dashboard",
    items: [
      { name: "Panel Principal", href: "/dashboard", icon: LayoutDashboard, permission: "Dashboard" as const },
    ],
  },
  {
    name: "Operaciones",
    icon: ShoppingBag,
    isCollapsible: true,
    items: [
      { name: "Compras", href: "/purchasing", icon: ShoppingCart, permission: "Purchase" as const },
      { name: "Ventas", href: "/sales", icon: DollarSign, permission: "Sale" as const },
    ],
  },
  {
    name: "Inventario",
    icon: Warehouse,
    isCollapsible: true,
    items: [
      { name: "Productos", href: "/products", icon: Package, permission: "Product" as const },
      { name: "Categorías", href: "/categories", icon: FolderTree, permission: "Category" as const },
      { name: "Almacenes", href: "/warehouses", icon: Building2, permission: "Warehouse" as const },
      { name: "Proveedores", href: "/suppliers", icon: Truck, permission: "Supplier" as const },
      { name: "Stock", href: "/inventory", icon: Warehouse, permission: "Inventory" as const },
      { name: "Movimientos", href: "/inventory/history", icon: ArrowRightLeft, permission: "Inventory" as const },
    ],
  },
  {
    name: "Configuración",
    icon: Settings,
    isCollapsible: true,
    items: [
      { name: "Usuarios", href: "/users", icon: Users, permission: "User" as const },
      { name: "Roles y Permisos", href: "/roles", icon: Shield, permission: "Role" as const },
      { name: "Preferencias", href: "/settings", icon: UserCog, permission: "Settings" as const },
    ],
  },
]

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>(["Dashboard", "Operaciones", "Inventario", "Configuración"])
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // Filtrar navegación basada en permisos del usuario
  const filteredGroups = useFilteredNavigation(navigationGroups)

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U"

  const handleLogout = () => {
    logout()
    setOpen(false)
  }

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
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

        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredGroups.map((group) => {
            // Verificar si el grupo debe ser siempre colapsable
            const shouldBeCollapsible = (group as any).isCollapsible === true

            // Si el grupo debe ser colapsable O tiene más de un item, renderizar como grupo
            if (!shouldBeCollapsible && group.items.length === 1) {
              // Solo para items individuales que NO son parte de un grupo colapsable
              const item = group.items[0]
              const isActive = pathname === item.href
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
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            }

            // Grupos colapsables
            const hasActiveItem = group.items.some(item =>
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            )
            const isOpen = openGroups.includes(group.name)

            return (
              <Collapsible
                key={group.name}
                open={isOpen}
                onOpenChange={() => toggleGroup(group.name)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between px-3 py-2.5 h-auto text-sm font-medium",
                      hasActiveItem
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {group.icon && <group.icon className="h-5 w-5 shrink-0" />}
                      <span>{group.name}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform shrink-0",
                        isOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 pt-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 ml-6 text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </CollapsibleContent>
              </Collapsible>
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
              <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email || ""}</p>
            </div>
          </div>
          <Link href="/settings/profile" onClick={() => setOpen(false)} className="w-full">
            <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
              <User className="mr-2 h-4 w-4" />
              Configuración de Perfil
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive bg-transparent"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
