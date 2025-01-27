import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEvents } from "@/lib/events";
import { useEffect } from "react";
import { Metric } from "@db/schema";

export default function MetricsDisplay() {
  const { connected } = useEvents();
  const { data: metrics } = useQuery<Metric[]>({
    queryKey: ["/api/metrics"],
  });

  const formatData = (metrics: Metric[] = []) => {
    return metrics.map(m => ({
      timestamp: new Date(m.timestamp).toLocaleTimeString(),
      queueLength: m.queueLength,
      processingTime: m.processingTime,
      cpuUsage: m.cpuUsage,
      memoryUsage: m.memoryUsage
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Queue Length Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formatData(metrics)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="queueLength" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Processing Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={formatData(metrics)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="processingTime" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
