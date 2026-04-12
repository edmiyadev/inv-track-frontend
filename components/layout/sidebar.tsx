"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  Settings,
  ChevronLeft,
  ShoppingCart,
  TrendingUp,
  LogOut,
  User,
  FolderTree,
  ChevronDown,
  ShoppingBag,
  DollarSign,
  Building2,
  ArrowRightLeft,
  BarChart3,
  Shield,
  UserCog,
  Truck,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useFilteredNavigation } from "@/hooks/use-filtered-navigation"

// Grupos de navegación
const navigationGroups = [
  {
    name: "Compras",
    icon: ShoppingBag,
    isCollapsible: true, // Siempre renderizar como grupo colapsable
    items: [
      { name: "Proveedores", href: "/suppliers", icon: Truck, permission: "Supplier" as const },
      { name: "Compras", href: "/purchasing", icon: ShoppingCart, permission: "Purchase" as const },
    ],
  },
  {
    name: "Ventas",
    icon: ShoppingCart,
    isCollapsible: true, // Siempre renderizar como grupo colapsable
    items: [
      { name: "Clientes", href: "/customers", icon: User, permission: "Customer" as const },
      { name: "Ventas", href: "/sales", icon: DollarSign, permission: "Sale" as const },
    ],
  },
  {
    name: "Inventario",
    icon: Warehouse,
    isCollapsible: true, // Siempre renderizar como grupo colapsable
    items: [
      { name: "Productos", href: "/products", icon: Package, permission: "Product" as const },
      { name: "Categorías", href: "/categories", icon: FolderTree, permission: "Category" as const },
      { name: "Almacenes", href: "/warehouses", icon: Building2, permission: "Warehouse" as const },
    ],
  },
  {
    name: "Control",
    icon: Warehouse,
    isCollapsible: true,
    items: [
      { name: "Stock", href: "/inventory", icon: Warehouse, permission: "InventoryStock" as const },
      { name: "Movimientos", href: "/inventory/history", icon: ArrowRightLeft, permission: "InventoryMovement" as const },
    ],
  },
  {
    name: "Sistema",
    icon: Settings,
    isCollapsible: true, // Siempre renderizar como grupo colapsable
    items: [
      { name: "Impuestos", href: "/taxes", icon: Percent, permission: "Tax" as const },
      { name: "Usuarios", href: "/users", icon: Users, permission: "User" as const },
      { name: "Roles y Permisos", href: "/roles", icon: Shield, permission: "Role" as const },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState<string[]>(["Dashboard", "Compras", "Ventas", "Inventario", "Control", "Sistema"])
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // Filtrar navegación basada en permisos del usuario
  const filteredGroups = useFilteredNavigation(navigationGroups)

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U"

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    )
  }

  // Determine the active item using "Best Match" (Longest Prefix Match) logic
  // This prevents "/inventory" (Stock) from being active when visiting "/inventory/history" (Movements)
  const allItems = filteredGroups.flatMap((group) => group.items)
  const activeItem = allItems
    .filter((item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]

  const activeHref = activeItem?.href

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <span className="text-lg">InvTrack</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        <Link
          key={"Dashboard"}
          href={"/dashboard"}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/dashboard"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Panel Principal" : undefined}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{"Panel Principal"}</span>}
        </Link>

        {filteredGroups.map((group) => {
          // Check if this group contains the active item
          const hasActiveItem = group.items.some(item => item.href === activeHref)

          // Verificar si el grupo debe ser siempre colapsable
          const shouldBeCollapsible = (group as any).isCollapsible === true

          // Si el grupo debe ser colapsable O tiene más de un item, renderizar como grupo
          if (!shouldBeCollapsible && group.items.length === 1) {
            // Solo para items individuales que NO son parte de un grupo colapsable
            const item = group.items[0]
            const isActive = activeHref === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center",
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          }

          // Grupos colapsables
          const isOpen = openGroups.includes(group.name)

          if (collapsed) {
            // Modo colapsado: mostrar solo iconos
            return (
              <div key={group.name} className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeHref === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                      title={item.name}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                    </Link>
                  )
                })}
              </div>
            )
          }

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
                  const isActive = activeHref === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
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

      <div className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn("w-full justify-start px-3 py-2.5 h-auto", collapsed && "justify-center px-0")}
            >
              <div className={cn("flex items-center gap-3", collapsed && "gap-0")}>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {userInitial}
                </div>
                {!collapsed && (
                  <div className="flex-1 overflow-hidden text-left">
                    <p className="truncate text-sm font-medium">{user?.name || "User"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email || ""}</p>
                  </div>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {userInitial}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Configuración de Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* </CHANGE> */}
    </aside>
  )
}
