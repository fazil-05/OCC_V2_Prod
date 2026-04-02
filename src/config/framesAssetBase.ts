/**
 * Optional Cloudflare R2 (or any) public URL for frame JPEGs.
 * Local dev: omit VITE_FRAMES_CDN_BASE → paths stay /bikers-frames/ etc. from Vite.
 * Production: set VITE_FRAMES_CDN_BASE=https://pub-xxxxx.r2.dev (no trailing slash).
 */
export function framesPublicPath(pathFromRoot: string): string {
  const base = import.meta.env.VITE_FRAMES_CDN_BASE?.trim().replace(/\/$/, "") ?? "";
  const path = pathFromRoot.startsWith("/") ? pathFromRoot : `/${pathFromRoot}`;
  if (!base) return path;
  return `${base}${path}`;
}
