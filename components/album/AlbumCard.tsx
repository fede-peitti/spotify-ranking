import { motion } from "framer-motion";
import type { Album } from "@/types/album";
import { albumImage } from "@/lib/albumImage";

type Props = {
  album: Album;
  rank: number;
  gridArea: string;
};

export function AlbumCard({ album, rank, gridArea }: Props) {
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
          bg-[var(--podium-start)]
          shadow-[0_15px_40px_var(--album-shadow)]
          ${isFirst
            ? "shadow-[0_25px_60px_var(--album-shadow-strong)]"
            : ""}
          ${isSecond
            ? "ring-2 ring-[var(--podium-border)] shadow-[0_20px_50px_var(--spotipy-blue-soft)]"
            : ""}
          ${isThird
            ? "ring-2 ring-[var(--podium-border)] shadow-[0_18px_45px_var(--spotipy-blue-soft)]"
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
            border border-[var(--spotipy-blue-soft)]
            bg-[var(--album-score-bg)] text-white backdrop-blur-md
            font-semibold
            ${isFirst ? "px-4 py-2 text-base" : ""}
            ${isSecond ? "px-3.5 py-1.5 text-sm" : ""}
            ${isThird ? "px-3.5 py-1.5 text-sm" : ""}
            ${!isTop3 ? "px-3 py-1 text-xs text-[var(--text-primary)]" : ""}
          `}
        >
          {album.avg}
        </div>

        {/* OVERLAY */}
        <div
          className={`
            absolute inset-0 flex flex-col justify-end
            bg-gradient-to-t from-[var(--album-overlay)] via-[var(--album-overlay-mid)] to-transparent
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

          <p className="text-xs text-[var(--text-primary)]">
            {album.artists}
          </p>

          <p className="text-xs text-[var(--text-muted)]">
            {album.count} songs
          </p>
        </div>
      </div>
    </motion.div>
  );
}