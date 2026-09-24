"use client";

import { useData } from "@/hooks/useData";
import { CountUp } from "@/components/stats/CountUp";
import { StatBlock } from "@/components/stats/StatBlock";
import type { Overview } from "@/types/stats";

export function OverviewStats() {
  const { data } = useData<Overview>("/stats/overview.json");
  if (!data) return null;

  const items = [
    { label: "Songs rated", value: data.songs },
    { label: "Artists", value: data.artists },
    { label: "Albums", value: data.albums },
    { label: "Hours of music", value: data.hours, decimals: 1 },
    { label: "Average score", value: data.avgScore, decimals: 2, suffix: "/10" },
    { label: "Years spanned", value: data.yearsSpanned },
  ];

  return (
    <StatBlock
      eyebrow="By the numbers"
      title="The shape of a listening history"
      subtitle={`Every song here was rated on purpose. Range: ${data.dateRange[0]} → ${data.dateRange[1]}.`}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-5"
          >
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <CountUp
                value={it.value}
                decimals={it.decimals ?? 0}
                suffix={it.suffix ?? ""}
              />
            </div>
            <div className="text-xs uppercase tracking-wider text-white/50 mt-2">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </StatBlock>
  );
}