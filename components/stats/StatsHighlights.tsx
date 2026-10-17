"use client";

import { useData } from "@/hooks/useData";
import { CountUp } from "@/components/stats/CountUp";
import { FeaturedArtist } from "@/components/stats/highlights/FeaturedArtist";
import type { Overview, StatsData } from "@/types/stats";

export function StatsHighlights() {
  const { data: stats } = useData<StatsData>("/stats/stats.json");
  const { data: overview } = useData<Overview>("/stats/overview.json");

  if (!stats) return null;

  const metrics = [
    { label: "Artists", value: stats.total_artists },
    { label: "Albums", value: stats.total_albums },
    { label: "Rated tracks", value: stats.total_songs },
    {
      label: "Hours",
      value: overview?.hours,
      decimals: 1,
    },
    {
      label: "Years",
      value: overview?.yearsSpanned,
    },
  ];

  return (
    <section className="w-full">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Summary
        </h2>

        {overview && (
          <p className="text-sm tabular-nums text-white/40">
            {overview.dateRange[0]} — {overview.dateRange[1]}
          </p>
        )}
      </header>

      <div className="relative overflow-hidden border-y border-white/10 py-8 md:py-12">
        <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#5C8DFF]/[0.07] blur-3xl" />

        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
              Average score
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-7xl font-semibold tabular-nums tracking-[-0.07em] md:text-8xl">
                <CountUp value={stats.avg_score_global} decimals={2} />
              </span>
              <span className="text-xl text-[#5C8DFF]">/10</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="border-l border-white/15 pl-4">
                <p className="text-2xl font-semibold tabular-nums tracking-tight md:text-3xl">
                  {metric.value === undefined ? (
                    "—"
                  ) : (
                    <CountUp
                      value={metric.value}
                      decimals={metric.decimals ?? 0}
                    />
                  )}
                </p>
                <p className="mt-1 text-xs text-white/45">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-2 md:divide-x md:divide-white/10">
        <FeaturedArtist
          index="01"
          eyebrow="Top artist"
          artist={stats.top_artist}
        />
        <FeaturedArtist
          index="02"
          eyebrow="Most rated"
          artist={stats.most_rated_artist}
        />
      </div>
    </section>
  );
}