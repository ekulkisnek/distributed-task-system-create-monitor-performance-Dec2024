import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/lib/websocket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@db/schema";
import { useEffect } from "react";

export default function TaskQueue() {
  const { socket } = useWebSocket();
  const { toast } = useToast();

  const { data: tasks, refetch } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  useEffect(() => {
    if (!socket) return;

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "TASK_UPDATE") {
        refetch();
      }
    });
  }, [socket, refetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {tasks?.map((task) => (
          <div 
            key={task.id}
            className="p-3 bg-card rounded-lg border flex items-center justify-between"
          >
            <div>
              <div className="font-medium">Task #{task.id}</div>
              <div className="text-sm text-muted-foreground">{task.type}</div>
            </div>
            <Badge className={getStatusColor(task.status)}>
              {task.status}
            </Badge>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
