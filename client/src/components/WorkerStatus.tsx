import { useQuery } from "@tanstack/react-query";
import { Worker } from "@db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEvents } from "@/lib/events";
import { useEffect } from "react";

export default function WorkerStatus() {
  const { connected } = useEvents();
  const { data: workers } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {workers?.map((worker) => (
        <Card key={worker.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Worker #{worker.id}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                worker.status === 'idle' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {worker.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Load: {worker.currentLoad}%
              </div>
              <Progress value={worker.currentLoad} />
              <div className="text-sm text-muted-foreground">
                Tasks Processed: {worker.totalTasksProcessed}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
