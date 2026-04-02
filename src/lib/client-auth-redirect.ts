"use client";

export function storeRedirectIntent(path: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("occ-redirect", path);
}

export function navigateForAuth(
  navigate: (path: string) => void,
  targetPath: string,
  authPath: "/login" | "/register" = "/register",
) {
  storeRedirectIntent(targetPath);
  navigate(`${authPath}?redirect=${encodeURIComponent(targetPath)}`);
}
