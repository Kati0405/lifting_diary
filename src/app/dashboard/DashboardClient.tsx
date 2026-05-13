"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Set = {
  setNumber: number;
  reps: number | null;
  weightKg: string | null;
};

type WorkoutExercise = {
  id: string;
  exercise: { name: string };
  sets: Set[];
};

type Workout = {
  id: string;
  name: string | null;
  workoutExercises: WorkoutExercise[];
};

type Props = {
  workouts: Workout[];
  date: string; // ISO date string yyyy-MM-dd
};

export default function DashboardClient({ workouts, date }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const selectedDate = new Date(date + "T12:00:00"); // noon avoids DST edge cases

  function handleDateSelect(d: Date | undefined) {
    if (!d) return;
    const iso = format(d, "yyyy-MM-dd");
    router.push(`/dashboard?date=${iso}`);
    setOpen(false);
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              aria-label="Select workout date"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-normal text-zinc-700 dark:text-zinc-300 shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <CalendarIcon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
              {format(selectedDate, "do MMM yyyy")}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Workouts — {format(selectedDate, "do MMM yyyy")}
            </h2>
            <Button
              size="sm"
              onClick={() =>
                router.push(`/dashboard/workout/new?date=${date}`)
              }
            >
              Log workout
            </Button>
          </div>

          {workouts.length === 0 ? (
            <p className="text-zinc-400 text-sm py-8 text-center">
              No workouts logged for this day.
            </p>
          ) : (
            workouts.map((workout) => (
              <button
                key={workout.id}
                className="text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100 rounded-xl"
                aria-label={`Open ${workout.name ?? "Workout"}`}
                onClick={() => router.push(`/dashboard/workout/${workout.id}`)}
              >
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {workout.name ?? "Workout"}
                  </CardTitle>
                  <CardDescription>
                    {workout.workoutExercises.length} exercise
                    {workout.workoutExercises.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {workout.workoutExercises.map((we) => (
                    <div key={we.id} className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {we.exercise.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {we.sets.map((set) => (
                          <span
                            key={set.setNumber}
                            className="text-xs px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >
                            {set.reps} × {set.weightKg} kg
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
