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

export type RatingBin = {
  bin: string;
  count: number;
};

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

export type DecadePoint = {
  decade: number;
  songs: number;
  avgScore: number;
};

export type GenrePoint = {
  genre: string;
  count: number;
  avgScore: number;
};

export type NetworkData = {
  nodes: { id: string }[];
  links: { source: string; target: string; weight: number }[];
};

// ---------------------------------------------------------------
// CENTRALIZED STATS DATA LAYER
// ---------------------------------------------------------------

export type FeaturedArtist = {
  artist: string;
  avg_score: number;
  rated_tracks: number;
};

export type ScoreDistributionPoint = {
  score: number;
  count: number;
};

export type YearEvolutionPoint = {
  year: number;
  songs: number;
  avg_score: number;
};

export type StatsGenre = {
  genre: string;
  count: number;
  avg_score: number;
};

export type StatsData = {
  total_artists: number;
  total_albums: number;
  total_songs: number;
  avg_score_global: number;
  top_artist: FeaturedArtist | null;
  most_rated_artist: FeaturedArtist | null;
  score_distribution: ScoreDistributionPoint[];
  year_evolution: YearEvolutionPoint[];
  genres: StatsGenre[];
};
