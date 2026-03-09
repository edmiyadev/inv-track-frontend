# 📊 Implementación de Paginación en Productos

## ✅ Implementación Completa con TanStack Query + shadcn/ui

---

## 📦 Backend (Laravel) - Requerimientos

### Endpoint: `GET /products`

Tu controlador debe retornar los datos en este formato:

```php
public function index(Request $request)
{
    $perPage = $request->input('per_page', 10);
    $page = $request->input('page', 1);
    
    $products = Product::paginate($perPage);
    
    return response()->json([
        'status' => 'success',
        'message' => 'Productos obtenidos exitosamente',
        'data' => $products->items(),
        'meta' => [
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
            'from' => $products->firstItem(),
            'to' => $products->lastItem(),
        ]
    ]);
}
```

### Parámetros de Query

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Número de página actual |
| `per_page` | integer | 10 | Cantidad de items por página |

### Ejemplo de Respuesta

```json
{
  "status": "success",
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "sku": "PRD-001",
      "name": "Producto 1",
      "description": "Descripción",
      "price": "99.99",
      "stock_quantity": 50,
      "reorder_point": 10,
      "product_category_id": 1,
      "supplier_id": 1,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50,
    "from": 1,
    "to": 10
  }
}
```

---

## 🎨 Frontend - Archivos Creados/Modificados

### 1. **Tipos de API** (`lib/api/types.ts`)

Se agregó la interfaz `PaginationMeta`:

```typescript
export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface ProductsResponse {
  status: string
  message: string
  data: Product[]
  meta?: PaginationMeta  // ← Nuevo campo
}
```

### 2. **Cliente de API** (`lib/api/products.ts`)

Actualizado el método `getAll` para soportar paginación:

```typescript
getAll: async (
  token: string, 
  page: number = 1, 
  perPage: number = 10
): Promise<ProductsResponse> => {
  return apiClient.get<ProductsResponse>(
    `/products?page=${page}&per_page=${perPage}`, 
    token
  )
}
```

### 3. **Provider de TanStack Query** (`components/providers/query-provider.tsx`)

Provider global para manejo de cache y queries:

```typescript
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }))

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

**Configuración:**
- ✅ `staleTime`: 1 minuto - tiempo que los datos se consideran frescos
- ✅ `refetchOnWindowFocus`: false - no refrescar al cambiar de ventana
- ✅ `retry`: 1 - solo 1 intento de reintentar en caso de error

### 4. **Componente de Paginación** (`components/shared/pagination-controls.tsx`)

Controles de paginación con shadcn/ui:

**Características:**
- ✅ Selector de items por página (5, 10, 20, 30, 50)
- ✅ Navegación: Primera, Anterior, Siguiente, Última página
- ✅ Indicador de rango: "Mostrando 1 a 10 de 50 productos"
- ✅ Indicador de página actual: "Página 1 de 5"
- ✅ Estados deshabilitados cuando está cargando
- ✅ Responsive con Tailwind CSS

**Props:**
```typescript
interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
  isLoading?: boolean
}
```

### 5. **Tabla de Productos con Paginación** (`components/products/product-table-paginated.tsx`)

Versión mejorada de ProductTable usando TanStack Query:

**Características principales:**

#### 🔄 TanStack Query Integration
```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['products', currentPage, itemsPerPage],
  queryFn: () => productsApi.getAll(accessToken!, currentPage, itemsPerPage),
  enabled: !!accessToken,
  staleTime: 30000, // 30 segundos
})
```

**Ventajas:**
- ✅ **Cache automático**: Los datos se cachean por queryKey
- ✅ **Refetch inteligente**: Solo recarga cuando cambia página o items/página
- ✅ **Estados integrados**: isLoading, error, data
- ✅ **Optimización**: Evita requests duplicados

#### 📄 Paginación
- Estado local para `currentPage` y `itemsPerPage`
- Al cambiar items/página, resetea a página 1
- Controles visuales con `PaginationControls`

#### 🗑️ Eliminación
- Confirmación con AlertDialog
- Refetch automático después de eliminar
- Estados de carga durante eliminación

### 6. **Layout Principal** (`app/layout.tsx`)

Se agregó el `QueryProvider` wrapeando la aplicación:

```tsx
<QueryProvider>
  <ThemeProvider defaultTheme="dark" storageKey="inventory-theme">
    <AuthInitializer>{children}</AuthInitializer>
  </ThemeProvider>
</QueryProvider>
```

---

## 🚀 Cómo Usar

### Opción 1: Reemplazar el componente actual

En `app/dashboard/products/page.tsx`:

```tsx
import { ProductTable } from "@/components/products/product-table-paginated"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Productos" 
        description="Gestiona tu inventario de productos"
        actions={
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Crear Producto
            </Link>
          </Button>
        }
      />
      <ProductTable />
    </div>
  )
}
```

### Opción 2: Mantener ambas versiones

Puedes renombrar el componente actual y usar la versión paginada:

```bash
mv components/products/product-table.tsx components/products/product-table-simple.tsx
mv components/products/product-table-paginated.tsx components/products/product-table.tsx
```

---

## 🎯 Beneficios de TanStack Query

### 1. **Performance**
- ⚡ Cache automático de requests
- ⚡ Deduplicación de queries
- ⚡ Background refetching
- ⚡ Prefetching de datos

### 2. **Developer Experience**
- 🔧 Estados de carga integrados
- 🔧 Manejo de errores simplificado
- 🔧 DevTools para debugging
- 🔧 TypeScript support completo

### 3. **User Experience**
- ✨ Actualizaciones optimistas
- ✨ Retry automático en errores
- ✨ Estados de carga granulares
- ✨ Sincronización de pestañas

---

## 📊 Flujo de Datos

```
Usuario → Cambia Página/Items
    ↓
TanStack Query verifica cache
    ↓
    ┌─────────────┐
    │ ¿En cache?  │
    └─────────────┘
      ↓         ↓
     Sí        No
      ↓         ↓
  Retorna   Request API
   cache        ↓
      ↓    Laravel Backend
      ↓         ↓
      └─────────┘
           ↓
    Actualiza UI
           ↓
    Guarda en cache
```

---

## 🔍 Testing

### Probar la paginación:

1. **Cambiar página**: Click en botones de navegación
2. **Cambiar items/página**: Usar el selector (5, 10, 20, 30, 50)
3. **Verificar estados**: Loading, error, empty
4. **Probar eliminación**: Debe refetch después de eliminar

### Verificar en DevTools:

TanStack Query incluye DevTools para debugging:

```tsx
// Opcional: Agregar en development
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryProvider>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryProvider>
```

---

## 📝 Notas Importantes

1. **Backend debe retornar meta**: Asegúrate que Laravel incluya el objeto `meta` con la información de paginación

2. **Token de autenticación**: El componente usa `useAuthStore` para obtener el token

3. **Cache**: Los datos se cachean por 30 segundos (`staleTime`)

4. **Responsive**: El componente de paginación es responsive y se adapta a móviles

5. **Accesibilidad**: Todos los botones tienen `sr-only` labels para screen readers

---

## 🎨 Personalización

### Cambiar items por página predeterminados:

En `product-table-paginated.tsx`:
```typescript
const [itemsPerPage, setItemsPerPage] = useState(20) // Cambiar de 10 a 20
```

### Cambiar opciones del selector:

En `pagination-controls.tsx`:
```typescript
{[5, 10, 20, 30, 50, 100].map((pageSize) => (  // Agregar 100
  // ...
))}
```

### Cambiar tiempo de cache:

En `product-table-paginated.tsx`:
```typescript
staleTime: 60000, // Cambiar de 30000 (30s) a 60000 (1min)
```

---

## ✅ Checklist de Implementación

- [x] Instalar `@tanstack/react-query`
- [x] Crear `QueryProvider`
- [x] Agregar provider al layout
- [x] Actualizar tipos de API (PaginationMeta)
- [x] Actualizar cliente de API (getAll con parámetros)
- [x] Crear componente `PaginationControls`
- [x] Crear `ProductTable` con TanStack Query
- [ ] **Actualizar backend de Laravel** (lo que debes hacer tú)
- [ ] **Probar en navegador**
- [ ] **(Opcional) Agregar React Query DevTools**

---

## 🔗 Recursos

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Laravel Pagination](https://laravel.com/docs/pagination)
- [Next.js 16 Docs](https://nextjs.org/docs)
