import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { db } from "@db";
import { tasks, workers, metrics } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws"
  });

  // WebSocket handling
  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Broadcast updates to all clients
  const broadcast = (message: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  // API Routes
  app.get('/api/tasks', async (req, res) => {
    try {
      const allTasks = await db.select().from(tasks);
      res.json(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  app.post('/api/tasks', async (req, res) => {
    try {
      const { type, priority, payload } = req.body;
      const newTask = await db.insert(tasks).values({
        type,
        priority: parseInt(priority),
        payload: JSON.parse(payload),
      }).returning();

      broadcast({ type: 'TASK_UPDATE' });
      res.json(newTask[0]);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  app.get('/api/workers', async (req, res) => {
    try {
      const allWorkers = await db.select().from(workers);
      res.json(allWorkers);
    } catch (error) {
      console.error('Error fetching workers:', error);
      res.status(500).json({ error: 'Failed to fetch workers' });
    }
  });

  app.get('/api/metrics', async (req, res) => {
    try {
      const allMetrics = await db.select().from(metrics);
      res.json(allMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  });

  // Simulated worker updates
  setInterval(async () => {
    try {
      const allWorkers = await db.select().from(workers);

      for (const worker of allWorkers) {
        const newLoad = Math.floor(Math.random() * 100);
        await db.update(workers)
          .set({ 
            currentLoad: newLoad,
            status: newLoad > 80 ? 'busy' : 'idle'
          })
          .where(eq(workers.id, worker.id));
      }

      broadcast({ type: 'WORKER_UPDATE' });
    } catch (error) {
      console.error('Error updating workers:', error);
    }
  }, 5000);

  // Simulated metrics collection
  setInterval(async () => {
    try {
      const allWorkers = await db.select().from(workers);

      for (const worker of allWorkers) {
        await db.insert(metrics).values({
          workerId: worker.id,
          queueLength: Math.floor(Math.random() * 20),
          processingTime: Math.floor(Math.random() * 1000),
          cpuUsage: Math.floor(Math.random() * 100),
          memoryUsage: Math.floor(Math.random() * 100)
        });
      }

      broadcast({ type: 'METRICS_UPDATE' });
    } catch (error) {
      console.error('Error collecting metrics:', error);
    }
  }, 10000);

  return httpServer;
}