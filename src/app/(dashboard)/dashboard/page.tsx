import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Leaf, Calendar } from "lucide-react";
import { format, isToday, isTomorrow, addDays } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const [plantsCount, tasksToday, tasksUpcoming] = await Promise.all([
    prisma.plant.count({
      where: {
        userId: session.user.id,
        isDeleted: false,
      },
    }),
    prisma.careSchedule.findMany({
      where: {
        plant: {
          userId: session.user.id,
          isDeleted: false,
        },
        isDeleted: false,
        isActive: true,
        nextDueDate: {
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      include: {
        plant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { nextDueDate: "asc" },
    }),
    prisma.careSchedule.findMany({
      where: {
        plant: {
          userId: session.user.id,
          isDeleted: false,
        },
        isDeleted: false,
        isActive: true,
        nextDueDate: {
          gt: new Date(new Date().setHours(23, 59, 59, 999)),
          lte: addDays(new Date(), 7),
        },
      },
      include: {
        plant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { nextDueDate: "asc" },
      take: 5,
    }),
  ]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plantsCount}</div>
            <Link href="/plants/new">
              <Button variant="link" className="px-0 mt-2">
                Add new plant
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksToday.length}</div>
            {tasksToday.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {tasksToday.length} {tasksToday.length === 1 ? "task" : "tasks"} due today
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming (7 days)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksUpcoming.length}</div>
            <Link href="/tasks">
              <Button variant="link" className="px-0 mt-2">
                View all tasks
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {tasksToday.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tasks Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasksToday.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{task.plant?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.taskType} - {task.timeOfDay}
                    </p>
                  </div>
                  <Link href={`/plants/${task.plantId}`}>
                    <Button variant="outline" size="sm">
                      View Plant
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tasksUpcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasksUpcoming.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{task.plant?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.taskType} - {format(new Date(task.nextDueDate), "MMM d 'at' h:mm a")}
                    </p>
                  </div>
                  <Link href={`/plants/${task.plantId}`}>
                    <Button variant="outline" size="sm">
                      View Plant
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Plus className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Quick Actions</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get started with your plant care
                </p>
                <div className="flex gap-2">
                  <Link href="/plants/new">
                    <Button size="sm">Add Plant</Button>
                  </Link>
                  <Link href="/schedules/new">
                    <Button size="sm" variant="outline">
                      Add Schedule
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
