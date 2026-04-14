"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Shield, Search, Users } from "lucide-react"

interface Role {
  id: string
  name: string
  description: string
  userCount: number
  isSystem: boolean
  createdAt: string
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Administrator",
    description: "Full system access with all permissions",
    userCount: 3,
    isSystem: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Manager",
    description: "Manage products and inventory operations",
    userCount: 8,
    isSystem: true,
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Staff",
    description: "Process orders and update inventory",
    userCount: 24,
    isSystem: true,
    createdAt: "2024-01-15",
  },
  {
    id: "4",
    name: "Viewer",
    description: "Read-only access to inventory data",
    userCount: 12,
    isSystem: true,
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    name: "Warehouse Manager",
    description: "Manage warehouse operations and stock transfers",
    userCount: 5,
    isSystem: false,
    createdAt: "2024-02-20",
  },
]

export function RolesTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRoles = mockRoles.filter((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre del Rol</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-center">Usuarios</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{role.name}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate text-sm text-muted-foreground">{role.description}</p>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{role.userCount}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {role.isSystem ? <Badge variant="secondary">Sistema</Badge> : <Badge variant="outline">Personalizado</Badge>}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar Rol
                      </DropdownMenuItem>
                      {!role.isSystem && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar Rol
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
