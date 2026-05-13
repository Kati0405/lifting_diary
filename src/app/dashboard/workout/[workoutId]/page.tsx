import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutById } from "@/data/workouts";
import EditWorkoutForm from "./EditWorkoutForm";

interface Props {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const workout = await getWorkoutById(userId, workoutId);

  if (!workout) {
    notFound();
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-3xl mx-auto px-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Edit workout</CardTitle>
          </CardHeader>
          <CardContent>
            <EditWorkoutForm
              workoutId={workout.id}
              initialName={workout.name ?? ""}
              initialStartedAt={workout.startedAt}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
