
"use client";

import {
  CartesianGrid,
  ComposedChart,
  Line,
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

export function ReleaseEvolution() {
  const { data: stats } = useData<StatsData>("/stats/stats.json");

  if (!stats) return null;

  const data = stats.year_evolution;
  if (!data.length) return null;

  return (
    <div className="w-full">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Ratings by release year
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Average score of tracks by original release year
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full md:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 8, left: -16, bottom: 4 }}
          >
            <CartesianGrid
              vertical={false}
              stroke={chartColors.border}
              strokeDasharray="3 5"
            />

            <XAxis
              dataKey="year"
              type="number"
              domain={["dataMin", "dataMax"]}
              tick={{ fill: chartColors.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tickFormatter={(value: number) => String(value)}
              minTickGap={24}
            />

            <YAxis
              yAxisId="score"
              domain={[1, 10]}
              tick={{ fill: chartColors.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={38}
            />

            <YAxis
              yAxisId="songs"
              orientation="right"
              tick={{ fill: chartColors.muted, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={42}
            />

            <Tooltip
              labelFormatter={(label) => `Release year: ${label}`}
              formatter={(value, name) => [
                Number(value).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                }),
                name === "avg_score" ? "Average score" : "Tracks rated",
              ]}
              cursor={{ fill: chartColors.blueSoft }}
              contentStyle={{
                backgroundColor: chartColors.card,
                border: `1px solid ${chartColors.border}`,
                borderRadius: "var(--radius)",
                color: chartColors.foreground,
                fontSize: 12,
              }}
              labelStyle={{
                color: chartColors.muted,
                marginBottom: 4,
              }}
            />

            <Line
              yAxisId="score"
              dataKey="avg_score"
              name="avg_score"
              type="monotone"
              stroke={chartColors.blue}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls={false}
            />

            <Line
              yAxisId="songs"
              dataKey="songs"
              name="songs"
              type="monotone"
              stroke={chartColors.foreground}
              strokeWidth={1.5}
              strokeOpacity={0.45}
              dot={false}
              activeDot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span
            className="h-0.5 w-4"
            style={{ backgroundColor: chartColors.blue }}
          />
          Average score
        </span>

        <span className="flex items-center gap-2">
          <span
            className="h-0.5 w-4"
            style={{ backgroundColor: chartColors.foreground, opacity: 0.45 }}
          />
          Tracks rated
        </span>
      </div>
    </div>
  );
}
