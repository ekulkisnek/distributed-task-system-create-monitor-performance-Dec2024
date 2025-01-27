import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const workers = pgTable("workers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default('idle'),
  lastHeartbeat: timestamp("last_heartbeat").notNull().defaultNow(),
  currentLoad: integer("current_load").notNull().default(0),
  totalTasksProcessed: integer("total_tasks_processed").notNull().default(0)
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  status: text("status").notNull().default('pending'),
  priority: integer("priority").notNull().default(1),
  payload: jsonb("payload").notNull(),
  workerId: integer("worker_id").references(() => workers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  error: text("error")
});

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  workerId: integer("worker_id").references(() => workers.id),
  queueLength: integer("queue_length").notNull(),
  processingTime: integer("processing_time").notNull(),
  cpuUsage: integer("cpu_usage").notNull(),
  memoryUsage: integer("memory_usage").notNull()
});

export type Worker = typeof workers.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Metric = typeof metrics.$inferSelect;

export const insertWorkerSchema = createInsertSchema(workers);
export const selectWorkerSchema = createSelectSchema(workers);
export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);
export const insertMetricSchema = createInsertSchema(metrics);
export const selectMetricSchema = createSelectSchema(metrics);
