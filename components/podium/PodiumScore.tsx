import { usePodiumStyles } from "./usePodiumStyles";

export function PodiumScore({ score, rank }: { score: number; rank: number }) {
  const s = usePodiumStyles(rank, "lg");

  const size = rank === 1 ? "text-6xl" : rank === 2 ? "text-4xl" : "text-3xl";

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <p className={`${size} -translate-y-3 font-bold ${s.text} leading-none`}>
        {score}
      </p>
    </div>
  );
}