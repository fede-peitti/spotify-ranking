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

export function AlbumMosaic({ albums }: Props) {
  const top10 = [...albums]
    .sort((a, b) => {
      if (b.avg !== a.avg) return b.avg - a.avg;
      if (b.count !== a.count) return b.count - a.count;
      return a.Album.localeCompare(b.Album);
    })
    .slice(0, 10);

  return (
    <div
      className="
        grid
        grid-cols-5
        auto-rows-[150px]
        gap-5
        md:auto-rows-[170px]
        lg:auto-rows-[190px]
      "
      style={{
        gridTemplateAreas: `
          "album1 album1 album2 album3 album3"
          "album1 album1 album2 album4 album5"
          "album6 album7 album8 album8 album9"
          "album6 album7 album10 album10 album9"
        `,
      }}
    >
      {top10.map((album, i) => (
        <motion.div
          key={`${album.Album}-${i}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: i * 0.05,
            duration: 0.45,
          }}
          style={{
            gridArea: positions[i],
          }}
        >
          <div className="group relative h-full w-full overflow-hidden rounded-3xl bg-[#121826] shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
            <img
              src={albumImage(album.Album)}
              alt={album.Album}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* SCORE */}
            <div className="absolute left-3 top-3 rounded-full border border-[#5C8DFF]/50 bg-black/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-md">
              {album.avg}
            </div>

            {/* OVERLAY */}
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="text-sm font-bold leading-tight">
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
      ))}
    </div>
  );
}