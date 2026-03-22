# Frontend Rules

These rules apply to UI work in this repository.

## Stack And Structure

- The main UI uses the Pages Router under `pages/`.
- Keep page-level behavior in hooks under `hooks/` when the screen has meaningful state or API interaction.
- Prefer existing file placement:
  - `pages/`: screens
  - `components/features/`: page-specific components
  - `components/ui/`: shared UI wrappers
  - `hooks/`: UI state and API calls
  - `types/`: shared DTOs and UI data types

## Components And UI

- Reuse existing shared UI components first:
  - `SButton`
  - `SInput`
  - `SModal`
  - `SToggleButton`
- Use Ant Design for layout and form composition:
  - `Form`, `Card`, `Row`, `Col`, `Select`, `Alert`, `Table`, `Skeleton`, `Statistic`
- Do not build raw HTML forms when Ant Design or an existing shared component already solves the problem.
- Keep pages aligned with the current system style:
  - rounded cards
  - subtle borders
  - consistent spacing
  - support for light and dark themes
- Global styles belong in `pages/_app.tsx`. Do not introduce page-local CSS files unless necessary.

## Data Flow

- Frontend API calls must go through `lib/api-calling.ts`.
- Use the shared axios client from `lib/api.ts`.
- Do not scatter direct `axios` or `fetch` calls across pages/components.
- When auth/profile state changes, keep `localStorage` keys like `token` and `user` in sync with the current flow.

## Forms

- Prefer Ant Design `Form` for non-trivial forms.
- Use shared UI wrappers inside forms where available.
- Keep loading, submit, and error state in hooks.
- For edit forms:
  - preload existing data
  - expose a clear cancel or reset path
  - avoid client-trusting fields that should come from auth context

## Checklists

### New Page Checklist

- Add the screen under `pages/`.
- Reuse existing layout and spacing patterns from current pages.
- Put page behavior in a hook under `hooks/` if the page has real state or API calls.
- Use Ant Design for layout and shared `components/ui` wrappers where applicable.
- Route all API requests through `lib/api-calling.ts`.
- Verify the page works in both light and dark themes.

### Form Checklist

- Use Ant Design `Form` for structure.
- Use shared inputs/buttons where available.
- Preload values for edit mode.
- Handle loading, success, and error states.
- Keep mutation logic in a hook, not directly in the page component.
- Make sure the submitted payload matches the DTO in `types/`.

## Avoid

- Do not add a second design system.
- Do not put business rules in React components.
- Do not call Prisma or server-only code from frontend code.
