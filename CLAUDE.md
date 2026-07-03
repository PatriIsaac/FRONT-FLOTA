# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frontend-only web app for **FleetSys**, a fleet-management system. It consumes an
HTTP API served by a **separate** backend repo (`../ProyectoFlota`, Express +
Prisma + PostgreSQL). This repo contains no API or database code — only the
React client that calls it.

## Commands

```bash
npm run dev      # Vite dev server (http://localhost:5173)
npm run build    # tsc -b (type-check) then vite build
npm run preview  # serve the production build
npm run lint     # ESLint
```

There is **no test setup** in this repo — no test runner, no `test` script. Do
not assume tests exist.

To run the app end-to-end the backend must be running (default
`http://localhost:3000`) and reachable via `VITE_API_URL`. Create a `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

Note: the fallback in `src/services/api.ts` is `http://localhost:3001/api`, which
does **not** match the backend's default port 3000 — always rely on `.env`.

## Architecture

**Provider stack** (`src/main.tsx`): `ThemeProvider` → `QueryClientProvider`
(TanStack Query) → `AuthProvider` → `RouterProvider`. A `react-hot-toast`
`<Toaster>` is mounted globally.

**Data flow — the pattern every feature follows:**
1. `src/services/api.ts` — the single axios instance. `baseURL` from
   `VITE_API_URL`. A request interceptor injects `Authorization: Bearer <token>`
   from `localStorage`; a response interceptor catches `401`, clears the token,
   and redirects to `/login`.
2. `src/services/<domain>.service.ts` — one file per backend resource
   (`vehiculo`, `conductor`, `movimiento`, `abastecimiento`, `mantenimiento`,
   `costo`, `indicador`, ...). Each exports an object of async methods
   (`getAll/getById/create/update/delete`) that call `api` and return typed data.
   REST methods vary per backend route (e.g. vehículos uses `PATCH` for update).
3. Pages call services through **TanStack Query** — `useQuery` for reads
   (keyed by `queryKey: ['<domain>']`), `useMutation` for writes that
   `queryClient.invalidateQueries` on success. See
   `src/pages/configuracion/Vehiculos/VehiculosList.tsx` as the reference CRUD page.
4. Types live in `src/types/<domain>.ts` (entity + `Create*DTO` / `Update*DTO`).

**Auth** (`src/context/AuthContext.tsx`, `src/hooks/useAuth.ts`): token + user
stored in `localStorage`, rehydrated on mount. `isAuthenticated` gates routes via
`src/router/PrivateRoute.tsx`. Note the `User` type carries both English and
Spanish field aliases (`name`/`nombre`, `role`/`rol`) — the backend field naming
is inconsistent, so read defensively.

**Routing** (`src/router/index.tsx`): a single `createBrowserRouter`. `/login` is
public; everything else is nested under `PrivateRoute` → `MainLayout`. Routes are
grouped by business domain: `seguridad`, `configuracion`, `operacion`,
`abastecimiento`, `mantenimiento`, `costos`, `administrativa`, `inventario`.
Not-yet-built screens render a placeholder `GenericPage`.

**UI conventions:**
- Reusable primitives in `src/components/ui/` (`Card`, `Button`, `DataTable`,
  `Badge`, ...). List screens render tables via `DataTable` with a `columns`
  array where each column can supply a `render` function.
- Confirmation dialogs and success/error notifications go through
  `src/utils/alerts.ts` (SweetAlert2 wrapper) — e.g. `await alerts.delete(...)`
  returns a boolean, `alerts.success(...)` / `alerts.error(...)`. Prefer these
  over ad-hoc `sweetalert2` / `toast` calls to stay consistent.
- Tailwind CSS v4 (via `@tailwindcss/vite`, no `tailwind.config` needed).
- Forms use `react-hook-form` + `zod` (`@hookform/resolvers`).

## Conventions

- UI text, route paths, and domain names are in **Spanish**; match the existing
  vocabulary (`vehiculos`, `conductores`, `abastecimiento`, etc.).
- When adding a feature: create/extend the `*.service.ts`, add its `types/`,
  build the page with `useQuery`/`useMutation`, register the route in
  `src/router/index.tsx`.
