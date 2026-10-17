"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useData } from "@/hooks/useData";
import type { StatsData } from "@/types/stats";

const chartColors = {
  foreground: "var(--foreground)",
  muted: "var(--muted-foreground)",
  border: "var(--border)",
  card: "var(--card)",
  blue: "var(--spotipy-blue)",
  blueSoft: "var(--spotipy-blue-soft)",
};

export function ScoreDistribution() {
  const { data: stats } = useData<StatsData>("/stats/stats.json");

  if (!stats) return null;

  const data = stats.score_distribution;
  const maxCount = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="w-full">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Score distribution
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {stats.total_songs.toLocaleString("en-US")} tracks rated
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-semibold tabular-nums tracking-tight text-foreground md:text-4xl">
            {stats.avg_score_global.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">Average / 10</p>
        </div>
      </div>

      <div className="h-[300px] w-full md:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 8, left: -16, bottom: 4 }}
            barCategoryGap="24%"
          >
            <CartesianGrid
              vertical={false}
              stroke={chartColors.border}
              strokeDasharray="3 5"
            />

            <XAxis
              dataKey="score"
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              label={{
                value: "Score",
                position: "insideBottom",
                offset: -2,
                fill: chartColors.muted,
                fontSize: 12,
              }}
            />

            <YAxis
              domain={[0, Math.ceil(maxCount * 1.12)]}
              tick={{ fill: chartColors.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                value.toLocaleString("en-US")
              }
              width={55}
            />

            <Tooltip
              cursor={{ fill: chartColors.blueSoft }}
              contentStyle={{
                backgroundColor: chartColors.card,
                border: `1px solid ${chartColors.border}`,
                borderRadius: "var(--radius)",
                color: chartColors.foreground,
                fontSize: 13,
              }}
              labelStyle={{
                color: chartColors.muted,
                marginBottom: 4,
              }}
              formatter={(value) => [
                Number(value).toLocaleString("en-US"),
                "Tracks",
              ]}
              labelFormatter={(label) => `Score ${label}/10`}
            />

            <Bar
              dataKey="count"
              fill={chartColors.blue}
              radius={[4, 4, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}