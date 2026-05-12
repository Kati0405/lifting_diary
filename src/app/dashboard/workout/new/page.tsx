import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewWorkoutForm from "./NewWorkoutForm";

export default function NewWorkoutPage() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-3xl mx-auto px-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>New workout</CardTitle>
          </CardHeader>
          <CardContent>
            <NewWorkoutForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
