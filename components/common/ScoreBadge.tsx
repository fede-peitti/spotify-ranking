type Props = {
  rank: number;
};

export function ScoreBadge({ rank }: Props) {
  return (
    <span className="mt-4 inline-block rounded-full bg-[#5C8DFF]/15 border border-[#5C8DFF]/40 px-4 py-1 text-sm font-medium text-[#5C8DFF]">
      #{rank}
    </span>
  );
}
