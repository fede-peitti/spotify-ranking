"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Crown, Music } from "lucide-react";

function slugify(name) {
  if ("物語シリーズ" === name) {
    return "monogatari";
  }

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Podium({ artists }) {
  const top3 = artists.slice(0, 3);

  return (
    <div className="grid grid-cols-3 gap-6 items-end">
      {top3.map((a, i) => (
        <motion.div
          key={a.Artist}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          <Card
            className={`text-center shadow-xl rounded-2xl ${
              i === 0 ? "scale-110 border-yellow-400" : ""
            }`}
          >
            <CardContent className="p-6">
              <img
                src={`/artists/${slugify(a.Artist)}.jpg`}
                onError={(e) => {
                  e.currentTarget.src = `/artists/unown.jpg`;
                }}
                alt={a.Artist}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                style={{
                  boxShadow: `0 0 30px rgba(${Math.min(
                    a.avg * 25,
                    255
                  )}, 200, 100, 0.4)`,
                }}
              />
              <div className="flex justify-center mb-2">
                {i === 0 && <Crown className="text-yellow-500" />}
              </div>
              <h2 className="text-xl font-bold">{a.Artist}</h2>
              <p className="text-3xl font-extrabold mt-2">{a.avg}</p>
              <p className="text-sm opacity-70">{a.count} songs</p>
              <Badge className="mt-2">#{i + 1}</Badge>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function RankingSlider({ artists }) {
  return (
    <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
      {artists.map((a, idx) => (
        <motion.div
          key={a.Artist}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.03 }}
        >
          <Card className="rounded-xl">
            <CardContent className="flex items-center gap-4 p-4">
              <span className="text-lg font-bold w-6">{idx + 1}</span>
              <img
                src={`/artists/${slugify(a.Artist)}.jpg`}
                onError={(e) => {
                  e.currentTarget.src = `/artists/unown.jpg`;
                }}
                alt={a.Artist}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
                style={{
                  boxShadow: `0 0 30px rgba(${Math.min(
                    a.avg * 25,
                    255
                  )}, 200, 100, 0.4)`,
                }}
              />
              <div className="flex-1">
                <p className="font-semibold">{a.Artist}</p>
                <p className="text-sm opacity-70">
                  {a.count} songs · avg {a.avg}
                </p>
              </div>
              <Music className="opacity-50" />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

function AlbumMosaic({ albums }) {
  const top10 = [...albums].sort((a, b) => b.avg - a.avg).slice(0, 10);

  return (
    <div className="grid grid-cols-4 gap-6">
      {top10.map((a, i) => {
        const size =
          i === 0
            ? "col-span-2 row-span-2"
            : i < 4
            ? "col-span-2 row-span-1"
            : "col-span-1 row-span-1";

        return (
          <motion.div
            key={`${a.Album}-${i}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={size}
          >
            {/* CUADRADO REAL */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src={`https://source.unsplash.com/600x600/?album,cover,${encodeURIComponent(
                  a.Album
                )}`}
                alt={a.Album}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* SCORE */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">
                ⭐ {a.avg}
              </div>

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <p className="font-bold leading-tight">{a.Album}</p>
                <p className="text-sm opacity-80">{a.Artist}</p>
                <p className="text-xs opacity-70 mt-1">{a.count} canciones</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ==============================
// MAIN DASHBOARD
// ==============================

export default function Dashboard() {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("/artists.json")
      .then((r) => r.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.avg - a.avg);
        setArtists(sorted);
      });
  }, []);

  useEffect(() => {
    fetch("/albums.json")
      .then((r) => r.json())
      .then(setAlbums);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-10"
      >
        🎵 Ranking Personal de Artistas
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6">Podio</h2>
          <Podium artists={artists} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Ranking completo</h2>
          <RankingSlider artists={artists} />
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-extrabold mb-8">💿 Top 10 Álbumes</h2>
        <AlbumMosaic albums={albums} />
      </div>
    </div>
  );
}
