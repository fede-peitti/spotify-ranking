import { usePodiumStyles } from "./usePodiumStyles";

export function PodiumInfo({
  name,
  count,
  rank,
}: {
  name: string;
  count: number;
  rank: number;
}) {
  const s = usePodiumStyles(rank, "lg");

  return (
    <div
      className={`
        absolute w-full px-4 text-center z-10
        bottom-0 ${s.pedestal}
        flex flex-col items-center justify-center
      `}
    >
      {/* Text size based on name length */}
      <p className="text-[14px] opacity-80 truncate max-w-[99%] mx-auto">
        {name}
      </p>

      <p className="text-[11px] opacity-50">{count} songs</p>
    </div>
  );
}
