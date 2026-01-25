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
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white px-10 py-12">
      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-4xl font-extrabold"
      >
        🎵 Ranking Personal de Artistas
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

      {/* ⬇️ NUEVO: ALBUM MOSAIC */}
      <Section title="Álbumes destacados" className="mt-20">
        <AlbumMosaic albums={albums.slice(0, 12)} />
      </Section>
    </main>
  );
}
