/** Public URL prefix for the staff panel (obscured; not /admin). Must match NEXT_PUBLIC_OCC_STAFF_PREFIX in .env */
export const STAFF_PUBLIC_PREFIX = (
  process.env.NEXT_PUBLIC_OCC_STAFF_PREFIX || "/k9xm2p7qv4nw8-stf"
).replace(/\/$/, "");

/** Staff-only sign-in page (under the same prefix): .../gate */
export function staffGateHref(): string {
  return `${STAFF_PUBLIC_PREFIX}/gate`;
}

/** Build a staff panel path under the public prefix */
export function staffHref(path = ""): string {
  if (!path || path === "/") return STAFF_PUBLIC_PREFIX;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${STAFF_PUBLIC_PREFIX}${p}`;
}
