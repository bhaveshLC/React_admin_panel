# React Admin Panel (Vite + TypeScript)

Production-ready admin panel scaffold with authentication, protected routes, reusable table layer, and complete **Events** CRUD module.

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
 │         └── EventFormModal.tsx
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

## 5) Full Example Included

- **Events module is fully implemented** in `pages/Events.tsx`:
  - Fetch list
  - Create event modal
  - Edit event modal with prefilled data
  - Delete confirmation + delete API call
  - Success/error toasts

## 6) Reusable Generic Pattern for Investors and Startups

Use the same pattern as Events:

1. Create a Zod schema + RHF modal component for that model.
2. Create a columns config array for the model in its page.
3. Reuse:
   - `DataTable`
   - `DeleteConfirmDialog`
   - same `modalOpen`, `selected`, `deleteTarget` state pattern
4. Wire CRUD services from `services/api.ts`.

`Investors.tsx` and `Startups.tsx` already show the table/fetch/search wiring and are ready to be extended with full modal CRUD.

## 7) Architecture Notes

- Type-safe domain models in `types/models.ts`
- Feature pages own data orchestration
- Reusable UI + table + modal components
- All API interactions centralized in `services/api.ts`
- Router-level auth protection via `PrivateRoute`
- Scalable path aliases (`@/`) configured in `vite.config.ts` and `tsconfig.json`

