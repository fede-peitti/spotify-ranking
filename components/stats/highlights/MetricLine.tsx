"use client";

import { CountUp } from "@/components/stats/CountUp";

type Props = {
  index: string;
  label: string;
  value?: number;
  detail: string;
};

export function MetricLine({ index, label, value, detail }: Props) {
  return (
    <div className="border-t border-white/15 py-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs tabular-nums text-[#5C8DFF]">{index}</span>
        <span className="text-xs uppercase tracking-[0.16em] text-white/45">
          {label}
        </span>
      </div>

      <p className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
        {value === undefined ? "—" : <CountUp value={value} />}
      </p>

      <p className="mt-2 text-sm text-white/40">{detail}</p>
    </div>
  );
}