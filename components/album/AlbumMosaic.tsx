import type { Album } from "@/types/album";
import { AlbumCover } from "../common/AlbumCover";
import { motion } from "framer-motion";

type Props = {
  albums: Album[];
};

export function AlbumMosaic({ albums }: Props) {
  const top10 = albums.slice(0, 10);

  return (
    <div className="grid grid-cols-4 auto-rows-[160px] gap-6">
      {top10.map((album, index) => {
        const layout =
          index === 0
            ? "col-span-2 row-span-2"
            : index < 3
              ? "col-span-2 row-span-1"
              : "col-span-1 row-span-1";

        return (
          <motion.div
            key={`${album.Album}-${album.Artist}`}
            className={layout}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-900">
              <AlbumCover album={album.Album} />

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                <p className="text-sm font-bold leading-tight">{album.Album}</p>
                <p className="text-xs opacity-70">{album.Artist}</p>
                <p className="mt-1 text-xs opacity-60">
                  ⭐ {album.avg} · {album.count} canciones
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
