---
applyTo: "**/*.{ts,tsx,js,jsx,md,prisma}"
---

# Project architecture guidance

- This repository is a Next.js 16 App Router e-commerce app for Highbury International.
- Keep route handlers in app/api, UI pages in app/(storefront) or app/admin, and shared UI in components.
- Reuse existing utilities from lib before creating new helpers.
- Follow the existing path alias pattern using @/.
- Validate request payloads with Zod and keep business logic server-side.
- Prefer Prisma client queries over raw SQL unless a migration or analytics task requires it.
- Preserve the current Thai-first user experience and avoid introducing English-only copy into core flows.
- When adding new features, align them with the existing order, inventory, promotion, and notification flows.
