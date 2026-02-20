import type { Artist } from "@/types/artist";
import { ArtistAvatar } from "../common/ArtistAvatar";

type Props = {
  artists: Artist[];
};

export function RankingList({ artists }: Props) {
  const rest = artists.slice(3);

  return (
    <div className="max-h-[70vh] overflow-y-auto space-y-2 pr-2">
      {rest.map((artist, index) => (
        <div
          key={artist.Artist}
          className="
  flex items-center gap-3
  rounded-2xl
  bg-[#121826]
  p-3
  transition-all
  hover:bg-[#182235]
  hover:translate-x-1
"
        >
          {/* Rank */}
          <span className="w-4 text-right text-sm font-semibold text-[#5C8DFF]/70">
            {index + 4}
          </span>

          {/* Avatar */}
          <ArtistAvatar name={artist.Artist} size={36} />

          {/* Info */}
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-medium">{artist.Artist}</p>
            <p className="text-xs opacity-60">{artist.count} canciones</p>
          </div>

          {/* Score */}
          <span className="w-13 text-sm font-bold">{artist.avg}</span>
        </div>
      ))}
    </div>
  );
}
