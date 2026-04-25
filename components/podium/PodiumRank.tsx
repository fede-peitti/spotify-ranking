export function PodiumRank({
  rank,
  textClass,
}: {
  rank: number;
  textClass: string;
}) {
  return (
    <div className={`absolute top-4 text-sm font-bold ${textClass} opacity-80`}>
      #{rank}
    </div>
  );
}
