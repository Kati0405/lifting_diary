"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(
  workoutId: string,
  params: { name: string; startedAt: Date }
): Promise<{ error?: string | Record<string, string[]> }> {
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  await updateWorkout(userId, workoutId, parsed.data);
  return {};
}
