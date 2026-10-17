
"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useData } from "@/hooks/useData";
import type {
  ArtistTimelinePoint,
  StatsData,
} from "@/types/stats";

export type ArtistColorScale = {
  score: string;
  tracks: string;
};

export const DEFAULT_COLORS: ArtistColorScale = {
  score: "var(--spotipy-blue)",
  tracks: "var(--text-muted)",
};

export const ARTIST_COLOR_SCALES: Record<string, ArtistColorScale> = {};

export function ArtistEvolution() {
  const { data: stats } = useData<StatsData>("/stats/stats.json");
  const [selectedArtist, setSelectedArtist] = useState("");

  const artistNames = useMemo(() => {
    if (!stats) return [];

    return [...new Set(
      stats.artist_timeline.map((point) => point.artist),
    )].sort((a, b) => a.localeCompare(b));
  }, [stats]);

  const activeArtist = selectedArtist || artistNames[0] || "";

  const data = useMemo(() => {
    if (!stats || !activeArtist) return [];

    return stats.artist_timeline
      .filter((point) => point.artist === activeArtist)
      .sort((a, b) => a.year - b.year);
  }, [stats, activeArtist]);

  if (!stats || !data.length) return null;

  const colors =
    ARTIST_COLOR_SCALES[activeArtist] ?? DEFAULT_COLORS;

  const totalTracks = data.reduce((sum, point) => sum + point.tracks, 0);
  const totalAlbums = data.reduce((sum, point) => sum + point.albums, 0);

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Artist evolution
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Ratings and discography by release year
          </p>
        </div>

        <div className="w-full sm:w-64">
          <label
            htmlFor="artist-evolution-select"
            className="mb-2 block text-xs text-muted-foreground"
          >
            Select artist
          </label>
          <select
            id="artist-evolution-select"
            value={activeArtist}
            onChange={(event) => setSelectedArtist(event.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:ring-2 focus:ring-ring"
          >
            {artistNames.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-x-8 gap-y-4">
        <div>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {totalAlbums.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Albums across release years</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {totalTracks.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Rated tracks</p>
        </div>
        <div>
          <p className="text-2xl font-semibold tabular-nums text-foreground">
            {data.length.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Active release years</p>
        </div>
      </div>

      <div className="h-[320px] w-full md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 8, left: -16, bottom: 4 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 5"
            />

            <XAxis
              dataKey="year"
              type="number"
              domain={["dataMin", "dataMax"]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={24}
              tickFormatter={(year: number) => String(year)}
            />

            <YAxis
              yAxisId="tracks"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={48}
            />

            <YAxis
              yAxisId="score"
              orientation="right"
              domain={[1, 10]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={32}
            />

            <Tooltip
              labelFormatter={(year) => `Release year: ${year}`}
              formatter={(value, name) => [
                Number(value).toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                }),
                name === "avg_score" ? "Average score" : "Rated tracks",
              ]}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--foreground)",
                fontSize: 12,
              }}
              labelStyle={{
                color: "var(--muted-foreground)",
                marginBottom: 4,
              }}
              cursor={{ fill: "var(--spotipy-blue-soft)" }}
            />

            <Bar
              yAxisId="tracks"
              dataKey="tracks"
              name="tracks"
              fill={colors.tracks}
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />

            <Line
              yAxisId="score"
              dataKey="avg_score"
              name="avg_score"
              type="monotone"
              stroke={colors.score}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: colors.tracks }}
          />
          Rated tracks
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-0.5 w-4"
            style={{ backgroundColor: colors.score }}
          />
          Average score
        </span>
      </div>
    </div>
  );
}
