import { Buffer } from "node:buffer";

const SUPPORT_EMAIL = "hello@zaraderagroup.com";
const DEFAULT_CONTACT_FROM_EMAIL = "onboarding@resend.dev";
const RIGHTAI_MODEL = "gpt-5.4-mini";

const RIGHTAI_SYSTEM_PROMPT =
  "You are RightAI, the friendly property concierge for RIGHTHOME in Nigeria. Give direct, helpful answers about listings, investment, market trends, property verification, and how users can work with RIGHTHOME. Be practical, concise, and honest. If you use estimates or illustrative market numbers, clearly say they are estimates.";

const RIGHTAI_CHART_PROMPT =
  "You generate chart suggestions for RightAI. Return a chart only when the user asked about trends, comparisons, ROI, pricing ranges, demand, performance over time, or any question that benefits from a visual. Use short labels and 4 to 8 data points. If the conversation does not justify a chart, set shouldRender to false and leave data empty. If a chart is returned, make it explicitly illustrative unless the conversation provides exact source data.";

const jsonHeaders = { "content-type": "application/json" };
const sseHeaders = {
  "content-type": "text/event-stream; charset=utf-8",
  "cache-control": "no-cache, no-transform",
  connection: "keep-alive",
};

const rateLimitBuckets = new Map();

function clampText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function getClientIp(request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isAllowedOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const parsed = new URL(origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function pruneRateLimitBuckets() {
  const cutoff = Date.now() - 15 * 60 * 1000;
  for (const [key, timestamps] of rateLimitBuckets.entries()) {
    const filtered = timestamps.filter((timestamp) => timestamp >= cutoff);
    if (filtered.length > 0) {
      rateLimitBuckets.set(key, filtered);
    } else {
      rateLimitBuckets.delete(key);
    }
  }
}

function isRateLimited(key, maxRequests, windowMs) {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key)?.filter((timestamp) => now - timestamp < windowMs) ?? [];
  if (bucket.length >= maxRequests) {
    rateLimitBuckets.set(key, bucket);
    return true;
  }

  bucket.push(now);
  rateLimitBuckets.set(key, bucket);
  return false;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

function buildUrl(event) {
  const host = event.headers?.host || "localhost";
  const originalPath =
    event.headers?.["x-nf-request-path"] ||
    event.headers?.["x-nf-original-path"] ||
    event.rawUrl ||
    event.path;
  const rawUrl = `${originalPath}${event.rawQueryString ? `?${event.rawQueryString}` : ""}`;
  if (/^https?:\/\//.test(rawUrl)) {
    return rawUrl;
  }
  return new URL(`https://${host}${rawUrl}`).toString();
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function describeRightAIError(error) {
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

  if (message.includes("RightAI API error") && message.includes("5")) {
    return "RightAI is temporarily unavailable from OpenAI. Please try again shortly.";
  }

  return "RightAI is unavailable right now. Please contact hello@zaraderagroup.com for urgent help.";
}

async function fetchWithTimeout(url, options, timeoutMs = 20000, maxRetries = 2) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
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

function getApiKey(env) {
  return env?.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
}

function getContactToEmail(env) {
  return env?.CONTACT_TO_EMAIL || process.env.CONTACT_TO_EMAIL || SUPPORT_EMAIL;
}

function getContactFromEmail(env) {
  return env?.CONTACT_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL;
}

function getTurnstileSecret(env) {
  return env?.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
}

function sanitizeMessages(body) {
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const rawMessages = Array.isArray(body?.messages) ? body.messages : [];

  const messages = rawMessages
    .filter(
      (message) =>
        message &&
        (message.role === "assistant" || message.role === "user") &&
        typeof message.content === "string",
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim(),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-12);

  return messages.length > 0 ? messages : prompt ? [{ role: "user", content: prompt }] : [];
}

function extractLastUserQuestion(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === "user") {
      return messages[index].content;
    }
  }
  return "";
}

function extractResponseText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const output = Array.isArray(payload?.output) ? payload.output : [];
  const textParts = [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string") {
        textParts.push(part.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

async function createRightAIResponse(apiKey, messages) {
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

async function createRightAIChart(apiKey, messages) {
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
        store: false,
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
      }),
    },
    20000,
    2,
  );

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
    const chart = JSON.parse(text);
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

async function verifyTurnstileToken(token, env, request) {
  const secret = getTurnstileSecret(env);
  if (!secret) {
    return true;
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

  const data = await response.json();
  return data.success === true;
}

async function sendContactEmail(env, payload, request) {
  const apiKey = env?.RESEND_API_KEY || process.env.RESEND_API_KEY;
  const toEmail = getContactToEmail(env);
  const fromEmail = getContactFromEmail(env) || `Zara Dera Group <${DEFAULT_CONTACT_FROM_EMAIL}>`;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing.");
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
}

function parseContactPayload(body) {
  const payload = body || {};
  return {
    name: clampText(payload.name, 80),
    email: clampText(payload.email, 120),
    phone: clampText(payload.phone, 40),
    interest: clampText(payload.interest, 80),
    message: clampText(payload.message, 2000),
    company: clampText(payload.company, 120),
    honeypot: clampText(payload.website, 120) || clampText(payload.companyWebsite, 120),
  };
}

function writeSse(controller, event, data) {
  const encoder = new TextEncoder();
  controller.enqueue(encoder.encode(`event: ${event}\n`));
  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
}

async function handleContactRequest(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!isAllowedOrigin(request)) {
    return jsonResponse({ error: "Invalid origin" }, 403);
  }

  const ip = getClientIp(request);
  pruneRateLimitBuckets();
  if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return jsonResponse({ error: "Too many submissions. Please try again shortly." }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  const payload = parseContactPayload(body);
  if (payload.honeypot) {
    return jsonResponse({ ok: true });
  }

  if (!payload.name || !payload.email || !payload.message) {
    return jsonResponse({ error: "Please complete the required fields." }, 400);
  }

  if (!isValidEmail(payload.email)) {
    return jsonResponse({ error: "Please enter a valid email address." }, 400);
  }

  const turnstileToken =
    clampText(body?.turnstileToken, 2000) || clampText(body?.cfTurnstileResponse, 2000);
  const turnstileOk = await verifyTurnstileToken(turnstileToken, env, request);
  if (!turnstileOk) {
    return jsonResponse({ error: "Please complete the anti-bot check and try again." }, 403);
  }

  try {
    await sendContactEmail(env, payload, request);
    return jsonResponse({
      ok: true,
      message:
        "Thanks. Your message has been sent to hello@zaraderagroup.com and our team will respond soon.",
    });
  } catch (error) {
    console.error("Contact submission failed", error);
    return jsonResponse(
      {
        error:
          "We could not send your message right now. Please email hello@zaraderagroup.com directly.",
      },
      503,
    );
  }
}

async function handleRightAIRequest(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body;
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

async function handleRightAIStreamRequest(request, env) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let body;
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
          const answer = await createRightAIResponse(apiKey, messages);
          writeSse(controller, "message", { delta: answer });

          const chart = await createRightAIChart(apiKey, messages).catch((error) => {
            console.error("RightAI chart generation failure", error);
            return null;
          });

          if (chart?.shouldRender && chart.data.length > 0) {
            writeSse(controller, "chart", chart);
          }

          writeSse(controller, "done", {});
        } catch (error) {
          console.error("RightAI streaming failure", error);
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

function toNetlifyResponse(response) {
  return response.arrayBuffer().then((arrayBuffer) => {
    const bodyBuffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get("content-type") || "";
    const isText = contentType.startsWith("text/") || contentType.includes("charset=utf-8");
    const responseHeaders = {};

    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: isText ? bodyBuffer.toString("utf8") : bodyBuffer.toString("base64"),
      isBase64Encoded: !isText,
    };
  });
}

export const handler = async (event, context) => {
  const request = new Request(buildUrl(event), {
    method: event.httpMethod,
    headers: normalizeHeaders(event.headers),
    body: event.body
      ? event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body
      : undefined,
  });

  let response;
  const pathname = new URL(request.url).pathname;

  if (pathname === "/api/contact") {
    response = await handleContactRequest(request, process.env);
  } else if (pathname === "/api/rightai/stream") {
    response = await handleRightAIStreamRequest(request, process.env);
  } else if (pathname === "/api/rightai") {
    response = await handleRightAIRequest(request, process.env);
  } else {
    response = jsonResponse({ error: "Not found" }, 404);
  }

  return toNetlifyResponse(response);
};
