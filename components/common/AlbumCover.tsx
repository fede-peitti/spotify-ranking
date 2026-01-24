import { albumImage } from "@/lib/albumimage";

type Props = {
  album: string;
};

export function AlbumCover({ album }: Props) {
  return (
    <img
      src={albumImage(album)}
      alt={album}
      className="h-full w-full object-cover"
      onError={(e) => {
        e.currentTarget.src = "/albums/unown.png";
      }}
    />
  );
}
