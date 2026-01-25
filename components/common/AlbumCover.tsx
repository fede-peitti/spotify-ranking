import { albumImage } from "@/lib/albumImage";
import { Album } from "@/types/album";

type Props = {
  album: Album;
};

export function AlbumCover({ album }: Props) {
  return (
    <img
      src={albumImage(album.Album)}
      alt={album.Album}
      className="h-full w-full object-cover"
      onError={(e) => {
        e.currentTarget.src = "/albums/unown.jpg";
      }}
    />
  );
}
