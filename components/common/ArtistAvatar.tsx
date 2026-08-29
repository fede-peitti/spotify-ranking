import { artistImage } from "@/lib/image";

type Props = {
  name: string;
  size?: number;
  rank?: number;
};

export function ArtistAvatar({ name, size = 120, rank }: Props) {
  const rankRing =
    rank === 1
      ? "ring-4 ring-yellow-400/80 shadow-[0_0_30px_rgba(234,179,8,0.35)]"
      : rank === 2
        ? "ring-4 ring-slate-300/70 shadow-[0_0_25px_rgba(203,213,225,0.25)]"
        : rank === 3
          ? "ring-4 ring-orange-300/60 shadow-[0_0_20px_rgba(180,120,70,0.25)]"
          : "";

  return (
    <img
      src={artistImage(name)}
      alt={name}
      width={size}
      height={size}
      className={`
        mx-auto
        aspect-square
        rounded-full
        object-cover
        ${rankRing}
      `}
      onError={(e) => {
        e.currentTarget.src = "/artists/unown.jpg";
      }}
    />
  );
}