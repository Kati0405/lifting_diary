# Data Fetching

## Core Rule: Server Components Only

**ALL data fetching must be done exclusively via Server Components.**

- ❌ Do NOT fetch data in Route Handlers (`app/api/`)
- ❌ Do NOT fetch data in Client Components (`"use client"`)
- ❌ Do NOT use `useEffect` + `fetch` patterns
- ❌ Do NOT use SWR, React Query, or any client-side fetching library
- ✅ Fetch data in `page.tsx`, `layout.tsx`, or any other Server Component by calling helper functions from `/data`

## Database Access: `/data` Directory

All database queries must go through helper functions in the `/data` directory. These functions use **Drizzle ORM** — never raw SQL.

### Rules

- **No raw SQL.** Use Drizzle's query builder exclusively.
- **Every helper function must scope queries to the authenticated user.** A logged-in user must never be able to read or modify another user's data.
- Always accept `userId` as an explicit parameter and include it as a `where` condition in every query.

### Example Structure

```
src/
  data/
    workouts.ts     # getWorkouts(userId), getWorkoutById(userId, id), ...
    exercises.ts    # getExercises(userId), ...
    sets.ts         # getSetsForWorkout(userId, workoutId), ...
```

### Example Helper

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getWorkoutById(userId: string, workoutId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
}
```

The `userId` filter is **mandatory** on every query. Omitting it is a security bug.

### Example Server Component

```tsx
// src/app/workouts/[id]/page.tsx
import { getWorkoutById } from "@/data/workouts";
import { auth } from "@/auth";

export default async function WorkoutPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const workout = await getWorkoutById(session.user.id, params.id);
  // render ...
}
```

## Summary

| Concern | Where it lives |
|---|---|
| Fetching data | Server Component (`page.tsx`, `layout.tsx`, etc.) |
| Database queries | `/data/*.ts` helper functions |
| ORM | Drizzle ORM only — no raw SQL |
| Data scoping | Every query filters by `userId` |
