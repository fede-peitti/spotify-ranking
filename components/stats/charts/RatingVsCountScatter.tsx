"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useData } from "@/hooks/useData";
import { StatBlock } from "@/components/stats/StatBlock";
import { chart, tooltipStyle } from "@/lib/theme";
import type { ScatterPoint } from "@/types/stats";

export function RatingVsCountScatter() {
  const { data } = useData<ScatterPoint[]>("/stats/scatter.json");
  if (!data) return null;

  const avgY = data.reduce((s, p) => s + p.avg, 0) / data.length;
  const sorted = [...data].sort((a, b) => a.count - b.count);
  const medianX = sorted[Math.floor(sorted.length / 2)].count;

  const colorFor = (p: ScatterPoint) => {
    const high = p.avg >= avgY;
    const many = p.count >= medianX;
    if (high && !many) return chart.palette[0];
    if (high && many) return chart.palette[1];
    if (!high && many) return chart.palette[3];
    return chart.palette[4];
  };

  return (
    <StatBlock
      eyebrow="Taste map"
      title="Hidden gems vs. comfort staples"
      subtitle="Each dot is an artist. Right = rated more. Up = rated higher."
      caption={`Quadrants split at the median count (${medianX} songs) and mean artist score (${avgY.toFixed(2)}).`}
    >
      <div className="h-[420px] w-full rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="count"
              name="Songs rated"
              stroke={chart.axis}
              tick={{ fill: chart.muted, fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="avg"
              name="Avg score"
              domain={[0, 10]}
              stroke={chart.axis}
              tick={{ fill: chart.muted, fontSize: 12 }}
            />
            <ReferenceLine y={avgY} stroke={chart.axis} strokeDasharray="4 4" />
            <ReferenceLine x={medianX} stroke={chart.axis} strokeDasharray="4 4" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const p = payload[0].payload as ScatterPoint;
                return (
                  <div style={tooltipStyle} className="px-3 py-2">
                    <div className="font-semibold">{p.artist}</div>
                    <div className="text-xs opacity-70">
                      {p.avg.toFixed(2)} avg · {p.count} songs
                    </div>
                  </div>
                );
              }}
            />
            <Scatter data={data} shape="circle">
              {data.map((p) => (
                <Cell key={p.artist} fill={colorFor(p)} fillOpacity={0.85} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/60">
        <Legend color={chart.palette[0]} label="Hidden gems" />
        <Legend color={chart.palette[1]} label="Staples" />
        <Legend color={chart.palette[3]} label="Guilty pleasures" />
        <Legend color={chart.palette[4]} label="Skips" />
      </div>
    </StatBlock>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}