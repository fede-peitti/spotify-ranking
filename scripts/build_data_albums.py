import pandas as pd

rows = []

for i in range(1, 11):
    df = pd.read_csv(f"scripts/p{i}.csv")
    df["score"] = i
    rows.append(df)

df_all = pd.concat(rows, ignore_index=True)

albums = (
    df_all.groupby(["Album", "Album Date"])
    .agg(
        avg=("score", "mean"),
        count=("Song", "count"),
        artists=(
            "Artist",
            lambda x: ", ".join(
                sorted(set(a.strip() for artists in x for a in artists.split(",")))
            ),
        ),
    )
    .reset_index()
)

albums["avg"] = albums["avg"].round(2)

# mínimo de canciones (ajustable)
albums = albums[albums["count"] >= 5]

albums = albums.sort_values(
    by=["avg", "count", "Album"], ascending=[False, False, True]
)

albums.to_json("albums.json", orient="records", force_ascii=False)
