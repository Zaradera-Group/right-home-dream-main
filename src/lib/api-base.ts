const FALLBACK_API_BASE_URL = "https://right-home-dream-main.onrender.com";

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

  return baseUrl.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
