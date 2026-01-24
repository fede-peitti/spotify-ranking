import { slugify } from "./slugify";

export function albumImage(album: string) {
  const slug = slugify(album);

  if (!slug) {
    return "/albums/unown.jpg";
  }

  return `/albums/${slug}.jpg`;
}
