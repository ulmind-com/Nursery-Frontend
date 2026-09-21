# Coding Rules — Nursery Frontend

## General
- Use **TypeScript** for all files. No `any` types unless absolutely necessary.
- Use **functional components** with hooks. No class components.
- Keep components focused and single-responsibility.

## File & Naming Conventions
- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Hooks: `use-*.ts` with `use` prefix (e.g., `use-debounce.ts`)
- Utils/lib: `kebab-case.ts` (e.g., `api.ts`, `firebase.ts`)
- Routes: Follow TanStack Router file-based convention (e.g., `account.orders.$id.tsx`)

## Styling
- Use **Tailwind CSS** utility classes for all styling.
- Use **shadcn/ui** components from `@/components/ui/` for standard UI elements.
- Use **Radix UI** primitives for accessible interactive components.
- Avoid inline `style={}` attributes.

## State Management
- **Server state**: Use `@tanstack/react-query` with proper query keys via `queryKeys` object in `services.ts`.
- **Auth state**: Use `AuthContext` (`useAuth` hook).
- **Cart state**: Use `CartContext` (`useCart` hook).
- Avoid prop drilling — use Context or query hooks.

## API Calls
- All API calls go through `src/api/services.ts` — never call `axios` directly from components.
- Use the centralized `api` instance from `src/lib/api.ts`.
- API base URL comes from `VITE_API_BASE_URL` env variable.
- Handle errors with `normalizeApiError()` from `lib/api.ts`.

## Authentication
- Firebase SDK handles Google Sign-In popup.
- Backend verifies Firebase ID tokens at `/auth/firebase`.
- JWT token stored via `tokenStore` (localStorage).
- Auto-attached to requests via Axios interceptor.

## Imports
- Use `@/` path alias for absolute imports (e.g., `@/components/ui/button`).
- Group imports: React/libs → components → hooks → utils → types.

## Error Handling
- Use `toast` (sonner) for user-facing errors.
- Use `normalizeApiError()` to extract readable messages from API errors.
- Handle popup-closed-by-user silently in Google Sign-In.

## Git
- Do NOT force push or rebase published history (Lovable sync requirement).
- Use conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`.
- Keep `.env` values as placeholders in git — real secrets go in Netlify env vars.

## Performance
- Use `React.lazy()` for heavy route components if needed.
- Images should use Cloudinary URLs with transformations.
- Avoid unnecessary re-renders — memoize with `useMemo`/`useCallback` where needed.
