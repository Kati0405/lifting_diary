# Routing Coding Standards

## Route Structure

**All app routes live under `/dashboard`.**

- ❌ Do NOT create top-level feature routes (e.g. `/workouts`, `/profile`).
- ✅ All feature pages must be nested under `/dashboard` (e.g. `/dashboard/workouts`, `/dashboard/profile`).

```
src/app/
  dashboard/
    page.tsx                      # /dashboard
    layout.tsx                    # shared layout for all dashboard routes
    workout/
      page.tsx                    # /dashboard/workout
      [workoutId]/
        page.tsx                  # /dashboard/workout/:workoutId
```

## Route Protection

**All `/dashboard` routes are protected — only signed-in users may access them.**

Protection is enforced exclusively via Next.js middleware (`src/middleware.ts`). Do not add redirect logic inside individual page components.

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

- Routes are **protected by default**. Only routes explicitly listed in `isPublicRoute` are accessible without authentication.
- `/dashboard` and all sub-routes are protected automatically — no additional per-page guards needed.
- See `auth.md` for Clerk setup, environment variables, and sign-in/sign-up page conventions.

## Public Routes

The only public routes are:

| Path | Purpose |
|---|---|
| `/` | Landing / marketing page |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |

Any new public route must be explicitly added to the `isPublicRoute` matcher in `src/middleware.ts`.

## Summary

| Concern | Rule |
|---|---|
| Feature routes | Must be nested under `/dashboard` |
| Route protection | Middleware only (`src/middleware.ts`) — no per-page redirects |
| Auth provider | Clerk — see `auth.md` |
| New public routes | Must be added to `isPublicRoute` in middleware |
