"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { UserForm } from "@/components/users/user-form"
import { useAuthStore } from "@/lib/store/auth"
import { usersApi } from "@/lib/api/users"
import type { User } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UserFormData } from "@/lib/validations"

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
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

    // Transform User to UserFormData
    const defaultValues: Partial<UserFormData> = {
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.roles && user.roles.length > 0 ? (user.roles[0].name as any) : "viewer",
        status: "active", // Assuming active for now as status might not be in User type yet or handled differently
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/users/${resolvedParams.id}`}>
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <PageHeader title="Editar Usuario" description={`Editando: ${user.username}`} />
            </div>

            <UserForm mode="edit" defaultValues={defaultValues} userId={parseInt(resolvedParams.id)} />
        </div>
    )
}
