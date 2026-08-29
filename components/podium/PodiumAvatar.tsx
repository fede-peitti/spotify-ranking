import { ArtistAvatar } from "../common/ArtistAvatar";
import { rankStyles } from "./PodiumStyles";

export function PodiumAvatar({
  name,
  rank,
  size,
}: {
  name: string;
  rank: number;
  size: "lg" | "md" | "sm";
}) {
  const avatarSize = size === "lg" ? 140 : size === "md" ? 110 : 100;

  return (
    <div className="absolute -top-20 z-20">
      <div
        className={`
          absolute inset-[-10px]
          rounded-full
          blur-xl
          opacity-60
          ${rankStyles[rank].halo}
        `}
      />

      <div className="relative aspect-square shrink-0">
        <ArtistAvatar
          name={name}
          size={avatarSize}
          rank={rank}
        />
      </div>
    </div>
  );
}