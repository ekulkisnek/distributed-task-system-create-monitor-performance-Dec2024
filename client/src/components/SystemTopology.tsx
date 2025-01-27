import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useQuery } from '@tanstack/react-query';
import { Worker } from '@db/schema';
import { useWebSocket } from '@/lib/websocket';

export default function SystemTopology() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { socket } = useWebSocket();

  const { data: workers } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
  });

  useEffect(() => {
    if (!svgRef.current || !workers) return;

    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(workers)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("collide", d3.forceCollide(30));

    const nodes = svg.selectAll("g")
      .data(workers)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
      .attr("r", 20)
      .attr("fill", d => d.status === 'idle' ? '#22c55e' : '#3b82f6')
      .attr("stroke", "#000")
      .attr("stroke-width", 2);

    nodes.append("text")
      .text(d => `Worker ${d.id}`)
      .attr("text-anchor", "middle")
      .attr("dy", 30);

    simulation.on("tick", () => {
      nodes.attr("transform", d => `translate(${d.x},${d.y})`);
    });

  }, [workers]);

  return (
    <div className="flex justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
}
