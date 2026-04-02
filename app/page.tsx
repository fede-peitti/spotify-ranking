"use client";

import { useEffect, useState } from "react";

import { Podium } from "@/components/podium/Podium";
import { RankingList } from "@/components/ranking/RankingList";
import { SectionReveal } from "@/components/layout/SectionReveal";

import type { Artist } from "@/types/artist";

import type { Album } from "@/types/album";
import { AlbumMosaic } from "@/components/album/AlbumMosaic";

export default function Page() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    fetch("/artists.json")
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          if (b.avg !== a.avg) {
            return b.avg - a.avg;
          }

          if (b.count !== a.count) {
            return b.count - a.count;
          }

          return a.Artist.localeCompare(b.Artist);
        });

        setArtists(sorted);
      });
  }, []);

  useEffect(() => {
    fetch("/albums.json")
      .then((r) => r.json())
      .then((data: Album[]) => {
        setAlbums(data);
      });
  }, []);

  return (
    <main className="bg-[#0B0F17] text-white">
      {/* HERO */}
      <section className="min-h-[110vh] flex flex-col justify-center px-10">
        <SectionReveal>
          <h1 className="text-5xl font-extrabold mb-6">
            🎧 My Personal Artist Ranking
          </h1>
          <p className="max-w-xl text-lg opacity-70">
            Data from years of listening to different artists, presented
            visually.
          </p>
        </SectionReveal>
      </section>

      {/* ARTISTS */}
      <section className="min-h-[110vh] flex flex-col justify-center px-10 gap-16">
        <SectionReveal>
          <div>
            <h2 className="text-3xl font-bold mb-2">Artists</h2>
            <p className="opacity-60">
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

      {/* ALBUMS */}
      <section className="min-h-[110vh] flex flex-col justify-center px-10 gap-16">
        <SectionReveal>
          <div>
            <h2 className="text-3xl font-bold mb-2">Albums</h2>
            <p className="opacity-60">
              The albums that defined my listening experience.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal>
          <AlbumMosaic albums={albums} />
        </SectionReveal>
      </section>

      {/* STORYTELLING */}
      <section className="min-h-[110vh] flex flex-col justify-center px-10">
        <SectionReveal>
          <h2 className="text-3xl font-bold mb-4">Now, Musical Stats</h2>

          <p className="max-w-xl opacity-70">...</p>
        </SectionReveal>
      </section>
    </main>
  );
}
