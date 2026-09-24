export type Overview = {
  songs: number;
  artists: number;
  albums: number;
  hours: number;
  avgScore: number;
  yearsSpanned: number;
  dateRange: [string, string];
};

export type ScatterPoint = {
  artist: string;
  avg: number;
  count: number;
};

export type RatingBin = { bin: string; count: number };

export type FeatureRow = {
  Song: string;
  Artist: string;
  Album: string;
  score: number;
  Energy: number;
  Danceability: number;
  Acoustic: number;
  Instrumental: number;
  Valence: number;
  Speech: number;
  Live: number;
  Loud: number;
  BPM: number;
  year: number;
  monthAdded: string;
};

export type TimelinePoint = {
  monthAdded: string;
  count: number;
  avgScore: number;
};

export type DecadePoint = { decade: number; songs: number; avgScore: number };

export type GenrePoint = { genre: string; count: number; avgScore: number };

export type NetworkData = {
  nodes: { id: string }[];
  links: { source: string; target: string; weight: number }[];
};