import { artistImage } from "@/lib/image";

type Props = {
  name: string;
  size?: number;
  highlight?: boolean;
};

export function ArtistAvatar({ name, size = 120, highlight = false }: Props) {
  return (
    <img
      src={artistImage(name)}
      alt={name}
      width={size}
      height={size}
      className={`
        mx-auto
        rounded-full
        object-cover
        ${highlight ? "ring-4 ring-yellow-400/70" : ""}
      `}
      onError={(e) => {
        e.currentTarget.src = "/artists/unown.jpg";
      }}
    />
  );
}
