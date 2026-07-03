# FRONT-FLOTA — FleetSys (Frontend)

Interfaz web del sistema de gestión de flota **FleetSys**. Es **solo el frontend**;
consume por HTTP la API del backend, que vive en un repositorio separado
(`ProyectoFlota`, Express + Prisma + PostgreSQL).

## Stack

- **React 19** + **TypeScript** + **Vite**
- **React Router** (rutas privadas con JWT)
- **TanStack Query** + **axios** para el acceso a datos
- **Tailwind CSS**, **react-hook-form** + **zod**, **recharts**, **sweetalert2**

## Cómo se conecta con el backend

Toda petición pasa por el cliente axios en `src/services/api.ts`:

- `baseURL` = variable de entorno `VITE_API_URL` (fallback `http://localhost:3001/api`).
- El JWT se guarda en `localStorage` y un interceptor lo envía como
  `Authorization: Bearer <token>` en cada request.
- Si el backend responde `401`, el front borra el token y redirige a `/login`.

Cada módulo tiene su servicio en `src/services/*.service.ts`
(`auth`, `vehiculo`, `conductor`, `movimiento`, `abastecimiento`, `mantenimiento`,
`costo`, `indicador`, etc.), que corresponden a las rutas `/api/...` del backend.

## Requisitos previos

- Node.js 20+
- El **backend** corriendo (por defecto en `http://localhost:3000`). Ver el repo
  `ProyectoFlota`: necesita su `.env` con `DATABASE_URL`, `npx prisma generate`,
  migraciones y `npm run seed` antes de `npm run start:dev`.

## Configuración

Crea un archivo `.env` en la raíz apuntando a tu backend:

```
VITE_API_URL=http://localhost:3000/api
```

## Ejecutar en local

```bash
npm install
npm run dev      # http://localhost:5173
```

Abre la URL de Vite y entra por `/login`. Las credenciales de prueba las crea el
`prisma/seed.ts` del backend.

## Scripts

| Comando           | Qué hace                                  |
|-------------------|-------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con HMR            |
| `npm run build`   | Type-check (`tsc -b`) + build de producción |
| `npm run preview` | Sirve el build de producción              |
| `npm run lint`    | ESLint                                     |

## Estructura

```
src/
  services/    Cliente axios (api.ts) + un servicio por módulo
  pages/       Vistas por dominio (operacion, mantenimiento, costos, inventario, seguridad, ...)
  components/  Componentes reutilizables (incl. ui/)
  context/     AuthContext, ThemeContext
  router/      Definición de rutas + PrivateRoute (guard de JWT)
  hooks/  types/  utils/
```
