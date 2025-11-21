# CASL - Control de Acceso y Permisos

## ✅ Implementación Completa

Se ha implementado CASL integrado con Laravel Spatie Permission para el manejo de roles y permisos.

## 🏗️ Estructura del Backend (Laravel Spatie Permission)

El backend retorna roles y permisos en el formato:

```json
{
  "id": 2,
  "name": "Admin User",
  "roles": [
    {
      "id": 2,
      "name": "Admin",
      "permissions": [
        {
          "id": 12,
          "name": "suppliers.view"
        },
        {
          "id": 13,
          "name": "suppliers.create"
        },
        {
          "id": 14,
          "name": "suppliers.edit"
        },
        {
          "id": 15,
          "name": "suppliers.delete"
        }
      ]
    }
  ]
}
```

## 📋 Formato de Permisos

Los permisos siguen el formato: `{resource}.{action}`

**Recursos:**
- `products` → Productos
- `categories` → Categorías
- `suppliers` → Proveedores
- `users` → Usuarios
- `roles` → Roles
- `settings` → Configuración

**Acciones:**
- `view` → Ver/Listar
- `create` → Crear
- `edit` → Editar
- `delete` → Eliminar
- `manage` → Todas las acciones (super permiso)

**Ejemplos de permisos:**
- `products.view` - Ver productos
- `suppliers.create` - Crear proveedores
- `users.delete` - Eliminar usuarios
- `products.manage` - Gestión completa de productos

## 🔧 Archivos de la Implementación

```
lib/casl/
├── ability.ts       # Lógica de permisos CASL
├── provider.tsx     # Provider React
└── index.ts         # Exportaciones

components/auth/
├── can-access.tsx              # Componentes helper
├── protected-route.tsx         # Protección de rutas
└── user-permissions-debug.tsx  # Debug de permisos

app/(dashboard)/
└── unauthorized/
    └── page.tsx     # Página de acceso denegado
```

## 🚀 Uso en la Aplicación

### 1. Provider ya está configurado

El `AbilityProvider` debe estar en tu layout principal:

```tsx
// app/layout.tsx o app/(dashboard)/layout.tsx
import { AbilityProvider } from '@/lib/casl'

export default function Layout({ children }) {
  return (
    <AbilityProvider>
      {children}
    </AbilityProvider>
  )
}
```

### 2. Uso en Componentes - Declarativo

```tsx
import { CanAccess } from '@/components/auth/can-access'

function ProductsPage() {
  return (
    <div>
      <h1>Productos</h1>
      
      {/* Solo muestra si tiene permiso suppliers.view */}
      <CanAccess action="view" subject="Supplier">
        <SupplierList />
      </CanAccess>
      
      {/* Solo muestra botón si tiene suppliers.create */}
      <CanAccess action="create" subject="Supplier">
        <Button>Crear Proveedor</Button>
      </CanAccess>
      
      {/* Con fallback personalizado */}
      <CanAccess 
        action="delete" 
        subject="Supplier"
        fallback={
          <p className="text-muted-foreground">
            No tienes permisos para eliminar proveedores
          </p>
        }
      >
        <Button variant="destructive">Eliminar</Button>
      </CanAccess>
    </div>
  )
}
```

### 3. Uso en Componentes - Hook Imperativo

```tsx
import { usePermission } from '@/components/auth/can-access'

function SupplierForm() {
  const canCreate = usePermission('create', 'Supplier')
  const canEdit = usePermission('edit', 'Supplier')
  const canDelete = usePermission('delete', 'Supplier')
  
  return (
    <form>
      {/* ... campos del formulario */}
      
      {canCreate && <Button type="submit">Crear</Button>}
      {canEdit && <Button type="submit">Actualizar</Button>}
      {canDelete && <Button variant="destructive">Eliminar</Button>}
    </form>
  )
}
```

### 4. Uso con CASL Can Component

```tsx
import { Can } from '@/lib/casl'

function Dashboard() {
  return (
    <div>
      <Can I="view" a="Product">
        <ProductsWidget />
      </Can>
      
      <Can I="view" a="Supplier">
        <SuppliersWidget />
      </Can>
    </div>
  )
}
```

### 5. Proteger Rutas Completas

```tsx
// app/(dashboard)/suppliers/page.tsx
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function SuppliersPage() {
  return (
    <ProtectedRoute 
      action="view" 
      subject="Supplier"
      redirectTo="/unauthorized"
    >
      <div>
        <h1>Proveedores</h1>
        <SupplierTable />
      </div>
    </ProtectedRoute>
  )
}
```

### 6. Verificar Roles

```tsx
import { hasRole, isAdmin } from '@/lib/casl'
import { useAuthStore } from '@/lib/store/auth'

function AdminPanel() {
  const user = useAuthStore((state) => state.user)
  
  if (!isAdmin(user)) {
    return <p>No eres administrador</p>
  }
  
  // O verificar rol específico
  if (hasRole(user, 'Manager')) {
    return <ManagerDashboard />
  }
  
  return <AdminDashboard />
}
```

### 7. Debug de Permisos (Desarrollo)

```tsx
import { UserPermissionsDebug } from '@/components/auth/user-permissions-debug'

// En cualquier página durante desarrollo
function SettingsPage() {
  return (
    <div>
      <h1>Configuración</h1>
      
      {/* Solo visible en development */}
      {process.env.NODE_ENV === 'development' && (
        <UserPermissionsDebug />
      )}
    </div>
  )
}
```

## 📖 Ejemplos Prácticos

### Tabla de Productos con Permisos

```tsx
import { CanAccess } from '@/components/auth/can-access'

function ProductTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <CanAccess action="view" subject="Product">
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.id}`}>
                        Ver Detalles
                      </Link>
                    </DropdownMenuItem>
                  </CanAccess>
                  
                  <CanAccess action="edit" subject="Product">
                    <DropdownMenuItem asChild>
                      <Link href={`/products/${product.id}/edit`}>
                        Editar
                      </Link>
                    </DropdownMenuItem>
                  </CanAccess>
                  
                  <CanAccess action="delete" subject="Product">
                    <DropdownMenuItem onClick={() => handleDelete(product.id)}>
                      Eliminar
                    </DropdownMenuItem>
                  </CanAccess>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

### Sidebar con Permisos

```tsx
import { Can } from '@/lib/casl'

function Sidebar() {
  return (
    <nav>
      <Can I="view" a="Product">
        <NavLink href="/products">Productos</NavLink>
      </Can>
      
      <Can I="view" a="Supplier">
        <NavLink href="/suppliers">Proveedores</NavLink>
      </Can>
      
      <Can I="view" a="User">
        <NavLink href="/users">Usuarios</NavLink>
      </Can>
    </nav>
  )
}
```

## 🔐 Mapeo de Permisos Laravel → CASL

| Permiso Laravel | Action CASL | Subject CASL |
|-----------------|-------------|--------------|
| `products.view` | `view` | `Product` |
| `products.create` | `create` | `Product` |
| `products.edit` | `edit` | `Product` |
| `products.delete` | `delete` | `Product` |
| `suppliers.view` | `view` | `Supplier` |
| `suppliers.create` | `create` | `Supplier` |
| `users.manage` | `manage` | `User` |

**Nota:** El permiso `manage` otorga automáticamente todos los permisos (view, create, edit, delete).

## ✅ Estado de la Implementación

- ✅ Estructura base de CASL
- ✅ Integración con Laravel Spatie Permission
- ✅ Mapeo automático de permisos
- ✅ Provider y contexto configurados
- ✅ Componentes helpers (CanAccess, usePermission)
- ✅ Protección de rutas
- ✅ Helpers de roles (hasRole, isAdmin)
- ✅ Debug component para desarrollo
- ✅ Carga de permisos en login
- ✅ Actualización de tipos TypeScript

## 🎯 Próximos Pasos

1. Agregar `<AbilityProvider>` al layout principal
2. Proteger rutas sensibles con `<ProtectedRoute>`
3. Usar `<CanAccess>` en componentes para condicionar UI
4. Agregar permisos a tablas y formularios
5. Configurar permisos en el sidebar/navegación
6. Crear roles y permisos en el backend según necesidades
