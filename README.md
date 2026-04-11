# InvTrack Frontend

Frontend de InvTrack construido con Next.js.

## Requisitos

1. Docker y Docker Compose instalados.
2. (Opcional) Node.js 20+ si quieres ejecutar sin Docker.

## Variables de entorno

1. Copia el archivo de ejemplo:

```bash
cp .env.example .env
```

2. Configura `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Variable disponible

| Variable | Obligatoria | Ejemplo | Descripción |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Sí | `http://localhost:8000/api` | URL base del backend API consumida por el frontend. |

## Levantar en desarrollo (Docker)

1. Configura `.env` como se indicó arriba.
2. Construye e inicia el contenedor:

```bash
docker compose -f compose.dev.yaml up -d --build
```

3. Abre la app en:

```text
http://localhost:3000
```

4. Ver logs (opcional):

```bash
docker compose -f compose.dev.yaml logs -f next-app
```

5. Detener el entorno:

```bash
docker compose -f compose.dev.yaml down
```

## Levantar en producción (Docker)

1. Define `.env` con la URL real de tu API (ejemplo):

```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
```

2. Construye e inicia en modo producción:

```bash
docker compose -f compose.prod.yaml up -d --build
```

3. Verifica que responde:

```bash
curl -I http://localhost:3000
```

4. Ver logs (opcional):

```bash
docker compose -f compose.prod.yaml logs -f next-app
```

5. Detener producción:

```bash
docker compose -f compose.prod.yaml down
```

## Comandos útiles

```bash
# Reiniciar desarrollo
docker compose -f compose.dev.yaml down && docker compose -f compose.dev.yaml up -d --build

# Reiniciar producción
docker compose -f compose.prod.yaml down && docker compose -f compose.prod.yaml up -d --build
```
