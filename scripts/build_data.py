
import json
from itertools import combinations
from pathlib import Path

import pandas as pd

PUBLIC = Path("public")
STATS = PUBLIC / "stats"
STATS.mkdir(parents=True, exist_ok=True)


def write_json(path: Path, data) -> None:
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False),
        encoding="utf-8",
    )


# ---------------------------------------------------------------
# LOAD
# ---------------------------------------------------------------
rows = []

for score in range(1, 11):
    frame = pd.read_csv(f"scripts/p{score}.csv")
    frame["score"] = score
    rows.append(frame)

tracks = pd.concat(rows, ignore_index=True)

tracks["Album Date"] = pd.to_datetime(
    tracks["Album Date"], errors="coerce"
)
tracks["Added At"] = pd.to_datetime(
    tracks["Added At"], errors="coerce"
)
tracks["Duration"] = pd.to_timedelta(
    "00:" + tracks["Duration"].astype(str),
    errors="coerce",
).dt.total_seconds()

# Preserve one row per rated track for global statistics.
tracks["_track_id"] = tracks.index

# Explode artists for artist-level aggregations.
df = tracks.copy()
df["Artist"] = df["Artist"].fillna("").astype(str).str.split(",")
df = df.explode("Artist")
df["Artist"] = df["Artist"].str.strip()
df = df[df["Artist"] != ""]

# ---------------------------------------------------------------
# ARTISTS.JSON — at least 15 rated tracks to be considered
# ---------------------------------------------------------------
artists = (
    df.groupby("Artist")
    .agg(
        avg=("score", "mean"),
        count=("_track_id", "nunique"),
    )
    .reset_index()
)

artists = artists[artists["count"] >= 15].copy()
artists["avg"] = artists["avg"].round(2)

artists = artists.sort_values(
    ["avg", "count", "Artist"],
    ascending=[False, False, True],
)

artists.to_json(
    PUBLIC / "artists.json",
    orient="records",
    force_ascii=False,
)

# ---------------------------------------------------------------
# ALBUMS.JSON — at least 5 rated tracks to be considered
# ---------------------------------------------------------------
songs = (
    df.groupby(["Song", "Album", "Album Date"], as_index=False)
    .agg(
        score=("score", "first"),
        artists=("Artist", lambda values: ", ".join(sorted(set(values)))),
    )
)

albums = (
    songs.groupby(["Album", "Album Date"])
    .agg(
        avg=("score", "mean"),
        count=("Song", "count"),
        artists=(
            "artists",
            lambda values: ", ".join(
                sorted({
                    artist.strip()
                    for value in values
                    for artist in value.split(",")
                    if artist.strip()
                })
            ),
        ),
    )
    .reset_index()
)

albums = albums[albums["count"] >= 5].copy()
albums["avg"] = albums["avg"].round(2)

albums = albums.sort_values(
    ["avg", "count", "Album"],
    ascending=[False, False, True],
)

albums["Album Date"] = albums["Album Date"].dt.strftime("%Y-%m-%d")

albums.to_json(
    PUBLIC / "albums.json",
    orient="records",
    force_ascii=False,
)

# ---------------------------------------------------------------
# OVERVIEW — dashboard
# ---------------------------------------------------------------
valid_dates = tracks["Album Date"].dropna()

overview = {
    "songs": int(tracks["_track_id"].nunique()),
    "artists": int(len(artists)),
    "albums": int(len(albums)),
    "hours": round(tracks["Duration"].sum() / 3600, 1),
    "avgScore": round(float(tracks["score"].mean()), 2),
    "yearsSpanned": (
        int(valid_dates.dt.year.max() - valid_dates.dt.year.min())
        if not valid_dates.empty
        else 0
    ),
    "dateRange": (
        [
            valid_dates.min().strftime("%Y-%m-%d"),
            valid_dates.max().strftime("%Y-%m-%d"),
        ]
        if not valid_dates.empty
        else ["", ""]
    ),
}

write_json(STATS / "overview.json", overview)

# ---------------------------------------------------------------
# SCATTER — one point per artist
# ---------------------------------------------------------------
scatter = artists[["Artist", "avg", "count"]].rename(
    columns={"Artist": "artist"}
)

scatter.to_json(
    STATS / "scatter.json",
    orient="records",
    force_ascii=False,
)

# ---------------------------------------------------------------
# RATING DISTRIBUTION
# ---------------------------------------------------------------
bins = [0, 2, 4, 6, 8, 10]
labels = ["0–2", "2–4", "4–6", "6–8", "8–10"]

hist = pd.cut(
    artists["avg"],
    bins=bins,
    labels=labels,
    include_lowest=True,
)

distribution = (
    hist.value_counts()
    .reindex(labels)
    .fillna(0)
    .astype(int)
)

write_json(
    STATS / "rating_distribution.json",
    [
        {"bin": str(label), "count": int(count)}
        for label, count in distribution.items()
    ],
)

# ---------------------------------------------------------------
# FEATURES
# ---------------------------------------------------------------
features = df[
    [
        "Song", "Artist", "Album", "score",
        "Energy", "Dance", "Acoustic", "Instrumental",
        "Valence", "Speech", "Live", "Loud (Db)", "BPM",
        "Album Date", "Added At",
    ]
].copy()

features["year"] = features["Album Date"].dt.year
features["monthAdded"] = features["Added At"].dt.to_period("M").astype(str)

features = features.rename(
    columns={
        "Loud (Db)": "Loud",
        "Dance": "Danceability",
    }
)

features.to_json(
    STATS / "features.json",
    orient="records",
    force_ascii=False,
)

# ---------------------------------------------------------------
# TIMELINE — tracks added per month
# ---------------------------------------------------------------
timeline = (
    features.groupby("monthAdded")
    .agg(
        count=("Song", "count"),
        avgScore=("score", "mean"),
    )
    .reset_index()
    .sort_values("monthAdded")
)

timeline["avgScore"] = timeline["avgScore"].round(2)

timeline.to_json(
    STATS / "timeline.json",
    orient="records",
    force_ascii=False,
)

# ---------------------------------------------------------------
# DECADES
# ---------------------------------------------------------------
features["decade"] = (
    features["year"] // 10 * 10
).astype("Int64")

decades = (
    features.groupby("decade")
    .agg(
        songs=("Song", "count"),
        avgScore=("score", "mean"),
    )
    .reset_index()
    .dropna()
)

decades["decade"] = decades["decade"].astype(int)
decades["avgScore"] = decades["avgScore"].round(2)

decades.to_json(
    STATS / "decades.json",
    orient="records",
    force_ascii=False,
)

# ---------------------------------------------------------------
# GENRES — top 20 by number of rated tracks
# ---------------------------------------------------------------
genre_df = tracks[["Genres", "score", "_track_id"]].copy()
genre_df["Genres"] = genre_df["Genres"].fillna("").astype(str).str.split(",")
genre_df = genre_df.explode("Genres")
genre_df["Genres"] = genre_df["Genres"].str.strip()

genre_df = genre_df[
    genre_df["Genres"].ne("")
    & genre_df["Genres"].str.lower().ne("nan")
].drop_duplicates(["_track_id", "Genres"])

genres = (
    genre_df.groupby("Genres")
    .agg(
        count=("_track_id", "nunique"),
        avgScore=("score", "mean"),
    )
    .reset_index()
    .sort_values(
        ["count", "avgScore", "Genres"],
        ascending=[False, False, True],
    )
    .head(20)
)

genres["avgScore"] = genres["avgScore"].round(2)
genres = genres.rename(columns={"Genres": "genre"})

genres.to_json(
    STATS / "genres.json",
    orient="records",
    force_ascii=False,
)

# ---------------------------------------------------------------
# NETWORK — shared albums between artists
# ---------------------------------------------------------------
pairs = {}

for _, group in df.groupby("Album"):
    names = sorted(set(group["Artist"]))

    for artist_a, artist_b in combinations(names, 2):
        pair = (artist_a, artist_b)
        pairs[pair] = pairs.get(pair, 0) + 1

nodes = [{"id": artist} for artist in artists["Artist"]]
node_ids = {node["id"] for node in nodes}

links = [
    {"source": artist_a, "target": artist_b, "weight": weight}
    for (artist_a, artist_b), weight in pairs.items()
    if artist_a in node_ids and artist_b in node_ids
]

write_json(
    STATS / "network.json",
    {"nodes": nodes, "links": links},
)

# ---------------------------------------------------------------
# STATS — centralized data layer
# ---------------------------------------------------------------

# Top artist: highest average, then count, then alphabetical name.
top_artist = artists.sort_values(
    ["avg", "count", "Artist"],
    ascending=[False, False, True],
).head(1)

# Most rated artist: highest track count, then average, then name.
most_rated_artist = artists.sort_values(
    ["count", "avg", "Artist"],
    ascending=[False, False, True],
).head(1)


def artist_summary(row):
    return {
        "artist": str(row["Artist"]),
        "avg_score": round(float(row["avg"]), 2),
        "rated_tracks": int(row["count"]),
    }


# Count each rated track once, including collaborations.
score_counts = (
    tracks.groupby("score")["_track_id"]
    .nunique()
    .reindex(range(1, 11), fill_value=0)
)

score_distribution = [
    {"score": int(score), "count": int(count)}
    for score, count in score_counts.items()
]

# Evolution by album release year.
yearly = tracks.dropna(subset=["Album Date"]).copy()
yearly["year"] = yearly["Album Date"].dt.year.astype(int)

year_evolution = (
    yearly.groupby("year")
    .agg(
        songs=("_track_id", "nunique"),
        avg_score=("score", "mean"),
    )
    .reset_index()
    .sort_values("year")
)

year_evolution["avg_score"] = year_evolution["avg_score"].round(2)

stats = {
    "total_artists": int(len(artists)),
    "total_albums": int(len(albums)),
    "total_songs": int(tracks["_track_id"].nunique()),
    "avg_score_global": round(float(tracks["score"].mean()), 2),
    "top_artist": (
        artist_summary(top_artist.iloc[0])
        if not top_artist.empty
        else None
    ),
    "most_rated_artist": (
        artist_summary(most_rated_artist.iloc[0])
        if not most_rated_artist.empty
        else None
    ),
    "score_distribution": score_distribution,
    "year_evolution": [
        {
            "year": int(row["year"]),
            "songs": int(row["songs"]),
            "avg_score": float(row["avg_score"]),
        }
        for _, row in year_evolution.iterrows()
    ],
    "genres": [
        {
            "genre": str(row["genre"]),
            "count": int(row["count"]),
            "avg_score": float(row["avgScore"]),
        }
        for _, row in genres.iterrows()
    ],
}

write_json(STATS / "stats.json", stats)

print(
    "Data build completed: "
    f"{len(artists)} artists, {len(albums)} albums, "
    f"{stats['total_songs']} rated tracks. "
    f"Output: {PUBLIC}/ and {STATS}/"
)
