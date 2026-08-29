import type { Artist } from "@/types/artist";
import { PodiumAvatar } from "./PodiumAvatar";
import { PodiumInfo } from "./PodiumInfo";
import { PodiumPedestal } from "./PodiumPedestal";
import { usePodiumStyles } from "./usePodiumStyles";
import { PodiumScore } from "./PodiumScore";

type Props = {
  artist: Artist;
  rank: number;
  size: "lg" | "md" | "sm";
  highlight?: boolean;
};

export function PodiumCard({ artist, rank, size, highlight }: Props) {
  const s = usePodiumStyles(rank, size);

  return (
    <div
      className={`
        relative flex items-end justify-center
        ${s.size}
        rounded-3xl
        bg-gradient-to-b from-[#121826] to-[#0B0F17]
        border border-white/10
        transition-all duration-300 hover:scale-105

        ${s.isFirst ? "scale-110 z-10" : ""}
        ${s.glow}
        ${s.ring}
      `}
    >
      <PodiumAvatar
        name={artist.Artist}
        rank={rank}
        size={size}
        highlight={highlight}
      />

      <PodiumScore score={artist.avg} rank={rank} />

      <PodiumInfo name={artist.Artist} count={artist.count} rank={rank} />

      <PodiumPedestal height={s.pedestal} />
    </div>
  );
}
