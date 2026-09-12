import { motion } from "framer-motion";
import type { Album } from "@/types/album";
import { albumImage } from "@/lib/albumImage";

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

function AlbumCard({
  album,
  rank,
  gridArea,
}: {
  album: Album;
  rank: number;
  gridArea: string;
}) {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;
  const isTop3 = rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: (rank - 1) * 0.05,
        duration: 0.45,
      }}
      style={{ gridArea }}
      className="min-h-0 min-w-0 p-2"
    >
      <div
        className={`
          group relative h-full w-full overflow-hidden rounded-3xl
          bg-[#121826]
          shadow-[0_15px_40px_rgba(0,0,0,0.35)]
          ${isFirst
            ? "shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
            : ""}
          ${isSecond
            ? "ring-2 ring-white/20 shadow-[0_20px_50px_rgba(92,141,255,0.2)]"
            : ""}
          ${isThird
            ? "ring-2 ring-white/10 shadow-[0_18px_45px_rgba(92,141,255,0.15)]"
            : ""}
        `}
      >
        <img
          src={albumImage(album.Album)}
          alt={album.Album}
          className={`
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-110
            ${isFirst ? "brightness-105" : ""}
          `}
        />

        {/* SCORE */}
        <div
          className={`
            absolute left-3 top-3 rounded-full
            border border-[#5C8DFF]/50
            bg-black/30 text-white backdrop-blur-md
            font-semibold
            ${isFirst ? "px-4 py-2 text-base" : ""}
            ${isSecond ? "px-3.5 py-1.5 text-sm" : ""}
            ${isThird ? "px-3.5 py-1.5 text-sm" : ""}
            ${!isTop3 ? "px-3 py-1 text-xs opacity-80" : ""}
          `}
        >
          {album.avg}
        </div>

        {/* OVERLAY */}
        <div
          className={`
            absolute inset-0 flex flex-col justify-end
            bg-gradient-to-t from-black/85 via-black/45 to-transparent
            p-4 opacity-0 transition-opacity duration-300
            group-hover:opacity-100
            ${isFirst ? "p-6" : ""}
          `}
        >
          <p
            className={`
              font-bold leading-tight
              ${isFirst ? "text-lg" : "text-sm"}
            `}
          >
            {album.Album}
          </p>

          <p className="text-xs opacity-80">
            {album.artists}
          </p>

          <p className="text-xs opacity-60">
            {album.count} songs
          </p>
        </div>
      </div>
    </motion.div>
  );
}