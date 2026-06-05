import server from "../../dist/server/index.js";
import { Buffer } from "node:buffer";

const textResponseContentType = /^(text\/|application\/(json|javascript|xml|xhtml|svg\+xml|webmanifest|wasm)|image\/svg\+xml)/i;

function buildUrl(event) {
  const host = event.headers?.host || "localhost";
  const rawUrl = event.rawUrl ?? `${event.path}${event.rawQueryString ? `?${event.rawQueryString}` : ""}`;

  if (/^https?:\/\//.test(rawUrl)) {
    return rawUrl;
  }

  return new URL(`https://${host}${rawUrl}`).toString();
}

function normalizeHeaders(headers = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      normalized[key.toLowerCase()] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      normalized[key.toLowerCase()] = value.join(",");
    }
  }
  return normalized;
}

export const handler = async (event) => {
  const request = new Request(buildUrl(event), {
    method: event.httpMethod,
    headers: normalizeHeaders(event.headers),
    body: event.body
      ? event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body
      : undefined,
  });

  const response = await server.fetch(request, process.env, {
    waitUntil: (promise) => {
      promise.catch(() => undefined);
    },
  });

  const responseHeaders = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  const bodyBuffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "";
  const isText = textResponseContentType.test(contentType) || contentType.includes("charset=utf-8");

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: isText ? bodyBuffer.toString("utf8") : bodyBuffer.toString("base64"),
    isBase64Encoded: !isText,
  };
};
