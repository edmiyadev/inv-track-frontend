"use client"

import { use, useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { RoleForm } from "@/components/roles/role-form"
import { rolesApi } from "@/lib/api/roles"
import { useAuthStore } from "@/lib/store/auth"
import { Loader2 } from "lucide-react"

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const accessToken = useAuthStore((state) => state.accessToken)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["role", id],
        queryFn: () => rolesApi.getById(parseInt(id), accessToken!),
        enabled: !!accessToken && !!id,
    })

    const role = data?.data

    if (isLoading || (!role && !isError)) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
                Error al cargar el rol. Por favor intente recargar la página.
            </div>
        )
    }

    if (!role) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Rol</h1>
                <p className="text-muted-foreground">
                    Modifique los detalles y permisos del rol
                </p>
            </div>
            <div className="mx-auto max-w-4xl">
                <RoleForm
                    mode="edit"
                    roleId={role.id}
                    defaultValues={{
                        name: role.name,
                        permissions: role.permissions.map(p => p.name)
                    }}
                />
            </div>
        </div>
    )
}
