# React Admin Panel (Vite + TypeScript)

Production-ready admin panel scaffold with authentication, protected routes, reusable table layer, and complete CRUD modules for **Events, Investors, and Startups**.

## 1) Project Setup Steps

1. Create `.env` file:
   ```bash
   VITE_API_BASE_URL=https://your-api-base-url
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## 2) Required Dependencies

Main stack included in `package.json`:
- React + Vite + TypeScript
- TailwindCSS
- ShadCN-style UI primitives (Radix + utility components)
- React Hook Form + Zod
- Axios (with request/response interceptors)
- React Router DOM
- TanStack Table
- Lucide React
- Sonner

## 3) Folder Structure

```txt
src/
 ├── components/
 │    ├── layout/
 │    │    └── DashboardLayout.tsx
 │    ├── ui/
 │    │    ├── alert-dialog.tsx
 │    │    ├── button.tsx
 │    │    ├── card.tsx
 │    │    ├── dialog.tsx
 │    │    ├── input.tsx
 │    │    ├── select.tsx
 │    │    ├── skeleton.tsx
 │    │    └── textarea.tsx
 │    ├── tables/
 │    │    └── DataTable.tsx
 │    └── modals/
 │         ├── DeleteConfirmDialog.tsx
 │         ├── EventFormModal.tsx
 │         ├── InvestorFormModal.tsx
 │         └── StartupFormModal.tsx
 ├── pages/
 │    ├── Login.tsx
 │    ├── Events.tsx
 │    ├── Investors.tsx
 │    └── Startups.tsx
 ├── services/
 │    └── api.ts
 ├── routes/
 │    └── PrivateRoute.tsx
 ├── types/
 │    └── models.ts
 ├── lib/
 │    └── utils.ts
 ├── App.tsx
 ├── main.tsx
 └── index.css
```

## 4) Important Reusable Components

- `components/tables/DataTable.tsx`
  - Generic TanStack table
  - Search filtering
  - Sorting + pagination
  - Empty states + loading skeletons

- `components/modals/EventFormModal.tsx`
  - RHF + Zod modal form pattern
  - Create/edit support through `initialData`

- `components/modals/DeleteConfirmDialog.tsx`
  - Reusable delete confirmation dialog

- `services/api.ts`
  - Shared axios instance
  - JWT interceptor
  - 401 global redirect to login

## 5) Full Implementations Included

- **Events module** in `pages/Events.tsx` with create/edit/delete + table actions.
- **Investors module** in `pages/Investors.tsx` with create/edit/delete + table actions.
- **Startups module** in `pages/Startups.tsx` with create/edit/delete + table actions.
- Reusable model-specific modal forms in `components/modals/` with RHF + Zod and loading/error handling.

## 6) Reusable Generic Pattern for New Modules

Use the same pattern implemented by all three current modules:

1. Build a Zod schema + RHF modal component for the entity.
2. Define TanStack columns and include an `actions` cell.
3. Reuse `DataTable` and `DeleteConfirmDialog`.
4. Manage `modalOpen`, `selected`, and `deleteTarget` local states.
5. Wire list/create/update/remove methods from `services/api.ts`.

## 7) Architecture Notes

- Type-safe domain models in `types/models.ts`
- Feature pages own data orchestration
- Reusable UI + table + modal components
- All API interactions centralized in `services/api.ts`
- Router-level auth protection via `PrivateRoute`
- Scalable path aliases (`@/`) configured in `vite.config.ts` and `tsconfig.json`

