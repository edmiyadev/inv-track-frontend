# API Integration - Authentication

## Setup

1. Configure API URL in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Usage

### Login
```typescript
import { useAuthStore } from '@/lib/store/auth'

const login = useAuthStore((state) => state.login)
await login({ username: 'admin', password: 'admin123' })
```

### Logout
```typescript
const logout = useAuthStore((state) => state.logout)
await logout()
```

### Get Current User
```typescript
const user = useAuthStore((state) => state.user)
const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
```

### Authenticated Requests
```typescript
import { authFetch } from '@/lib/api'

// GET request
const products = await authFetch.get('/products')

// POST request
const newProduct = await authFetch.post('/products', { name: 'Product 1' })

// PUT request
const updated = await authFetch.put('/products/1', { name: 'Updated' })

// DELETE request
await authFetch.delete('/products/1')
```

### Using the Hook
```typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, logout, isAuthenticated } = useAuth()
  
  return (
    <div>
      {isAuthenticated && <p>Welcome {user?.username}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## Features

- ✅ Zustand for state management
- ✅ Automatic token refresh
- ✅ Persistent authentication
- ✅ Protected routes
- ✅ Auto retry on 401 errors
- ✅ Type-safe API client
