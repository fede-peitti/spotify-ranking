"use client";

import { useData } from "@/hooks/useData";
import { CountUp } from "@/components/stats/CountUp";
import { FeaturedArtist } from "@/components/stats/highlights/FeaturedArtist";
import { MetricLine } from "@/components/stats/highlights/MetricLine";
import type { Overview, StatsData } from "@/types/stats";

export function StatsHighlights() {
  const { data: stats } = useData<StatsData>("/stats/stats.json");
  const { data: overview } = useData<Overview>("/stats/overview.json");

  if (!stats) return null;

  return (
    <section className="w-full space-y-16">
      <header className="max-w-3xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#5C8DFF]">
          Listening statistics
        </p>

        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          Now, Musical Stats
        </h2>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/50 md:text-lg">
          A closer look at the numbers behind my listening history.
          {overview && (
            <span>
              {" "}
              From {overview.dateRange[0]} to {overview.dateRange[1]}.
            </span>
          )}
        </p>
      </header>

      <div className="relative overflow-hidden border-y border-white/10 py-10 md:py-14">
        <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#5C8DFF]/[0.07] blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="text-sm text-white/50">
              Average rating across all tracks
            </p>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-7xl font-semibold tracking-[-0.07em] text-white md:text-9xl">
                <CountUp value={stats.avg_score_global} decimals={2} />
              </span>
              <span className="text-xl text-[#5C8DFF]">/10</span>
            </div>

            <div className="mt-5 h-px w-full max-w-sm bg-gradient-to-r from-[#5C8DFF]/80 to-transparent" />
          </div>

          <div className="md:justify-self-end md:text-right">
            <p className="text-xs uppercase tracking-[0.18em] text-white/40">
              Total rated tracks
            </p>
            <p className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
              <CountUp value={stats.total_songs} />
            </p>
            {overview && (
              <p className="mt-2 text-sm text-white/40">
                {overview.hours.toLocaleString("en-US", {
                  maximumFractionDigits: 1,
                })}{" "}
                hours of music
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-3">
        <MetricLine
          index="01"
          label="Artists"
          value={stats.total_artists}
          detail="With at least 15 rated tracks"
        />
        <MetricLine
          index="02"
          label="Albums"
          value={stats.total_albums}
          detail="With at least 5 rated tracks"
        />
        <MetricLine
          index="03"
          label="Years covered"
          value={overview?.yearsSpanned}
          detail="Across the listening history"
        />
      </div>

      <div>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5C8DFF]">
              The standouts
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Two ways to lead
            </h3>
          </div>
          <span className="hidden text-sm text-white/35 sm:block">
            Quality vs. quantity
          </span>
        </div>

        <div className="grid gap-0 md:grid-cols-2 md:divide-x md:divide-white/10">
          <FeaturedArtist
            index="01"
            eyebrow="Highest average"
            artist={stats.top_artist}
          />
          <FeaturedArtist
            index="02"
            eyebrow="Most rated tracks"
            artist={stats.most_rated_artist}
          />
        </div>
      </div>
    </section>
  );
}