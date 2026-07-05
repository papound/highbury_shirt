---
applyTo: "app/admin/**,app/api/admin/**,components/admin/**"
---

# Admin operations guidance

- Admin-facing features must respect the existing role model and permission boundaries.
- Keep inventory, order status, and promotion updates auditable and transaction-safe.
- Reuse existing admin components and dialogs in components/admin before creating new UI patterns.
- Preserve the current Thai admin experience and keep labels and messaging consistent.
- For new admin workflows, ensure they fit the current structure of dashboard, products, inventory, orders, promotions, reports, and settings.
- Do not bypass existing validation or permission checks when adding new admin actions.
