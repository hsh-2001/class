# Backend Rules

These rules apply to API and persistence work in this repository.

## Layering

- Keep the backend flow as:
  - `app/api/**/route.ts`
  - `services/`
  - `repositories/`
- Route handlers stay thin:
  - parse request
  - validate required fields
  - call service layer
  - return shared API response helpers
- Business logic belongs in `services/`.
- Prisma reads and writes belong in `repositories/`.
- Do not access Prisma directly from route handlers or services.

## API Conventions

- API endpoints live in `app/api/**/route.ts`.
- Always use `ok` and `fail` from `lib/api-response.ts`.
- Keep request/response DTOs in `types/`.
- Prefer narrow DTOs for mutations instead of reusing broad database-shaped objects.

## Auth And Request Context

- Authenticated requests are processed through `proxy.ts`.
- The authenticated user payload is forwarded via `X-User`.
- Use `getUserFromHeader` from `types/baseApi.ts` in authenticated route handlers.
- Do not trust client-sent `userId`, `schoolId`, or role values when they can be derived from auth context.

## Prisma And Types

- Match Prisma-generated enums for fields like role and gender.
- Map database records to response DTOs in the service layer when needed.
- Keep repository methods focused and composable.
- If schema changes affect generated types, run:
  - `pnpm prisma:validate`
  - `pnpm prisma:generate`

## Checklists

### New API Endpoint Checklist

- Add the route under `app/api/**/route.ts`.
- Parse request input and validate required fields in the route handler.
- Delegate business logic to `services/`.
- Delegate Prisma access to `repositories/`.
- Return responses through `ok` and `fail`.
- For authenticated routes, resolve the user from `X-User` via `getUserFromHeader`.

### New Repository/Service Flow Checklist

- Add DTOs or response types in `types/` first.
- Keep repository methods focused on persistence only.
- Use the service layer to map DB records to API-friendly response shapes.
- Avoid trusting client identifiers when auth context already provides them.
- Run `pnpm prisma:generate` if Prisma-related types changed.

## Avoid

- Do not move database logic into React hooks, pages, or route handlers.
- Do not return ad hoc response shapes from APIs.
- Do not introduce broad refactors unless requested.
