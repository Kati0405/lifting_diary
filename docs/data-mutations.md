# Data Mutations

## Core Rules

**ALL data mutations must follow this two-layer pattern:**

1. **`/data` helpers** — thin functions that wrap Drizzle ORM calls (insert, update, delete)
2. **Server Actions** — the only entry point for triggering mutations, defined in colocated `actions.ts` files

- ❌ Do NOT mutate data directly from components
- ❌ Do NOT call Drizzle from Server Actions directly — go through `/data` helpers
- ❌ Do NOT use `FormData` as a Server Action parameter type
- ❌ Do NOT skip Zod validation in Server Actions
- ✅ Mutate data by calling `/data` helpers from Server Actions
- ✅ Validate all Server Action arguments with Zod before doing anything else

## `/data` Mutation Helpers

Mutation helpers live alongside query helpers in the `/data` directory. They use **Drizzle ORM** — never raw SQL.

### Rules

- **No raw SQL.** Use Drizzle's query builder exclusively.
- **Every helper must scope mutations to the authenticated user.** Always include `userId` in `where` conditions for updates and deletes.
- Accept `userId` as an explicit parameter on every helper that touches user-owned data.

### Example Structure

```
src/
  data/
    workouts.ts     # getWorkouts, createWorkout, updateWorkout, deleteWorkout
    exercises.ts    # createExercise, updateExercise, deleteExercise
    sets.ts         # createSet, updateSet, deleteSet
```

### Example Helpers

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}

export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

The `userId` filter is **mandatory** on every update and delete. Omitting it is a security bug.

## Server Actions

Server Actions are the **only** way to trigger mutations from the UI. They are defined in `actions.ts` files colocated with the route or feature they serve.

### Rules

- Defined in a file named `actions.ts` colocated with the relevant route (e.g. `src/app/workouts/actions.ts`)
- Must begin with `"use server"` at the top of the file
- Parameters must be **explicitly typed** — never `FormData`
- Must **validate all arguments with Zod** before doing anything else
- Must retrieve `userId` from the auth session inside the action — never accept it as a parameter
- Must call `/data` helpers for the actual database work

### Example

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.coerce.date(),
});

export async function createWorkoutAction(params: {
  name: string;
  date: Date;
}) {
  const parsed = createWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  return createWorkout(session.user.id, parsed.data.name, parsed.data.date);
}
```

## Summary

| Concern | Where it lives |
|---|---|
| Triggering a mutation | Server Action in colocated `actions.ts` |
| Input validation | Zod schema inside the Server Action |
| Database write | `/data/*.ts` helper function |
| ORM | Drizzle ORM only — no raw SQL |
| Data scoping | Every update/delete filters by `userId` |
| `userId` source | Auth session inside the Server Action — never a parameter |
