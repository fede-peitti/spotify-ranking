export function slugify(text: string) {
  if ("物語シリーズ" === text) {
    return "monogatari";
  }

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
