---
applyTo: "prisma/**/*.prisma,lib/prisma.ts,app/api/**/*.ts"
---

# Prisma and PostgreSQL guidance

- Use Prisma client from lib/prisma.ts for database access.
- Keep schema changes in prisma/schema.prisma and add or update migrations when the data model changes.
- Prefer Prisma relation queries and include statements over manually composing joins.
- Use transactions for stock updates, inventory changes, and order creation to avoid inconsistent state.
- Keep the implementation compatible with PostgreSQL in production and SQLite in development.
- Avoid breaking existing model names and relation patterns unless the change is intentional and migration-safe.
- When adding bot or admin features, fetch from real Prisma models such as Product, ProductVariant, Inventory, Order, and Promotion.
