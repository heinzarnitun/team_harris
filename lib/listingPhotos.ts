/** Hosted photos for listings whose Unsplash URLs 404. */
const BY_ID: Record<string, string> = {
  p13: "/listings/p13-bamboo-floor-lamp.jpg",
  p17: "/listings/p17-teak-side-table.jpg",
  p21: "/listings/p21-canvas-tote.jpg",
  p24: "/listings/p24-solar-power-bank.jpg",
};

const BROKEN_SNIPPET: [string, string][] = [
  ["photo-1507473880760-e72b5d19b4ea", "/listings/p13-bamboo-floor-lamp.jpg"],
  ["photo-1590874103328-eac38a941956", "/listings/p21-canvas-tote.jpg"],
  ["photo-1533090488595-6b2d85d3ba34", "/listings/p17-teak-side-table.jpg"],
  ["photo-1609091839311-d536b564d327", "/listings/p24-solar-power-bank.jpg"],
  ["photo-1511385343922-74632558d194", "/listings/macbook-open.jpg"],
];

export function listingPhoto(id: string, url: string | null | undefined): string {
  if (BY_ID[id]) return BY_ID[id];
  return rewriteBrokenPhoto(url ?? "");
}

export function rewriteBrokenPhoto(url: string): string {
  if (!url) return url;
  for (const [bad, good] of BROKEN_SNIPPET) {
    if (url.includes(bad)) return good;
  }
  return url;
}

export function rewriteGallery(id: string, urls: string[]): string[] {
  const hero = BY_ID[id];
  const next = urls.map(rewriteBrokenPhoto).filter(Boolean);
  if (hero && !next.includes(hero)) return [hero, ...next];
  return Array.from(new Set(next));
}
