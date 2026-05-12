# Auth Coding Standards

## Provider: Clerk

**This app uses [Clerk](https://clerk.com/) exclusively for authentication.**

- ❌ Do NOT implement custom auth logic, session handling, or JWT parsing.
- ❌ Do NOT use NextAuth, Auth.js, or any other auth library.
- ✅ Use Clerk's SDK (`@clerk/nextjs`) for all authentication needs.

## Getting the Current User

### In Server Components (preferred)

Use `auth()` from `@clerk/nextjs/server` to get the `userId`. This is the standard pattern for passing a user identity down to `/data` helpers.

```ts
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    // user is not signed in — redirect or return early
    redirect("/sign-in");
  }

  const data = await getSomeData(userId);
  // render ...
}
```

- Use `auth()` when you only need the `userId` (the common case).
- Use `currentUser()` only when you need the full user profile (name, email, etc.) — it makes an extra network request to Clerk's API.

### In Client Components

Use the `useAuth()` or `useUser()` hooks from `@clerk/nextjs`.

```tsx
"use client";
import { useAuth } from "@clerk/nextjs";

export function MyClientComponent() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  // ...
}
```

Client Components should not perform data fetching (see `data-fetching.md`). Limit hook usage to reading auth state for conditional UI rendering only.

## Route Protection

### Middleware

Protect routes via Clerk's middleware in `src/middleware.ts`. Do not implement manual redirect logic inside individual pages.

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

- All routes are **protected by default** unless explicitly listed as public.
- The sign-in and sign-up pages are the only public routes unless otherwise specified.

## Sign-In / Sign-Up UI

Use Clerk's hosted components — do not build custom sign-in or sign-up forms.

```
src/app/sign-in/[[...sign-in]]/page.tsx   # renders <SignIn />
src/app/sign-up/[[...sign-up]]/page.tsx   # renders <SignUp />
```

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

## Environment Variables

Clerk requires these variables in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

Never commit secret keys. The `NEXT_PUBLIC_` prefix exposes a variable to the browser — only the publishable key should carry it.

## Summary

| Concern | Solution |
|---|---|
| Auth provider | Clerk (`@clerk/nextjs`) |
| Server-side user identity | `auth()` → `userId` |
| Full user profile (server) | `currentUser()` |
| Client-side auth state | `useAuth()` / `useUser()` hooks |
| Route protection | Clerk middleware (`src/middleware.ts`) |
| Sign-in / sign-up UI | Clerk hosted `<SignIn />` / `<SignUp />` components |
