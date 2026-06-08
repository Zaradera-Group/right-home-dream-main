const FALLBACK_API_BASE_URL = "https://right-home-dream-main.onrender.com";
const LEGACY_REMOTE_ORIGINS = new Set([FALLBACK_API_BASE_URL]);

export function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (!baseUrl || !baseUrl.trim()) {
    if (typeof window === "undefined") {
      return FALLBACK_API_BASE_URL;
    }

    const { hostname, origin } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
      return FALLBACK_API_BASE_URL;
    }

    return origin;
  }

  const trimmedBaseUrl = baseUrl.replace(/\/$/, "");

  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;
    const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(hostname);

    if (!isLocalHost && LEGACY_REMOTE_ORIGINS.has(trimmedBaseUrl)) {
      return origin;
    }
  }

  return trimmedBaseUrl;
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
