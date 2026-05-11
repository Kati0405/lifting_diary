import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";

import { getWorkoutsForDate } from "@/data/workouts";
import DashboardClient from "./DashboardClient";

type Props = {
  searchParams: Promise<{ date?: string }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { date: dateParam } = await searchParams;
  const dateStr = dateParam ?? format(new Date(), "yyyy-MM-dd");

  const date = new Date(dateStr + "T12:00:00");
  const workouts = await getWorkoutsForDate(userId, date);

  return <DashboardClient workouts={workouts} date={dateStr} />;
}
