import pandas as pd

rows = []

for i in range(1, 11):
    df = pd.read_csv(f"scripts/p{i}.csv")
    df["score"] = i
    rows.append(df)

df_all = pd.concat(rows, ignore_index=True)

# -------------------------------
# SPLIT DE ARTISTAS
# -------------------------------
df_all["Artist"] = df_all["Artist"].astype(str).str.split(",")

df_all = df_all.explode("Artist")
df_all["Artist"] = df_all["Artist"].str.strip()

# -------------------------------
# AGREGACIÓN POR ARTISTA
# -------------------------------
artists = (
    df_all.groupby("Artist")
    .agg(avg=("score", "mean"), count=("Song", "count"))
    .reset_index()
    .sort_values("avg", ascending=False)
)

artists["avg"] = artists["avg"].round(2)
artists = artists[artists["count"] >= 15]


artists.to_json("artists.json", orient="records", force_ascii=False)
