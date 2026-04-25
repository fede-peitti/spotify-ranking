import { ArtistAvatar } from "../common/ArtistAvatar";
import { rankStyles } from "./PodiumStyles";

export function PodiumAvatar({
  name,
  rank,
  size,
  highlight,
}: {
  name: string;
  rank: number;
  size: "lg" | "md" | "sm";
  highlight?: boolean;
}) {
  const avatarSize = size === "lg" ? 120 : size === "md" ? 95 : 85;

  return (
    <div className="absolute -top-16">
      <div
        className={`
          absolute inset-0 rounded-full blur-xl opacity-60
          ${rankStyles[rank].halo}
        `}
      />
      <ArtistAvatar name={name} size={avatarSize} highlight={highlight} />
    </div>
  );
}
