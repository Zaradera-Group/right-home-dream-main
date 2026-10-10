const PRODUCTION_API_ORIGIN = "https://right-home-dream-main.onrender.com";

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/api/contact") {
    return normalizedPath;
  }
  const configuredOrigin = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");
  const apiOrigin = configuredOrigin || (import.meta.env.PROD ? PRODUCTION_API_ORIGIN : "");
  return `${apiOrigin}${normalizedPath}`;
}
