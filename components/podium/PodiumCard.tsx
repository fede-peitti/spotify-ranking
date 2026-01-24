import { motion } from "framer-motion";
import { Crown } from "lucide-react";

import type { Artist } from "@/types/artist";

import { ArtistAvatar } from "../common/ArtistAvatar";
import { ScoreBadge } from "../common/ScoreBadge";
import { Card, CardContent } from "../ui/card";

type Props = {
  artist: Artist;
  rank: number;
};

export function PodiumCard({ artist, rank }: Props) {
  const isWinner = rank === 1;
  const offset = rank === 1 ? "mb-0" : rank === 2 ? "mb-8" : "mb-15";

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isWinner ? "scale-110" : ""} ${offset}`}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 14,
      }}
    >
      <Card
        className={`
    rounded-3xl text-center
     backdrop-blur
    ${
      isWinner
        ? "border-2 border-yellow-400 shadow-2xl shadow-yellow-400/20"
        : "border border-white/10"
    }
  `}
      >
        <CardContent className="p-8">
          <ArtistAvatar name={artist.Artist} size={140} highlight={isWinner} />

          {isWinner && <Crown className="mx-auto mt-3 text-yellow-400" />}

          <h2 className="mt-4 text-xl font-bold">{artist.Artist}</h2>

          <p className="mt-2 text-5xl font-extrabold tracking-tight">
            {artist.avg}
          </p>

          <p className="text-sm opacity-70">{artist.count} canciones</p>

          <ScoreBadge rank={rank} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
