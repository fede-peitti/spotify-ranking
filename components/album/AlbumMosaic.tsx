import type { Album } from "@/types/album";
import { AlbumCard } from "./AlbumCard";

type Props = {
  albums: Album[];
};

const positions = [
  "album1",
  "album2",
  "album3",
  "album4",
  "album5",
  "album6",
  "album7",
  "album8",
  "album9",
  "album10",
];

const gridAreas = `
  "album1 album1 album1 album2 album2 album4"
  "album1 album1 album1 album2 album2 album5"
  "album1 album1 album1 album6 album3 album3"
  "album7 album8 album9 album10 album3 album3"
`;

export function AlbumMosaic({ albums }: Props) {
  const top10 = [...albums]
    .sort((a, b) => {
      if (b.avg !== a.avg) return b.avg - a.avg;
      if (b.count !== a.count) return b.count - a.count;
      return a.Album.localeCompare(b.Album);
    })
    .slice(0, 10);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div
        className="grid aspect-[3/2] grid-cols-6 grid-rows-4"
        style={{
          gridTemplateAreas: gridAreas,
        }}
      >
        {top10.map((album, i) => (
          <AlbumCard
            key={`${album.Album}-${i}`}
            album={album}
            rank={i + 1}
            gridArea={positions[i]}
          />
        ))}
      </div>
    </div>
  );
}