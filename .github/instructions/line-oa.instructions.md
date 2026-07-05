---
applyTo: "app/api/line/**,app/api/checkout/**,app/api/payment-slip/**,lib/**/*.ts"
---

# LINE OA / chatbot integration guidance

- For LINE OA features, implement webhook handling in app/api/line/webhook/route.ts and keep bot logic in lib/line-bot.ts or a similar shared module.
- Support LINE events such as follow, unfollow, text, and postback.
- Validate the webhook signature before processing any incoming event.
- Keep replies short, friendly, and Thai-friendly; use structured menus for product browsing and order help.
- Maintain conversation state per user ID and use a persistent store if the flow spans multiple turns.
- Connect bot actions to the real product catalog, stock data, promotions, and checkout flow rather than mock placeholders.
- Never expose LINE channel secrets, access tokens, or admin credentials in client-side code.
- Preserve the existing admin notification flow using LINE Notify as a non-blocking admin alert when appropriate.
