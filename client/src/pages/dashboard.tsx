import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskQueue from "@/components/TaskQueue";
import SystemTopology from "@/components/SystemTopology";
import WorkerStatus from "@/components/WorkerStatus";
import TaskSubmission from "@/components/TaskSubmission";
import MetricsDisplay from "@/components/MetricsDisplay";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Distributed Task System Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Topology</CardTitle>
            </CardHeader>
            <CardContent>
              <SystemTopology />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskQueue />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Worker Status</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkerStatus />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Submit Task</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskSubmission />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricsDisplay />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
