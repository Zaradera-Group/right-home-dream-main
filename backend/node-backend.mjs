import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const REQUIRED_SERVER_KEYS = ["OPENAI_API_KEY", "RESEND_API_KEY", "TURNSTILE_SECRET_KEY"];

const projectRoot = process.cwd();
const dotenvPath = resolve(projectRoot, ".env");
const supportEmail = "hello@zaraderagroup.com";
const supportPhone = "+234 7017683590";
const defaultFromEmail = "onboarding@resend.dev";

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(dotenvPath);

function validateRequiredServerEnv(context) {
  const missingKeys = REQUIRED_SERVER_KEYS.filter((key) => !process.env[key]?.trim());
  if (missingKeys.length === 0) {
    return;
  }

  const message = `${context}: missing required environment variable(s): ${missingKeys.join(", ")}. Set them in .env for local development or as deployment secrets before starting the server.`;
  console.error(message);
  process.exit(1);
}

validateRequiredServerEnv("Node backend startup");

const rateLimitBuckets = new Map();

function clampText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function getClientIp(request) {
  return (
    request.headers["cf-connecting-ip"] ||
    request.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    request.socket.remoteAddress ||
    "unknown"
  );
}

function isAllowedOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;

  try {
    const parsed = new URL(origin);
    return ["http:", "https:"].includes(parsed.protocol);
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

function parseJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) {
        reject(new Error("Body too large"));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
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

  if (message.includes("RightAI API error") && message.includes("5")) {
    return "RightAI is temporarily unavailable from OpenAI. Please try again shortly.";
  }

  return "RightAI is unavailable right now. Please contact hello@zaraderagroup.com for urgent help.";
}

async function verifyTurnstileToken(token, request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return true;
  }

  if (!token) {
    return false;
  }

  const verificationResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: getClientIp(request),
      }),
    },
  );

  if (!verificationResponse.ok) {
    return false;
  }

  const payload = await verificationResponse.json();
  return payload.success === true;
}

function sanitizeMessages(body) {
  const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

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
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      instructions:
        "You are RightAI, the friendly property concierge for RIGHTHOME in Nigeria. Give direct, helpful answers about listings, investment, market trends, property verification, and how users can work with RIGHTHOME. Be practical, concise, and honest. If you use estimates or illustrative market numbers, clearly say they are estimates.",
      input: messages,
      max_output_tokens: 500,
      text: { verbosity: "medium" },
      store: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error ${response.status}: ${await response.text()}`);
  }

  return (
    extractResponseText(await response.json()) || "RightAI could not answer that request right now."
  );
}

async function createRightAIChart(apiKey, messages) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      instructions:
        "You generate chart suggestions for RightAI. Return a chart only when the user asked about trends, comparisons, ROI, pricing ranges, demand, performance over time, or any question that benefits from a visual. Use short labels and 4 to 8 data points. If the conversation does not justify a chart, set shouldRender to false and leave data empty. If a chart is returned, make it explicitly illustrative unless the conversation provides exact source data.",
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
    throw new Error(`Chart error ${response.status}: ${await response.text()}`);
  }

  const chart = JSON.parse(extractResponseText(await response.json()));
  if (!chart.shouldRender || !Array.isArray(chart.data) || chart.data.length === 0) {
    return { ...chart, data: [] };
  }

  return {
    ...chart,
    data: chart.data
      .slice(0, 8)
      .filter((item) => typeof item?.label === "string" && typeof item?.value === "number"),
  };
}

async function sendContactEmail(payload, request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || supportEmail;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || defaultFromEmail;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Zara Dera Group <${fromEmail}>`,
      to: [toEmail],
      subject: `New website enquiry from ${payload.name || "Anonymous visitor"}`,
      text: [
        `Name: ${payload.name || "Not provided"}`,
        `Email: ${payload.email || "Not provided"}`,
        `Phone: ${payload.phone || "Not provided"}`,
        `Interest: ${payload.interest || "Not provided"}`,
        `Company: ${payload.company || "Not provided"}`,
        "",
        "Message:",
        payload.message || "Not provided",
        "",
        `IP: ${getClientIp(request)}`,
        `Origin: ${request.headers.origin || "unknown"}`,
        `User-Agent: ${request.headers["user-agent"] || "unknown"}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend error ${response.status}: ${await response.text()}`);
  }
}

function describeContactError(error) {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("RESEND_API_KEY is not configured") || message.includes("Resend error")) {
    return message;
  }

  return null;
}

async function streamSse(response, write) {
  response.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  await write(response);
}

async function handleRightAIRequest(request, response) {
  try {
    const body = await parseJsonBody(request);
    const messages = sanitizeMessages(body);
    const question = extractLastUserQuestion(messages);

    if (!question) {
      return sendJson(response, 400, { error: "Missing prompt" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return sendJson(response, 200, {
        answer:
          "RightAI is not configured yet. Add OPENAI_API_KEY on the server to enable live answers.",
        chart: null,
      });
    }

    const [answer, chart] = await Promise.all([
      createRightAIResponse(apiKey, messages),
      createRightAIChart(apiKey, messages).catch((error) => {
        console.error("Chart generation failure", error);
        return null;
      }),
    ]);

    return sendJson(response, 200, { answer, chart });
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, {
      answer: describeRightAIError(error),
      chart: null,
    });
  }
}

async function handleRightAIStreamRequest(request, response) {
  try {
    const body = await parseJsonBody(request);
    const messages = sanitizeMessages(body);
    const question = extractLastUserQuestion(messages);

    if (!question) {
      return sendJson(response, 400, { error: "Missing prompt" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      await streamSse(response, (res) => {
        res.write(`event: message\n`);
        res.write(
          `data: ${JSON.stringify({
            delta:
              "RightAI is not configured yet. OPENAI_API_KEY is missing on the server, so live answers are disabled.",
          })}\n\n`,
        );
        res.write(`event: done\n`);
        res.write(`data: {}\n\n`);
        res.end();
      });
      return;
    }

    await streamSse(response, async (res) => {
      try {
        const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-5.4-mini",
            instructions:
              "You are RightAI, the friendly property concierge for RIGHTHOME in Nigeria. Give direct, helpful answers about listings, investment, market trends, property verification, and how users can work with RIGHTHOME. Be practical, concise, and honest. If you use estimates or illustrative market numbers, clearly say they are estimates.",
            input: messages,
            stream: true,
            max_output_tokens: 500,
            text: { verbosity: "medium" },
            store: false,
          }),
        });

        if (!openAiResponse.ok || !openAiResponse.body) {
          throw new Error(`OpenAI error ${openAiResponse.status}: ${await openAiResponse.text()}`);
        }

        const reader = openAiResponse.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() || "";

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
            const payloadType = eventType || payload?.type;

            if (
              payloadType === "response.output_text.delta" &&
              typeof payload?.delta === "string"
            ) {
              res.write(`event: message\n`);
              res.write(`data: ${JSON.stringify({ delta: payload.delta })}\n\n`);
            }

            if (payloadType === "error") {
              throw new Error(payload?.message || "RightAI stream failed");
            }
          }
        }

        const chart = await createRightAIChart(apiKey, messages).catch((error) => {
          console.error("Chart generation failure", error);
          return null;
        });

        if (chart?.shouldRender && chart.data.length > 0) {
          res.write(`event: chart\n`);
          res.write(`data: ${JSON.stringify(chart)}\n\n`);
        }

        res.write(`event: done\n`);
        res.write(`data: {}\n\n`);
        res.end();
      } catch (error) {
        console.error("RightAI stream failure", error);
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ message: describeRightAIError(error) })}\n\n`);
        res.end();
      }
    });
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, { error: "Invalid request" });
  }
}

async function handleContactRequest(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { error: "Method not allowed" });
  }

  if (!isAllowedOrigin(request)) {
    return sendJson(response, 403, { error: "Invalid origin" });
  }

  const ip = getClientIp(request);
  pruneRateLimitBuckets();
  if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return sendJson(response, 429, { error: "Too many submissions. Please try again shortly." });
  }

  try {
    const body = await parseJsonBody(request);
    const payload = {
      name: clampText(body?.name, 80),
      email: clampText(body?.email, 120),
      phone: clampText(body?.phone, 40),
      interest: clampText(body?.interest, 80),
      message: clampText(body?.message, 2000),
      company: clampText(body?.company, 120),
      honeypot: clampText(body?.website, 120) || clampText(body?.companyWebsite, 120),
      turnstileToken:
        clampText(body?.turnstileToken, 2000) || clampText(body?.cfTurnstileResponse, 2000),
    };

    if (payload.honeypot) {
      return sendJson(response, 200, { ok: true });
    }

    if (!payload.name || !payload.email || !payload.message) {
      return sendJson(response, 400, { error: "Please complete the required fields." });
    }

    if (!isValidEmail(payload.email)) {
      return sendJson(response, 400, { error: "Please enter a valid email address." });
    }

    if (!(await verifyTurnstileToken(payload.turnstileToken, request))) {
      return sendJson(response, 403, {
        error: "Please complete the anti-bot check and try again.",
      });
    }

    await sendContactEmail(payload, request);
    return sendJson(response, 200, {
      ok: true,
      message: `Thanks. Your message has been sent to ${supportEmail} and our team will respond soon.`,
    });
  } catch (error) {
    console.error("Contact submission failed", error);
    const contactError = describeContactError(error);
    if (contactError) {
      return sendJson(response, 502, { error: contactError });
    }
    return sendJson(response, 503, {
      error: `We could not send your message right now. Please email ${supportEmail} directly.`,
    });
  }
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    return sendJson(response, 400, { error: "Missing request URL" });
  }

  const url = new URL(request.url, "http://127.0.0.1:8787");

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  if (url.pathname === "/healthz") {
    return sendJson(response, 200, { ok: true });
  }

  if (url.pathname === "/api/contact") {
    return handleContactRequest(request, response);
  }

  if (url.pathname === "/api/rightai") {
    return handleRightAIRequest(request, response);
  }

  if (url.pathname === "/api/rightai/stream") {
    return handleRightAIStreamRequest(request, response);
  }

  response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ error: "Not found" }));
});

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
  const hostForLog = host === "0.0.0.0" ? "localhost" : host;
  console.log(`Node backend listening on http://${hostForLog}:${port}`);
});
