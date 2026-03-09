# 🧹 Guía de Código Limpio - InvTrack

## ✅ Paquetes y Herramientas Oficiales a Usar

### 📋 Formularios
**USAR:** `react-hook-form` + `zod`
- ✅ Ya instalado y configurado
- ✅ Validación con TypeScript
- ✅ Performance optimizado
- ❌ NO crear hooks personalizados de formularios
- ❌ NO usar `useState` manual para formularios

**Ejemplo correcto:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
})

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})
```

### 🔐 Autenticación y Estado Global
**USAR:** `zustand` con `persist`
- ✅ Store: `lib/store/auth.ts`
- ✅ Hook: `useAuthStore` (directo)
- ❌ NO crear Context API para auth
- ❌ NO crear wrappers sobre Zustand
- ❌ NO usar localStorage manual

**Ejemplo correcto:**
```typescript
import { useAuthStore } from '@/lib/store/auth'

// En componentes
const user = useAuthStore((state) => state.user)
const login = useAuthStore((state) => state.login)
const logout = useAuthStore((state) => state.logout)
```

### 🌐 Llamadas a API
**USAR:** `lib/api/client.ts`
- ✅ Cliente centralizado con interceptores
- ✅ Manejo automático de tokens
- ✅ Tipos TypeScript
- ❌ NO usar fetch directamente
- ❌ NO crear wrappers de axios/fetch

**Ejemplo correcto:**
```typescript
import { apiClient } from '@/lib/api/client'

// Las funciones ya incluyen el token automáticamente
const data = await apiClient.get('/api/products', token)
```

### 🎨 UI Components
**USAR:** `shadcn/ui`
- ✅ Componentes en `components/ui/`
- ✅ Consistencia visual
- ✅ Accesibilidad integrada
- ❌ NO crear componentes básicos desde cero
- ❌ NO usar librerías adicionales de UI

### 🛣️ Protección de Rutas
**USAR:** `AuthGuard` + `AuthInitializer`
- ✅ `components/auth/auth-guard.tsx` - Protección de rutas
- ✅ `components/auth/auth-initializer.tsx` - Inicialización
- ❌ NO crear HOCs personalizados
- ❌ NO usar middleware manual

## 🗑️ Código Eliminado (No Volver a Crear)

### ❌ Eliminados - NO recrear:
1. ~~`hooks/use-form-submit.ts`~~ - Ya tenemos `react-hook-form`
2. ~~`hooks/use-auth.ts`~~ - Usar `useAuthStore` directo
3. ~~`components/providers/auth-provider.tsx`~~ - Ya tenemos Zustand
4. ~~`components/auth/protected-route.tsx`~~ - Ya tenemos `AuthGuard`
5. ~~`hooks/use-token-refresh.ts`~~ - No necesario con Laravel Sanctum
6. ~~`lib/api/authenticated-fetch.ts`~~ - No necesario con Sanctum

## 📁 Estructura de Carpetas Estándar

```
app/
├── (auth)/          # Rutas públicas (login)
├── dashboard/       # Rutas protegidas
└── layout.tsx       # AuthInitializer aquí

components/
├── auth/            # AuthGuard, AuthInitializer
├── layout/          # Header, Sidebar, MobileNav
├── ui/              # shadcn components
└── [feature]/       # Componentes por feature

lib/
├── api/             # Cliente API y endpoints
├── store/           # Zustand stores
└── utils.ts         # Utilidades compartidas
```

## 🎯 Principios de Código Limpio

### 1. **DRY (Don't Repeat Yourself)**
- ✅ Si algo existe, úsalo
- ❌ No duplicar funcionalidad

### 2. **Single Source of Truth**
- ✅ Una sola forma de hacer autenticación (Zustand)
- ✅ Un solo cliente API
- ✅ Un solo sistema de formularios

### 3. **Prefer Libraries Over Custom Code**
- ✅ Usar paquetes bien mantenidos
- ❌ No reinventar la rueda

### 4. **Type Safety**
- ✅ TypeScript estricto
- ✅ Interfaces en `lib/api/types.ts`
- ❌ No usar `any`

## 🔍 Checklist Antes de Agregar Código

Antes de crear nuevo código, pregúntate:

1. ✅ ¿Ya existe un paquete que haga esto?
2. ✅ ¿Ya existe un hook/función en el proyecto?
3. ✅ ¿Puedo reutilizar código existente?
4. ✅ ¿Es realmente necesario o es sobre-ingeniería?
5. ✅ ¿Estoy duplicando funcionalidad?

## 📊 Stack Tecnológico Oficial

### Core
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Estado y Datos
- **State Management**: Zustand + persist
- **Forms**: React Hook Form + Zod
- **API Client**: Custom fetch wrapper

### UI
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Themes**: next-themes

### Backend Integration
- **API**: Laravel + Sanctum
- **Auth**: Bearer Token (long-lived)
- **No refresh tokens** (Sanctum uses long-lived tokens)

## 🚫 Código a Evitar

### ❌ NO Crear:
```typescript
// ❌ Custom form hooks
export function useFormSubmit() { ... }

// ❌ Auth wrappers
export function useAuth() { 
  const store = useAuthStore()
  return store // Usar useAuthStore directo
}

// ❌ API wrappers innecesarios
export async function authenticatedRequest() { ... }

// ❌ Context para estado global
const AuthContext = createContext() // Usar Zustand
```

### ✅ SÍ Usar:
```typescript
// ✅ React Hook Form directo
const { register, handleSubmit } = useForm()

// ✅ Zustand directo
const user = useAuthStore((state) => state.user)

// ✅ API Client
await apiClient.get('/endpoint', token)

// ✅ Zustand para estado global
export const useAuthStore = create(...)
```

## 📝 Comandos Útiles

```bash
# Buscar imports no usados
npx depcheck

# Buscar código muerto
npx unimported

# Verificar tipos
npm run type-check

# Lint
npm run lint
```

## 🎓 Recursos

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Última actualización**: Noviembre 6, 2025
**Mantenedor**: Team InvTrack
