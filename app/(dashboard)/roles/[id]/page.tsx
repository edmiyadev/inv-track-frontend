"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Pencil, Trash2, Shield, Calendar, Lock } from "lucide-react"
import { rolesApi } from "@/lib/api/roles"
import { useAuthStore } from "@/lib/store/auth"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Permission } from "@/lib/api/types"

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const queryClient = useQueryClient()
    const accessToken = useAuthStore((state) => state.accessToken)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["role", id],
        queryFn: () => rolesApi.getById(parseInt(id), accessToken!),
        enabled: !!accessToken && !!id,
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => rolesApi.delete(id, accessToken!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["roles"] })
            router.push("/roles")
        },
        onError: (error) => {
            console.error("Error deleting role:", error)
            alert("Error al eliminar el rol. Por favor intente nuevamente.")
        },
    })

    const role = data?.data

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isError || !role) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
                Error al cargar el rol. Por favor intente recargar la página.
            </div>
        )
    }

    // Group permissions by resource
    const groupedPermissions = role.permissions.reduce((acc, permission) => {
        const [resource] = permission.name.split(".")
        if (!acc[resource]) {
            acc[resource] = []
        }
        acc[resource].push(permission)
        return acc
    }, {} as Record<string, Permission[]>)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{role.name}</h1>
                    <p className="text-muted-foreground">
                        Detalles del rol y permisos asignados
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Link href={`/roles/${id}/edit`}>
                        <Button>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </Link>
                    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Información General</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Nombre:</span>
                            <span>{role.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Guard:</span>
                            <span>{role.guard_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Creado:</span>
                            <span>{format(new Date(role.created_at), "PPP", { locale: es })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Actualizado:</span>
                            <span>{format(new Date(role.updated_at), "PPP", { locale: es })}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Permisos Asignados ({role.permissions.length})</CardTitle>
                        <CardDescription>
                            Lista de permisos que este rol otorga a los usuarios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {role.permissions.length === 0 ? (
                            <p className="text-muted-foreground">Este rol no tiene permisos asignados.</p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {Object.entries(groupedPermissions).map(([resource, permissions]) => (
                                    <div key={resource} className="rounded-lg border p-4">
                                        <h4 className="mb-2 font-semibold capitalize">{resource.replace("_", " ")}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {permissions.map((permission) => (
                                                <Badge key={permission.id} variant="secondary">
                                                    {permission.name.split(".")[1] || permission.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                            onClick={() => deleteMutation.mutate(parseInt(id))}
                        >
                            {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
