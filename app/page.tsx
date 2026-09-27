"use client";

import { SectionReveal } from "@/components/layout/SectionReveal";
import { Podium } from "@/components/podium/Podium";
import { RankingList } from "@/components/ranking/RankingList";
import { AlbumMosaic } from "@/components/album/AlbumMosaic";
import { OverviewStats } from "@/components/stats/charts/OverviewStats";
import { RatingVsCountScatter } from "@/components/stats/charts/RatingVsCountScatter";

import { useData } from "@/hooks/useData";
import type { Artist } from "@/types/artist";
import type { Album } from "@/types/album";

export default function Page() {
  const { data: artistsRaw } = useData<Artist[]>("/artists.json");
  const { data: albums } = useData<Album[]>("/albums.json");

  const artists = artistsRaw
    ? [...artistsRaw].sort((a, b) => {
        if (b.avg !== a.avg) return b.avg - a.avg;
        if (b.count !== a.count) return b.count - a.count;
        return a.Artist.localeCompare(b.Artist);
      })
    : [];

  return (
    <main className="bg-background text-white">
      <section className="min-h-[110vh] flex flex-col justify-center px-10">
        <SectionReveal>
          <h1 className="text-5xl font-extrabold mb-6">
            🎧 Spotify Artist Ranking
          </h1>
          <p className="max-w-xl text-lg text-copy-secondary">
            Data from years of listening to different artists, presented
            visually.
          </p>
        </SectionReveal>
      </section>

      <section className="min-h-[110vh] flex flex-col justify-center px-10 gap-16">
        <SectionReveal>
          <div>
            <h2 className="text-3xl font-bold mb-2">Artists</h2>
            <p className="text-copy-muted">
              My favorites based on accumulated ratings.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal>
          <Podium artists={artists} />
        </SectionReveal>

        <SectionReveal>
          <RankingList artists={artists} />
        </SectionReveal>
      </section>

      <section className="min-h-[110vh] flex flex-col justify-center px-10 gap-16">
        <SectionReveal>
          <div>
            <h2 className="text-3xl font-bold mb-2">Albums</h2>
            <p className="text-copy-muted">
              The albums that defined my listening experience.
            </p>
          </div>
        </SectionReveal>
        <SectionReveal>
          <AlbumMosaic albums={albums ?? []} />
        </SectionReveal>
      </section>

      {/* STATS — new scrollytelling chapter */}
      <section className="min-h-[110vh] flex flex-col justify-center px-10 gap-24 py-32">
        <OverviewStats />
        <RatingVsCountScatter />
      </section>
    </main>
  );
}