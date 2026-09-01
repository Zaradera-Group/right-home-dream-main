import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { bootstrapLocalServerEnv } from "./server/env";
import { renderErrorPage } from "./lib/error-page";
import {
  applySecurityHeaders,
  clampText,
  getClientIp,
  isAllowedOrigin,
  isRateLimited,
  pruneRateLimitBuckets,
} from "./lib/security";
import { DEFAULT_CONTACT_FROM_EMAIL, DEFAULT_CONTACT_TO_EMAIL } from "./lib/runtime-config";
import type { RightAIChart, RightAIMessage, RightAIRequestBody } from "./lib/rightai";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function secureResponse(response: Response): Response {
  return applySecurityHeaders(response);
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return secureResponse(brandedErrorResponse());
}

const RIGHTAI_MODEL = "gpt-5.4-mini";

const RIGHTAI_SYSTEM_PROMPT =
  "You are RightAI, the friendly property concierge for RightHome Proptech in Nigeria. Give direct, helpful answers about listings, investment, market trends, property verification, and how users can work with RightHome Proptech. Be practical, concise, and honest. If you use estimates or illustrative market numbers, clearly say they are estimates.";

const RIGHTAI_CHART_PROMPT =
  "You generate chart suggestions for RightAI. Return a chart only when the user asked about trends, comparisons, ROI, pricing ranges, demand, performance over time, or any question that benefits from a visual. Use short labels and 4 to 8 data points. If the conversation does not justify a chart, set shouldRender to false and leave data empty. If a chart is returned, make it explicitly illustrative unless the conversation provides exact source data.";

const jsonHeaders = { "content-type": "application/json" };
const sseHeaders = {
  "content-type": "text/event-stream; charset=utf-8",
  "cache-control": "no-cache, no-transform",
  connection: "keep-alive",
};

bootstrapLocalServerEnv("TanStack Start server startup");

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function jsonSecureResponse(body: unknown, status = 200): Response {
  return secureResponse(jsonResponse(body, status));
}

function withCorsHeaders(response: Response, request: Request): Response {
  const origin = request.headers.get("origin");
  if (!origin) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Vary", "Origin");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function describeRightAIError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("OPENAI_API_KEY")) {
    return "RightAI cannot reach OpenAI because OPENAI_API_KEY is missing on the server.";
  }

  if (message.includes("401")) {
    return "RightAI could not authenticate with OpenAI. Please check OPENAI_API_KEY.";
  }

  if (message.includes("429")) {
    return "RightAI hit an OpenAI rate limit or quota limit. Please try again shortly.";
  }

  if (message.includes("model")) {
    return "RightAI could not use the selected OpenAI model. Please check account access.";
  }

  if (message.includes("Timeout") || message.includes("TIMEOUT") || message.includes("timeout")) {
    return "RightAI took too long to respond. Please try again in a moment.";
  }

  if (message.includes("5") && message.includes("RightAI API error")) {
    return "RightAI is temporarily unavailable from OpenAI. Please try again shortly.";
  }

  return "RightAI is unavailable right now. Please contact hello@zaraderagroup.com for urgent help.";
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 20000,
  maxRetries = 2,
): Promise<Response> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
    }
  }
  throw lastError || new Error("Fetch failed after retries");
}

function getApiKey(env: unknown): string | undefined {
  return (env as { OPENAI_API_KEY?: string })?.OPENAI_API_KEY ?? process.env.OPENAI_API_KEY;
}

function getContactToEmail(env: unknown): string {
  return (
    (env as { CONTACT_TO_EMAIL?: string })?.CONTACT_TO_EMAIL ??
    process.env.CONTACT_TO_EMAIL ??
    DEFAULT_CONTACT_TO_EMAIL
  );
}

function getContactFromEmail(env: unknown): string | undefined {
  return (
    (env as { CONTACT_FROM_EMAIL?: string })?.CONTACT_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL
  );
}

function getTurnstileSecret(env: unknown): string | undefined {
  return (
    (env as { TURNSTILE_SECRET_KEY?: string })?.TURNSTILE_SECRET_KEY ??
    process.env.TURNSTILE_SECRET_KEY
  );
}

function sanitizeMessages(body: unknown): RightAIMessage[] {
  const payload = body as RightAIRequestBody | null;
  const prompt = typeof payload?.prompt === "string" ? payload.prompt.trim() : "";
  const rawMessages = Array.isArray(payload?.messages) ? payload.messages : [];

  const messages = rawMessages
    .filter((message): message is RightAIMessage => {
      return (
        !!message &&
        (message.role === "assistant" || message.role === "user") &&
        typeof message.content === "string"
      );
    })
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-12);

  if (messages.length > 0) {
    return messages;
  }

  return prompt ? [{ role: "user", content: prompt }] : [];
}

function parseContactPayload(body: unknown) {
  const payload = body as Record<string, unknown> | null;
  return {
    name: clampText(payload?.name, 80),
    email: clampText(payload?.email, 120),
    phone: clampText(payload?.phone, 40),
    interest: clampText(payload?.interest, 80),
    message: clampText(payload?.message, 2000),
    company: clampText(payload?.company, 120),
    turnstileToken: clampText(payload?.turnstileToken, 500),
    honeypot: clampText(payload?.website, 120) || clampText(payload?.companyWebsite, 120),
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyTurnstileToken(
  token: string,
  env: unknown,
  request: Request,
): Promise<boolean> {
  const secret = getTurnstileSecret(env);
  if (!secret) {
    console.error(
      "TURNSTILE_SECRET_KEY is missing. Set it as a deployment secret or in your local .env file.",
    );
    return false;
  }

  if (!token) {
    return false;
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: getClientIp(request),
    }),
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

async function sendContactEmail(
  env: unknown,
  payload: ReturnType<typeof parseContactPayload>,
  request: Request,
): Promise<"send" | "log"> {
  const deliveryMode = (env as { CONTACT_DELIVERY_MODE?: string })?.CONTACT_DELIVERY_MODE?.trim() || "send";
  if (deliveryMode === "log") {
    console.info("Contact form captured in temporary log mode", {
      name: payload.name || "Not provided",
      email: payload.email || "Not provided",
      phone: payload.phone || "Not provided",
      interest: payload.interest || "Not provided",
      company: payload.company || "Not provided",
      message: payload.message || "Not provided",
      origin: request.headers.get("origin") || "unknown",
    });
    return "log";
  }

  const apiKey = (env as { RESEND_API_KEY?: string })?.RESEND_API_KEY ?? process.env.RESEND_API_KEY;
  const toEmail = getContactToEmail(env);
  const fromEmail = getContactFromEmail(env) ?? `Zara Dera Group <${DEFAULT_CONTACT_FROM_EMAIL}>`;

  if (!apiKey) {
    const message =
      "RESEND_API_KEY is missing. Set it as a deployment secret or in your local .env file.";
    console.error(message);
    throw new Error(message);
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `New website enquiry from ${payload.name || "Anonymous visitor"}`,
      text: [
        `Name: ${payload.name || "Not provided"}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone || "Not provided"}`,
        `Interest: ${payload.interest || "Not provided"}`,
        `Company: ${payload.company || "Not provided"}`,
        "",
        "Message:",
        payload.message,
        "",
        `IP: ${getClientIp(request)}`,
        `Origin: ${request.headers.get("origin") || "unknown"}`,
        `User-Agent: ${request.headers.get("user-agent") || "unknown"}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Contact email delivery failed: ${response.status} ${errorText}`);
  }

  return "send";
}

function describeContactError(error: unknown): string | null {
  const message = error instanceof Error ? error.message : "";

  if (
    message.includes("RESEND_API_KEY is missing") ||
    message.includes("Contact email delivery failed")
  ) {
    return message;
  }

  return null;
}

async function handleContactRequest(request: Request, env: unknown): Promise<Response> {
  if (request.method !== "POST") {
    return withCorsHeaders(jsonSecureResponse({ error: "Method not allowed" }, 405), request);
  }

  if (!isAllowedOrigin(request)) {
    return withCorsHeaders(jsonSecureResponse({ error: "Invalid origin" }, 403), request);
  }

  const ip = getClientIp(request);
  pruneRateLimitBuckets();
  if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return withCorsHeaders(
      jsonSecureResponse({ error: "Too many submissions. Please try again shortly." }, 429),
      request,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return withCorsHeaders(jsonSecureResponse({ error: "Invalid request body" }, 400), request);
  }

  const payload = parseContactPayload(body);
  if (payload.honeypot) {
    return withCorsHeaders(jsonSecureResponse({ ok: true }), request);
  }

  if (!payload.name || !payload.email || !payload.message) {
    return withCorsHeaders(
      jsonSecureResponse({ error: "Please complete the required fields." }, 400),
      request,
    );
  }

  if (!isValidEmail(payload.email)) {
    return withCorsHeaders(
      jsonSecureResponse({ error: "Please enter a valid email address." }, 400),
      request,
    );
  }

  if (!payload.turnstileToken) {
    return withCorsHeaders(
      jsonSecureResponse(
        { error: "Please complete the Cloudflare verification widget before sending." },
        400,
      ),
      request,
    );
  }

  const turnstileSuccess = await verifyTurnstileToken(payload.turnstileToken, env, request);
  if (!turnstileSuccess) {
    return withCorsHeaders(
      jsonSecureResponse(
        {
          error:
            "Cloudflare verification failed. Please complete the widget and try again.",
        },
        400,
      ),
      request,
    );
  }

  try {
    const deliveryMode = await sendContactEmail(env, payload, request);
    return withCorsHeaders(
      jsonSecureResponse({
        ok: true,
        message:
          deliveryMode === "log"
            ? "Thanks. Your message was received in temporary test mode."
            : "Thanks. Your message has been sent to hello@zaraderagroup.com and our team will respond soon.",
      }),
      request,
    );
  } catch (error) {
    console.error("Contact submission failed", error);
    const contactError = describeContactError(error);
    if (contactError) {
      return withCorsHeaders(jsonSecureResponse({ error: contactError }, 502), request);
    }
    return withCorsHeaders(
      jsonSecureResponse(
        {
          error:
            "We could not send your message right now. Please email hello@zaraderagroup.com directly.",
        },
        503,
      ),
      request,
    );
  }
}

function extractLastUserQuestion(messages: RightAIMessage[]): string {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      return messages[index].content;
    }
  }
  return "";
}

type OpenAIOutputPart = {
  type?: string;
  text?: string;
};

type OpenAIOutputItem = {
  content?: OpenAIOutputPart[];
};

type OpenAIResponsePayload = {
  output_text?: string;
  output?: OpenAIOutputItem[];
};

function extractResponseText(payload: OpenAIResponsePayload): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload?.output) ? payload.output : [];
  const textParts: string[] = [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string" && (part.type === "output_text" || part.type === "text")) {
        textParts.push(part.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

async function createRightAIResponse(apiKey: string, messages: RightAIMessage[]): Promise<string> {
  const response = await fetchWithTimeout(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: RIGHTAI_MODEL,
        instructions: RIGHTAI_SYSTEM_PROMPT,
        input: messages,
        max_output_tokens: 500,
        text: { verbosity: "medium" },
        store: false,
      }),
    },
    20000,
    2,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RightAI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return extractResponseText(data) || "RightAI could not answer that request right now.";
}

async function createRightAIChart(
  apiKey: string,
  messages: RightAIMessage[],
): Promise<RightAIChart | null> {
  const response = await fetchWithTimeout(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: RIGHTAI_MODEL,
        instructions: `${RIGHTAI_SYSTEM_PROMPT}\n\n${RIGHTAI_CHART_PROMPT}`,
        input: messages,
        max_output_tokens: 350,
        text: {
          format: {
            type: "json_schema",
            name: "rightai_chart",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                shouldRender: { type: "boolean" },
                title: { type: "string" },
                description: { type: "string" },
                chartType: { type: "string", enum: ["area", "bar", "line", "pie"] },
                yAxisLabel: { type: "string" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      label: { type: "string" },
                      value: { type: "number" },
                    },
                    required: ["label", "value"],
                  },
                },
              },
              required: ["shouldRender", "title", "description", "chartType", "yAxisLabel", "data"],
            },
          },
      },
      store: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`RightAI chart API error: ${response.status} ${errorText}`);
    return null;
  }

  const data = await response.json();
  const text = extractResponseText(data);
  if (!text) {
    return null;
  }

  try {
    const chart = JSON.parse(text) as RightAIChart;
    if (!chart.shouldRender || !Array.isArray(chart.data) || chart.data.length === 0) {
      return { ...chart, data: [] };
    }

    return {
      ...chart,
      data: chart.data
        .filter((point) => typeof point?.label === "string" && typeof point?.value === "number")
        .slice(0, 8),
    };
  } catch (error) {
    console.error("Failed to parse RightAI chart response", error);
    return null;
  }
}

function writeSse(
  controller: ReadableStreamDefaultController<Uint8Array>,
  event: string,
  data: unknown,
) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`event: ${event}\n`));
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

async function handleRightAIRequest(request: Request, env: unknown): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  const messages = sanitizeMessages(body);
  const question = extractLastUserQuestion(messages);

  if (!question) {
    return jsonResponse({ error: "Missing prompt" }, 400);
  }

  const apiKey = getApiKey(env);
  if (!apiKey) {
    console.error(
      "OPENAI_API_KEY is missing. Set it as a deployment secret or in your local .env file.",
    );
    return jsonResponse({
      answer:
        "RightAI is not configured yet. OPENAI_API_KEY is missing on the server, so live answers are disabled.",
      chart: null,
    });
  }

  try {
    const [answer, chart] = await Promise.all([
      createRightAIResponse(apiKey, messages),
      createRightAIChart(apiKey, messages).catch((error) => {
        console.error("RightAI chart generation failure", error);
        return null;
      }),
    ]);

    return jsonResponse({ answer, chart });
  } catch (error) {
    console.error("RightAI integration failure", error);
    return jsonResponse({
      answer: describeRightAIError(error),
      chart: null,
    });
  }
}

async function handleRightAIStreamRequest(request: Request, env: unknown): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  const messages = sanitizeMessages(body);
  const question = extractLastUserQuestion(messages);

  if (!question) {
    return jsonResponse({ error: "Missing prompt" }, 400);
  }

  const apiKey = getApiKey(env);
  if (!apiKey) {
    console.error(
      "OPENAI_API_KEY is missing. Set it as a deployment secret or in your local .env file.",
    );
    return new Response(
      new ReadableStream({
        start(controller) {
          writeSse(controller, "message", {
            delta:
              "RightAI is not configured yet. OPENAI_API_KEY is missing on the server, so live answers are disabled.",
          });
          writeSse(controller, "done", {});
          controller.close();
        },
      }),
      { headers: sseHeaders },
    );
  }

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          const response = await fetchWithTimeout(
            "https://api.openai.com/v1/responses",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: RIGHTAI_MODEL,
                instructions: RIGHTAI_SYSTEM_PROMPT,
                input: messages,
                stream: true,
                max_output_tokens: 500,
                text: { verbosity: "medium" },
                store: false,
              }),
            },
            20000,
            2,
          );

          if (!response.ok || !response.body) {
            const errorText = await response.text();
            throw new Error(`RightAI API error ${response.status}: ${errorText}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const chunks = buffer.split("\n\n");
            buffer = chunks.pop() ?? "";

            for (const chunk of chunks) {
              const lines = chunk.split("\n");
              const eventType = lines
                .find((line) => line.startsWith("event:"))
                ?.slice(6)
                .trim();
              const dataText = lines
                .filter((line) => line.startsWith("data:"))
                .map((line) => line.slice(5).trim())
                .join("\n");

              if (!dataText || dataText === "[DONE]") {
                continue;
              }

              const payload = JSON.parse(dataText);
              const payloadType = eventType ?? payload?.type;

              if (
                payloadType === "response.output_text.delta" &&
                typeof payload?.delta === "string"
              ) {
                writeSse(controller, "message", { delta: payload.delta });
              }

              if (payloadType === "error") {
                throw new Error(payload?.message || "RightAI stream failed");
              }
            }
          }

          const chart = await createRightAIChart(apiKey, messages).catch((error) => {
            console.error("RightAI chart generation failure", error);
            return null;
          });

          if (chart?.shouldRender && chart.data.length > 0) {
            writeSse(controller, "chart", chart);
          }

          writeSse(controller, "done", {});
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.error("RightAI streaming failure", { error, message: errorMsg });
          writeSse(controller, "error", {
            message: describeRightAIError(error),
          });
        } finally {
          controller.close();
        }
      },
    }),
    { headers: sseHeaders },
  );
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/contact") {
        return secureResponse(await handleContactRequest(request, env));
      }
      if (url.pathname === "/api/rightai/stream") {
        return secureResponse(await handleRightAIStreamRequest(request, env));
      }
      if (url.pathname === "/api/rightai") {
        return secureResponse(await handleRightAIRequest(request, env));
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return secureResponse(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return secureResponse(brandedErrorResponse());
    }
  },
};
