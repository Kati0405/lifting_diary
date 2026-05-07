"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
  reps: number;
  weight: number;
};

type Exercise = {
  name: string;
  sets: Set[];
};

type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
};

const MOCK_WORKOUTS: Workout[] = [
  {
    id: "1",
    name: "Upper Body",
    exercises: [
      {
        name: "Bench Press",
        sets: [
          { reps: 8, weight: 80 },
          { reps: 8, weight: 80 },
          { reps: 6, weight: 85 },
        ],
      },
      {
        name: "Overhead Press",
        sets: [
          { reps: 10, weight: 50 },
          { reps: 10, weight: 50 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Accessory Work",
    exercises: [
      {
        name: "Tricep Pushdown",
        sets: [
          { reps: 12, weight: 30 },
          { reps: 12, weight: 30 },
          { reps: 10, weight: 35 },
        ],
      },
    ],
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const workouts = MOCK_WORKOUTS;

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-normal text-zinc-700 dark:text-zinc-300 shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <CalendarIcon className="h-4 w-4 text-zinc-500" />
              {format(date, "do MMM yyyy")}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) {
                    setDate(d);
                    setOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Workouts — {format(date, "do MMM yyyy")}
          </h2>

          {workouts.length === 0 ? (
            <p className="text-zinc-400 text-sm py-8 text-center">
              No workouts logged for this day.
            </p>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                  <CardDescription>
                    {workout.exercises.length} exercise
                    {workout.exercises.length !== 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.name} className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                        {exercise.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.sets.map((set, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >
                            {set.reps} × {set.weight} kg
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
