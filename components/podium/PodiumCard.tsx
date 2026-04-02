import type { Artist } from "@/types/artist";

import { ArtistAvatar } from "../common/ArtistAvatar";

type Props = {
  artist: Artist;
  rank: number;
  size: "lg" | "md" | "sm";
  highlight?: boolean;
};

const rankStyles: Record<number, { glow: string; ring: string; text: string }> =
  {
    1: {
      glow: "shadow-[0_0_60px_rgba(92,141,255,0.45)]",
      ring: "ring-2 ring-[#5C8DFF]",
      text: "text-[#5C8DFF]",
    },
    2: {
      glow: "shadow-[0_0_40px_rgba(168,85,247,0.35)]",
      ring: "ring-1 ring-purple-400/60",
      text: "text-purple-300",
    },
    3: {
      glow: "shadow-[0_0_30px_rgba(180,180,180,0.25)]",
      ring: "ring-1 ring-white/20",
      text: "text-white/70",
    },
  };

export function PodiumCard({ artist, rank, size, highlight }: Props) {
  const sizes = {
    lg: "h-72 w-56",
    md: "h-56 w-48",
    sm: "h-48 w-40",
  };

  return (
    <div
      className={`
    relative flex flex-col items-center justify-end
    ${sizes[size]}
    rounded-3xl
    bg-gradient-to-b from-[#121826] to-[#0B0F17]
    border border-white/10
    transition-all duration-300
    hover:scale-105

    ${rankStyles[rank].glow}
    ${rankStyles[rank].ring}
  `}
    >
      {/* Avatar */}
      <div className="absolute -top-14">
        <div
          className={`
      absolute inset-0 rounded-full blur-xl opacity-60
      ${
        rank === 1
          ? "bg-[#5C8DFF]/40"
          : rank === 2
            ? "bg-purple-400/30"
            : "bg-white/20"
      }
    `}
        />
        <ArtistAvatar
          name={artist.Artist}
          size={size === "lg" ? 110 : size === "md" ? 90 : 80}
          highlight={highlight}
        />
      </div>

      {/* Rank */}
      <div className="absolute top-4 text-xs opacity-50">#{rank}</div>

      {/* Info */}
      <div className="text-center p-4 mt-10">
        <p className="font-semibold truncate">{artist.Artist}</p>
        <p className="text-xs opacity-60">{artist.count} canciones</p>

        <p className={`mt-2 text-lg font-bold ${rankStyles[rank].text}`}>
          {artist.avg}
        </p>
      </div>
    </div>
  );
}
