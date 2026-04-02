import type { Artist } from "@/types/artist";
import { PodiumCard } from "./PodiumCard";

type Props = {
  artists: Artist[];
};

export function Podium({ artists }: { artists: Artist[] }) {
  const top3 = artists.slice(0, 3);

  if (top3.length < 3) return null;

  const [first, second, third] = top3;

  return (
    <div className="flex items-end justify-center gap-8">
      {/* SECOND */}
      <PodiumCard artist={second} rank={2} size="md" />

      {/* FIRST */}
      <PodiumCard artist={first} rank={1} size="lg" highlight />

      {/* THIRD */}
      <PodiumCard artist={third} rank={3} size="sm" />
    </div>
  );
}
