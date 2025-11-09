import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight">
          Plant Care Reminder
        </h1>
        <p className="text-xl text-muted-foreground">
          Never forget to water your plants again. Track your plants, set care schedules, 
          and get timely reminders to keep your green friends thriving.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/signin">
            <Button size="lg" variant="outline">Sign In</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Track Your Plants</h3>
            <p className="text-sm text-muted-foreground">
              Add photos and details about each plant in your collection
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Set Care Schedules</h3>
            <p className="text-sm text-muted-foreground">
              Create custom watering and fertilizing schedules for each plant
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Get Reminders</h3>
            <p className="text-sm text-muted-foreground">
              Receive email and push notifications when care tasks are due
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
