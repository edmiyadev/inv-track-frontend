"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Plus, Search, Loader2, Shield } from "lucide-react"
import { rolesApi } from "@/lib/api/roles"
import { useAuthStore } from "@/lib/store/auth"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function RoleTable() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const accessToken = useAuthStore((state) => state.accessToken)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["roles"],
        queryFn: () => rolesApi.getAll(accessToken!),
        enabled: !!accessToken,
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => rolesApi.delete(id, accessToken!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] })
            setRoleToDelete(null)
        },
        onError: (error) => {
            console.error("Error deleting role:", error)
            alert("Error al eliminar el rol. Por favor intente nuevamente.")
        },
    })

    const roles = data?.data || []

    const filteredRoles = roles.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = () => {
        if (roleToDelete) {
            deleteMutation.mutate(roleToDelete)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
                Error al cargar los roles. Por favor intente recargar la página.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar roles..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link href="/roles/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Rol
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Permisos</TableHead>
                            <TableHead>Fecha de Creación</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRoles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No se encontraron roles.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRoles.map((role) => (
                                <TableRow key={role.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            {role.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {role.permissions?.length || 0} permisos
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(role.created_at), "PPP", { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menú</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => router.push(`/roles/${role.id}`)}>
                                                    Ver detalles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.push(`/roles/${role.id}/edit`)}>
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => setRoleToDelete(role.id)}
                                                >
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el rol
                            y podría afectar a los usuarios que lo tengan asignado.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDelete}
                        >
                            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
