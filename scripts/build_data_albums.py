import pandas as pd

rows = []

for i in range(1, 11):
    df = pd.read_csv(f"p{i}.csv")
    df["score"] = i
    rows.append(df)

df_all = pd.concat(rows, ignore_index=True)

albums = (
    df_all.groupby(["Album", "Artist"])
    .agg(
        avg=("score", "mean"),
        count=("Song", "count"),
        album_date=("Album Date", "first"),
    )
    .reset_index()
    .sort_values("avg", ascending=False)
)

albums["avg"] = albums["avg"].round(2)
# mas de 5 canciones
albums = albums[albums["count"] >= 2]

albums.to_json("albums.json", orient="records", force_ascii=False)
