---
"@area44/oxlint": minor
---

Synchronize `@area44/oxlint` with Ultracite 8.1.0 as the upstream source of truth.
- Deduplicate core rules against upstream.
- Restrict Next.js framework override scoping to application routes and middleware files to prevent false positives in generic React projects.
- Preserve canonical ignore patterns (.github/ ignore, specific generated declaration ignores).
- Note: This package replaces legacy `@area44/oxlint-config`.
