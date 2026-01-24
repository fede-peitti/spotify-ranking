import type { Artist } from "@/types/artist";
import { PodiumCard } from "./PodiumCard";

type Props = {
  artists: Artist[];
};

export function Podium({ artists }: Props) {
  const top3 = artists.slice(0, 3);

  return (
    <div className="relative grid grid-cols-3 gap-8 items-end">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

      {top3.map((artist, index) => (
        <PodiumCard key={artist.Artist} artist={artist} rank={index + 1} />
      ))}
    </div>
  );
}
