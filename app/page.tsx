"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Podium } from "@/components/podium/Podium";
import { RankingList } from "@/components/ranking/RankingList";
import { Section } from "@/components/layout/Section";

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
    <main className="min-h-screen bg-[#0B0F17] text-white px-10 py-14">
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-5xl font-extrabold tracking-tight"
      >
        🎧 Ranking Artistas
      </motion.h1>

      {/* CONTENT */}
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-4">
        <Section title="Podio" className="lg:col-span-3">
          <Podium artists={artists} />
        </Section>

        <Section title="Ranking completo">
          <RankingList artists={artists} />
        </Section>
      </div>

      <div className="my-24 h-px w-full bg-gradient-to-r from-transparent via-[#5C8DFF]/40 to-transparent" />

      {/* ALBUM MOSAIC */}
      <Section title="Álbumes destacados" className="pt-20">
        <AlbumMosaic albums={albums.slice(0, 12)} />
      </Section>
    </main>
  );
}
