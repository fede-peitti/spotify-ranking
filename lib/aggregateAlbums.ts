import type { Album } from "@/types/album";

type SongRow = {
  Album: string;
  Artist: string;
  score: number;
};

export function aggregateAlbums(songs: SongRow[]): Album[] {
  const map = new Map<
    string,
    { total: number; count: number; Artist: string }
  >();

  for (const song of songs) {
    const key = `${song.Album}__${song.Artist}`;

    if (!map.has(key)) {
      map.set(key, {
        total: 0,
        count: 0,
        Artist: song.Artist,
      });
    }

    const entry = map.get(key)!;
    entry.total += song.score;
    entry.count += 1;
  }

  const albums: Album[] = Array.from(map.entries()).map(([key, v]) => {
    const [Album] = key.split("__");

    return {
      Album,
      Artist: v.Artist,
      avg: +(v.total / v.count).toFixed(2),
      count: v.count,
    };
  });

  // mismo criterio de orden que artistas
  return albums.sort((a, b) => {
    if (b.avg !== a.avg) return b.avg - a.avg;
    if (b.count !== a.count) return b.count - a.count;
    return a.Album.localeCompare(b.Album);
  });
}
