"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/layout/page-header"
import { WarehouseForm } from "@/components/warehouses/warehouse-form"
import { useAuthStore } from "@/lib/store/auth"
import { warehousesApi } from "@/lib/api/warehouses"
import type { Warehouse } from "@/lib/api/types"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function EditWarehousePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    const fetchWarehouse = async () => {
      if (!accessToken) return
      
      try {
        setIsLoading(true)
        setError(null)
        const response = await warehousesApi.getById(parseInt(resolvedParams.id), accessToken)
        setWarehouse(response.data)
      } catch (err) {
        console.error('Error fetching warehouse:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar el almacén')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWarehouse()
  }, [resolvedParams.id, accessToken])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Cargando almacén...</p>
        </div>
      </div>
    )
  }

  if (error || !warehouse) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error || 'No se encontró el almacén'}</p>
        </div>
      </div>
    )
  }

  return (
    // <ProtectedRoute action="edit" subject="Warehouse" redirectTo="/unauthorized">
      <div className="space-y-6">
        <PageHeader
          title="Editar Almacén"
          description={`Editando información de ${warehouse.name}`}
        />
          <WarehouseForm warehouse={warehouse} warehouseId={warehouse.id} />
      </div>
    // </ProtectedRoute>
  )
}
