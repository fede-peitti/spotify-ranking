import { rankStyles } from "./PodiumStyles";

export function usePodiumStyles(
  rank: number,
  size: "lg" | "md" | "sm"
) {
  const sizes = {
    lg: "h-80 w-64",
    md: "h-56 w-48",
    sm: "h-48 w-40",
  };

  return {
    size: sizes[size],
    ...rankStyles[rank],
    pedestal:
      rank === 1 ? "h-20" :
      rank === 2 ? "h-16" :
      "h-14",
    isFirst: rank === 1,
  };
}