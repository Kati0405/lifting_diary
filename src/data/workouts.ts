import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, startedAt: Date) {
  return db.insert(workouts).values({ userId, name, startedAt }).returning();
}

export async function getWorkoutById(userId: string, workoutId: string) {
  return db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  data: { name: string; startedAt: Date }
) {
  return db
    .update(workouts)
    .set({ name: data.name, startedAt: data.startedAt, updatedAt: new Date() })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
}

export async function getWorkoutsForDate(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return db.query.workouts.findMany({
    where: and(
      eq(workouts.userId, userId),
      gte(workouts.startedAt, start),
      lt(workouts.startedAt, end)
    ),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.orderIndex)],
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.setNumber)],
          },
        },
      },
    },
  });
}
