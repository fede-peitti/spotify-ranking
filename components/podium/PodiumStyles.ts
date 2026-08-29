export const rankStyles: Record<
  number,
  { glow: string; ring: string; text: string; halo: string }
> = {
  1: {
    glow: "shadow-[0_0_60px_rgba(234,179,8,0.45)]",
    ring: "ring-2 ring-yellow-400/80",
    text: "text-yellow-400",
    halo: "bg-yellow-400/40",
  },
  2: {
    glow: "shadow-[0_0_45px_rgba(203,213,225,0.35)]",
    ring: "ring-2 ring-slate-300/70",
    text: "text-slate-300",
    halo: "bg-slate-300/30",
  },
  3: {
    glow: "shadow-[0_0_35px_rgba(180,120,70,0.30)]",
    ring: "ring-1 ring-orange-300/60",
    text: "text-orange-300",
    halo: "bg-orange-300/25",
  },
};