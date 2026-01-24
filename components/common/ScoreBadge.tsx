type Props = {
  rank: number;
};

export function ScoreBadge({ rank }: Props) {
  return (
    <span className="mt-4 inline-block rounded-full bg-black/70 px-4 py-1 text-sm">
      #{rank}
    </span>
  );
}
