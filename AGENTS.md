# Repository Guidance

Follow the project-specific rules in:

- [`.codex/frontend-rules.md`](/Users/senghong/Repos/2026/class/.codex/frontend-rules.md)
- [`.codex/backend-rules.md`](/Users/senghong/Repos/2026/class/.codex/backend-rules.md)

## Defaults

- Use `pnpm` for dependency management and script execution.
- Preserve the existing stack: Next.js 16, React 19, TypeScript, Prisma, PostgreSQL, Ant Design.
- Prefer small, targeted changes that fit the existing structure.
- Keep shared DTOs and domain types in `types/`.
- Validate changes with the smallest relevant checks first:
  - `pnpm lint`
  - `npx tsc --noEmit`

## Architecture Summary

- Frontend screens are primarily under `pages/`.
- Frontend API calls go through `lib/api-calling.ts` and `lib/api.ts`.
- Backend work should follow `route -> service -> repository`.
- Prisma usage belongs in `repositories/`.
