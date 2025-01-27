import { Task } from "@db/schema";

export function calculateTaskPriority(task: Task): number {
  const waitingTime = Date.now() - new Date(task.createdAt).getTime();
  const waitingFactor = Math.floor(waitingTime / (1000 * 60)); // Minutes waiting
  return task.priority + Math.min(waitingFactor, 5);
}

export function estimateProcessingTime(task: Task): number {
  switch (task.type) {
    case 'processing':
      return 5000; // 5 seconds
    case 'analysis':
      return 8000; // 8 seconds
    case 'calculation':
      return 3000; // 3 seconds
    default:
      return 5000;
  }
}

export function getTaskStatus(task: Task): string {
  if (task.completedAt) return 'completed';
  if (task.startedAt) return 'processing';
  if (task.error) return 'failed';
  return 'pending';
}
