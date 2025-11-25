"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, ArrowLeft, Mail, User as UserIcon, Shield, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth"
import { usersApi } from "@/lib/api/users"
import type { User } from "@/lib/api/types"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const accessToken = useAuthStore((state) => state.accessToken)
    const router = useRouter()

    useEffect(() => {
        const fetchUser = async () => {
            if (!accessToken) return

            try {
                setIsLoading(true)
                setError(null)
                const response = await usersApi.getById(parseInt(resolvedParams.id), accessToken)
                setUser(response.data)
            } catch (err) {
                console.error('Error fetching user:', err)
                setError(err instanceof Error ? err.message : 'Error al cargar el usuario')
            } finally {
                setIsLoading(false)
            }
        }

        fetchUser()
    }, [resolvedParams.id, accessToken])

    const handleDelete = async () => {
        if (!accessToken || !user) return

        try {
            setIsDeleting(true)
            await usersApi.delete(user.id, accessToken)
            router.push('/users')
        } catch (err) {
            console.error('Error deleting user:', err)
            alert('Error al eliminar el usuario')
            setIsDeleting(false)
        }
    }

    const getRoleBadge = (roles: User["roles"]) => {
        const roleName = roles && roles.length > 0 ? roles[0].name : 'viewer'

        const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", label: string }> = {
            admin: { variant: "default", label: "Administrador" },
            manager: { variant: "secondary", label: "Gerente" },
            staff: { variant: "outline", label: "Personal" },
            viewer: { variant: "outline", label: "Visualizador" },
        }

        const config = variants[roleName] || variants.viewer
        return (
            <Badge variant={config.variant} className="font-normal">
                {config.label}
            </Badge>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">Cargando usuario...</p>
                </div>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" asChild>
                    <Link href="/users">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Usuarios
                    </Link>
                </Button>
                <div className="rounded-lg border border-destructive bg-destructive/10 p-8">
                    <p className="text-center text-destructive">{error || 'Usuario no encontrado'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/users">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <PageHeader
                        title={user.name}
                        description={`Usuario: ${user.username}`}
                        actions={
                            <div className="flex gap-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon" disabled={isDeleting}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario
                                                <strong> {user.name}</strong> del sistema.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Button asChild>
                                    <Link href={`/users/${resolvedParams.id}/edit`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar Usuario
                                    </Link>
                                </Button>
                            </div>
                        }
                    />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información Personal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                                    </div>
                                    <p className="text-base">{user.name}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground">Nombre de Usuario</p>
                                    </div>
                                    <p className="text-base font-mono">{user.username}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
                                    </div>
                                    <p className="text-base">{user.email}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
                                    </div>
                                    <p className="text-base">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rol y Acceso</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-sm font-medium text-muted-foreground">Rol Asignado</p>
                                </div>
                                <div className="mt-1">
                                    {
                                        user.roles?.map((role) => {
                                            return <Badge key={role.id} variant={"default"} className="font-normal">
                                                {role.name}
                                            </Badge>;
                                        })
                                    }
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
