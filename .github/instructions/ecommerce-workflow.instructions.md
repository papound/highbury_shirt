---
applyTo: "app/api/checkout/**,app/api/promotions/**,app/api/account/**,lib/**/*.ts"
---

# E-commerce workflow guidance

- Build new commerce features around the existing order lifecycle: browse product, check stock, apply promotion, create order, upload payment proof, and confirm payment.
- Always verify inventory availability before accepting an order.
- Reuse existing helpers for promotions, shipping, PromptPay, and notification logic instead of reimplementing them.
- Keep order creation transactional and consistent with Prisma models such as Order and OrderItem.
- Return clear structured JSON responses for checkout and order-related APIs.
- Make customer-facing messages reflect the actual business rules of the shop, including stock limits and delivery method choices.
- Avoid introducing flows that bypass the current checkout and payment process.
