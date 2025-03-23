
# Task Management System

A real-time task management system built with React, Express, and PostgreSQL, featuring live updates via Server-Sent Events (SSE).

## Features

- **Real-time Updates**: Uses SSE for live task, worker, and metrics updates
- **Task Management**: Create and monitor tasks with priority levels
- **Worker Monitoring**: Track worker status and performance metrics
- **Performance Metrics**: Collect and visualize system metrics in real-time

## Tech Stack

- **Frontend**: React + Vite, TailwindCSS, Radix UI
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time**: Server-Sent Events (SSE)

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/             # React source code
│   └── index.html       # Entry HTML file
├── db/                  # Database configuration
│   ├── index.ts        # Database connection setup
│   └── schema.ts       # Drizzle ORM schema definitions
└── server/             # Backend Express application
    ├── index.ts        # Server entry point
    ├── routes.ts       # API route definitions
    └── vite.ts         # Vite development server setup
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
  ```typescript
  {
    type: string,
    priority: number,
    payload: JSON
  }
  ```

### Workers
- `GET /api/workers` - Get all worker statuses

### Metrics
- `GET /api/metrics` - Retrieve system metrics
- `GET /api/events` - SSE endpoint for real-time updates

## Database Schema

### Workers Table
```typescript
{
  id: serial
  name: text
  status: text
  lastHeartbeat: timestamp
  currentLoad: integer
  totalTasksProcessed: integer
}
```

### Tasks Table
```typescript
{
  id: serial
  type: text
  status: text
  priority: integer
  payload: jsonb
  workerId: integer
  createdAt: timestamp
  startedAt: timestamp
  completedAt: timestamp
  error: text
}
```

### Metrics Table
```typescript
{
  id: serial
  timestamp: timestamp
  workerId: integer
  queueLength: integer
  processingTime: integer
  cpuUsage: integer
  memoryUsage: integer
}
```

## Getting Started

1. Click the "Run" button in Replit
2. The server will start on port 5000
3. Access the web interface through the Replit WebView

## Development

The project uses `npm run dev` for development, which:
- Starts the Express backend server
- Serves the Vite development server for the frontend
- Enables hot module replacement
- Provides real-time logging

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string

## Real-time Updates

The system uses several intervals for updates:
- Worker status updates every 5 seconds
- Metrics collection every 10 seconds
- Real-time SSE broadcasts for task, worker, and metrics changes
