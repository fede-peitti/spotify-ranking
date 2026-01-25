import { motion } from "framer-motion";
import type { Album } from "@/types/album";
import { albumImage } from "@/lib/albumImage";

type Props = {
  albums: Album[];
};

export function AlbumMosaic({ albums }: Props) {
  const top10 = [...albums]
    .sort((a, b) => {
      if (b.avg !== a.avg) return b.avg - a.avg;
      if (b.count !== a.count) return b.count - a.count;
      return a.Album.localeCompare(b.Album);
    })
    .slice(0, 10);

  return (
    <div className="grid grid-cols-4 gap-6">
      {top10.map((album, i) => {
        const layout =
          i === 0
            ? "col-span-2"
            : i === 1 || i === 2
              ? "col-span-2"
              : "col-span-1";

        return (
          <motion.div
            key={`${album.Album}-${i}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={layout}
          >
            {/* CUADRADO REAL */}
            <div className="group relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl">
              <img
                src={albumImage(album.Album)}
                alt={album.Album}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* SCORE */}
              <div className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-sm font-bold backdrop-blur">
                ⭐ {album.avg}
              </div>

              {/* OVERLAY */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-sm font-bold leading-tight">{album.Album}</p>
                <p className="text-xs opacity-80">
                  {album.artists ?? album.Artist}
                </p>
                <p className="text-xs opacity-60">{album.count} canciones</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
