import type { Artist } from "@/types/artist";
import { PodiumCard } from "./PodiumCard";

type Props = {
  artists: Artist[];
};

export function Podium({ artists }: Props) {
  const top3 = artists.slice(0, 3);
  if (top3.length < 3) return null;

  const [first, second, third] = top3;

  return (
    <div className="flex items-end justify-center gap-6 md:gap-10 mt-16">
      {/* 2 */}
      <PodiumCard artist={second} rank={2} size="md" />

      {/* 1 */}
      <PodiumCard artist={first} rank={1} size="lg" highlight />

      {/* 3 */}
      <PodiumCard artist={third} rank={3} size="sm" />
    </div>
  );
}
