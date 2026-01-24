import { slugify } from "./slugify";

export function artistImage(artist: string) {
  const slug = slugify(artist);

  if (!slug) {
    return "/artists/unown.jpg";
  }

  return `/artists/${slug}.jpg`;
}
