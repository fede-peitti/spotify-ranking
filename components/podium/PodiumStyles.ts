export const rankStyles: Record<
  number,
  { glow: string; ring: string; text: string; halo: string }
> = {
  1: {
    glow: "shadow-[0_20px_80px_rgba(92,141,255,0.55)]",
    ring: "ring-2 ring-[#5C8DFF]",
    text: "text-[#5C8DFF]",
    halo: "bg-[#5C8DFF]/40",
  },
  2: {
    glow: "shadow-[0_0_40px_rgba(168,85,247,0.35)]",
    ring: "ring-1 ring-purple-400/60",
    text: "text-purple-300",
    halo: "bg-purple-400/30",
  },
  3: {
    glow: "shadow-[0_0_30px_rgba(180,180,180,0.25)]",
    ring: "ring-1 ring-white/20",
    text: "text-white/70",
    halo: "bg-white/20",
  },
};
