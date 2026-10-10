"use client";

import { CountUp } from "@/components/stats/CountUp";
import type { FeaturedArtist as FeaturedArtistData } from "@/types/stats";

type Props = {
  index: string;
  eyebrow: string;
  artist: FeaturedArtistData | null;
};

export function FeaturedArtist({ index, eyebrow, artist }: Props) {
  return (
    <article className="py-6 md:px-8 md:first:pl-0 md:last:pr-0">
      <div className="flex items-center gap-3">
        <span className="text-xs tabular-nums text-[#5C8DFF]">{index}</span>
        <span className="text-xs uppercase tracking-[0.16em] text-white/45">
          {eyebrow}
        </span>
      </div>

      {artist ? (
        <>
          <h4 className="mt-5 break-words text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
            {artist.artist}
          </h4>

          <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="text-xs text-white/40">Average rating</p>
              <p className="mt-1 text-xl font-medium">
                <CountUp value={artist.avg_score} decimals={2} />
                <span className="ml-1 text-sm text-white/35">/10</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-white/40">Rated tracks</p>
              <p className="mt-1 text-xl font-medium">
                {artist.rated_tracks.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-5 text-white/40">No data available.</p>
      )}
    </article>
  );
}