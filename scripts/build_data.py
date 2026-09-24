import json
import pandas as pd
from pathlib import Path

PUBLIC = Path("public")
STATS = PUBLIC / "stats"
STATS.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------
# LOAD
# ---------------------------------------------------------------
rows = []
for i in range(1, 11):
    df = pd.read_csv(f"scripts/p{i}.csv")
    df["score"] = i
    rows.append(df)

df = pd.concat(rows, ignore_index=True)

# ---------------------------------------------------------------
# CLEANUP
# ---------------------------------------------------------------
df["Album Date"] = pd.to_datetime(df["Album Date"], errors="coerce")
df["Added At"] = pd.to_datetime(df["Added At"], errors="coerce")
df["Duration"] = pd.to_timedelta("00:" + df["Duration"].astype(str)).dt.total_seconds()

# Explode artists (multi-artist tracks)
df["Artist"] = df["Artist"].astype(str).str.split(",")
df = df.explode("Artist")
df["Artist"] = df["Artist"].str.strip()

# Keep a full-artist string for the album-level aggregation
df["_artists_full"] = df.groupby("Album")["Artist"].transform(lambda s: ", ".join(sorted(set(s))))

# ---------------------------------------------------------------
# ARTISTS.JSON 
# ---------------------------------------------------------------
artists = (
    df.groupby("Artist")
    .agg(avg=("score", "mean"), count=("Song", "count"))
    .reset_index()
    .sort_values("avg", ascending=False)
)
artists["avg"] = artists["avg"].round(2)
artists = artists[artists["count"] >= 15]
artists.to_json(PUBLIC / "artists.json", orient="records", force_ascii=False)

# ---------------------------------------------------------------
# ALBUMS.JSON
# ---------------------------------------------------------------
songs = (
    df.groupby(["Song", "Album", "Album Date"], as_index=False)
    .agg(
        score=("score", "first"),
        artists=("Artist", lambda x: ", ".join(sorted(set(x)))),
    )
)

albums = (
    songs.groupby(["Album", "Album Date"])
    .agg(
        avg=("score", "mean"),
        count=("Song", "count"),
        artists=("artists", lambda x: ", ".join(sorted(set(
            a.strip() for artists in x for a in artists.split(",")
        )))),
    )
    .reset_index()
)

albums["avg"] = albums["avg"].round(2)

# Minimum number of songs per album
albums = albums[albums["count"] >= 5]

albums = albums.sort_values(
    by=["avg", "count", "Album"], ascending=[False, False, True]
)

albums["Album Date"] = albums["Album Date"].dt.strftime("%Y-%m-%d")

albums.to_json(PUBLIC / "albums.json", orient="records", force_ascii=False)

# ---------------------------------------------------------------
# OVERVIEW
# ---------------------------------------------------------------
overview = {
    "songs": int(len(df)),
    "artists": int(df["Artist"].nunique()),
    "albums": int(df["Album"].nunique()),
    "hours": round(df["Duration"].sum() / 3600, 1),
    "avgScore": round(df["score"].mean(), 2),
    "yearsSpanned": int(df["Album Date"].dt.year.max() - df["Album Date"].dt.year.min()),
    "dateRange": [
        df["Album Date"].min().strftime("%Y-%m-%d"),
        df["Album Date"].max().strftime("%Y-%m-%d"),
    ],
}
(STATS / "overview.json").write_text(json.dumps(overview, indent=2))

# ---------------------------------------------------------------
# SCATTER — one point per artist
# ---------------------------------------------------------------
scatter = artists[["Artist", "avg", "count"]].rename(
    columns={"Artist": "artist", "avg": "avg", "count": "count"}
)
scatter.to_json(STATS / "scatter.json", orient="records", force_ascii=False)

# ---------------------------------------------------------------
# RATING DISTRIBUTION — bins of avg per artist
# ---------------------------------------------------------------
bins = [0, 2, 4, 6, 8, 10]
labels = ["0–2", "2–4", "4–6", "6–8", "8–10"]
hist = pd.cut(artists["avg"], bins=bins, labels=labels, include_lowest=True)
distribution = hist.value_counts().reindex(labels).fillna(0).astype(int)
dist_list = [{"bin": str(k), "count": int(v)} for k, v in distribution.items()]
(STATS / "rating_distribution.json").write_text(json.dumps(dist_list, indent=2))

# ---------------------------------------------------------------
# FEATURES — one row per song (for energy/valence scatter, radar, etc.)
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
features = features.rename(columns={
    "Loud (Db)": "Loud", "Dance": "Danceability",
})
features.to_json(STATS / "features.json", orient="records", force_ascii=False)

# ---------------------------------------------------------------
# TIMELINE — songs added per month
# ---------------------------------------------------------------
timeline = (
    features.groupby("monthAdded")
    .agg(count=("Song", "count"), avgScore=("score", "mean"))
    .reset_index()
    .sort_values("monthAdded")
)
timeline["avgScore"] = timeline["avgScore"].round(2)
timeline.to_json(STATS / "timeline.json", orient="records", force_ascii=False)

# ---------------------------------------------------------------
# DECADES — albums by decade
# ---------------------------------------------------------------
features["decade"] = (features["year"] // 10 * 10).astype("Int64")
decades = (
    features.groupby("decade")
    .agg(songs=("Song", "count"), avgScore=("score", "mean"))
    .reset_index()
    .dropna()
)
decades["decade"] = decades["decade"].astype(int)
decades["avgScore"] = decades["avgScore"].round(2)
decades.to_json(STATS / "decades.json", orient="records", force_ascii=False)

# ---------------------------------------------------------------
# GENRES — exploded genres with avg score
# ---------------------------------------------------------------
genre_df = df[["Genres", "score"]].copy()
genre_df["Genres"] = genre_df["Genres"].astype(str).str.split(",")
genre_df = genre_df.explode("Genres")
genre_df["Genres"] = genre_df["Genres"].str.strip()
genre_df = genre_df[genre_df["Genres"] != ""]
genres = (
    genre_df.groupby("Genres")
    .agg(count=("score", "count"), avgScore=("score", "mean"))
    .reset_index()
    .sort_values("count", ascending=False)
    .head(20)
)
genres["avgScore"] = genres["avgScore"].round(2)
genres = genres.rename(columns={"Genres": "genre"})
genres.to_json(STATS / "genres.json", orient="records", force_ascii=False)

# ---------------------------------------------------------------
# NETWORK — artists linked by appearing on the same album
# ---------------------------------------------------------------
from itertools import combinations

pairs = {}
for _, group in df.groupby("Album"):
    names = sorted(set(group["Artist"]))
    for a, b in combinations(names, 2):
        pairs[(a, b)] = pairs.get((a, b), 0) + 1

nodes = [{"id": a} for a in artists["Artist"]]
node_ids = {n["id"] for n in nodes}
links = [
    {"source": a, "target": b, "weight": w}
    for (a, b), w in pairs.items()
    if a in node_ids and b in node_ids
]
(STATS / "network.json").write_text(
    json.dumps({"nodes": nodes, "links": links}, ensure_ascii=False, indent=2)
)

print("✅ Wrote public/artists.json, albums.json, and stats/*.json")