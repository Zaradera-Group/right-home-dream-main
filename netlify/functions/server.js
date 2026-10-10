import { Buffer } from "node:buffer";
import { MongoClient, ServerApiVersion } from "mongodb";
import nodemailer from "nodemailer";
import { z } from "zod";

const SUPPORT_EMAIL = "help@righthomeproptech.com";
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
let mongoClientPromise;
let mongoIndexesPromise;
let mailTransporter;
let mailTransporterKey;

const contactPayloadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((value) => !value || /^\d{7,20}$/.test(value)),
  interest: z.enum([
    "Buying property",
    "Renting",
    "Investing",
    "Listing a property",
    "Partnership",
  ]),
  message: z.string().trim().min(10).max(2000),
  company: z.string().max(120),
  turnstileToken: z.string().max(2048),
  honeypot: z.string().max(120),
});

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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function withCorsHeaders(response, request) {
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

  return "RightAI is unavailable right now. Please contact help@righthomeproptech.com for urgent help.";
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
  return SUPPORT_EMAIL;
}

function getContactFromEmail(env) {
  return cleanServerSetting(env?.CONTACT_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL) || SUPPORT_EMAIL;
}

function getServerSetting(env, key) {
  return cleanServerSetting(env?.[key] || process.env[key]);
}

function cleanServerSetting(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed || undefined;
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
  if (data.success !== true) {
    console.error("Cloudflare Turnstile validation failed", {
      errorCodes: data["error-codes"] || [],
      hostname: data.hostname || "unknown",
    });
  }
  return data.success === true;
}

function getMongoClient(env) {
  const uri = getServerSetting(env, "MONGODB_URI");
  if (!uri) {
    throw new Error("MONGODB_URI is missing.");
  }

  if (!mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    mongoClientPromise = client.connect().catch((error) => {
      mongoClientPromise = undefined;
      throw error;
    });
  }

  return mongoClientPromise;
}

async function getContactCollection(env) {
  const client = await getMongoClient(env);
  const databaseName = getServerSetting(env, "MONGODB_DB_NAME") || "righthome_proptech";
  const collection = client.db(databaseName).collection("contact_submissions");

  if (!mongoIndexesPromise) {
    mongoIndexesPromise = collection
      .createIndexes([
        { key: { createdAt: -1 }, name: "createdAt_desc" },
        { key: { email: 1, createdAt: -1 }, name: "email_createdAt" },
      ])
      .catch((error) => {
        mongoIndexesPromise = undefined;
        throw error;
      });
  }
  await mongoIndexesPromise;
  return collection;
}

function getMailTransporter(env) {
  const host = getServerSetting(env, "SMTP_HOST");
  const portValue = getServerSetting(env, "SMTP_PORT") || "587";
  const user = getServerSetting(env, "SMTP_USER");
  const pass =
    getServerSetting(env, "SMTP_PASSWORD") || getServerSetting(env, "SMTP_PASS");
  const port = Number(portValue);

  if (!host || !user || !pass || !Number.isInteger(port)) {
    throw new Error("SMTP configuration is incomplete.");
  }

  const secureSetting = getServerSetting(env, "SMTP_SECURE");
  const secure = port === 465 || secureSetting?.toLowerCase() === "true";
  const transporterKey = `${host}:${port}:${secure}:${user}`;
  if (!mailTransporter || mailTransporterKey !== transporterKey) {
    mailTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: port === 587,
      auth: { user, pass },
      tls: { minVersion: "TLSv1.2" },
      connectionTimeout: 7000,
      greetingTimeout: 7000,
      socketTimeout: 9000,
    });
    mailTransporterKey = transporterKey;
  }

  return mailTransporter;
}

async function storeContactSubmission(env, payload, request) {
  const collection = await getContactCollection(env);
  const now = new Date();
  const result = await collection.insertOne({
    name: payload.name,
    email: payload.email.toLowerCase(),
    phone: payload.phone || null,
    interest: payload.interest,
    message: payload.message,
    company: payload.company || null,
    status: "received",
    delivery: {
      team: { status: "pending" },
      acknowledgement: { status: "pending" },
    },
    source: {
      channel: "website-contact-form",
      ip: getClientIp(request),
      origin: request.headers.get("origin") || null,
      userAgent: request.headers.get("user-agent") || null,
    },
    createdAt: now,
    updatedAt: now,
  });
  return { collection, submissionId: result.insertedId };
}

async function setDeliveryStatus(collection, submissionId, channel, status, error) {
  if (!collection || !submissionId) {
    return;
  }
  const update = {
    [`delivery.${channel}.status`]: status,
    [`delivery.${channel}.updatedAt`]: new Date(),
    updatedAt: new Date(),
  };
  if (error) {
    update[`delivery.${channel}.error`] = String(error).slice(0, 500);
  }
  await collection.updateOne({ _id: submissionId }, { $set: update });
}

async function deliverContactEmails(env, payload, request, collection, submissionId) {
  const toEmail = getContactToEmail(env);
  const fromEmail = getContactFromEmail(env);

  if (!fromEmail) {
    throw new Error("CONTACT_FROM_EMAIL is missing.");
  }

  let transporter;
  try {
    transporter = getMailTransporter(env);
    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: payload.email,
      subject: `New website enquiry from ${payload.name}`,
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
    });
    await setDeliveryStatus(collection, submissionId, "team", "sent");
  } catch (error) {
    await setDeliveryStatus(collection, submissionId, "team", "failed", error);
    throw new Error("Team email delivery failed.", { cause: error });
  }

  const customerName = payload.name || "there";
  const safeCustomerName = escapeHtml(customerName);
  try {
    await transporter.sendMail({
      from: fromEmail,
      to: payload.email,
      subject: "Thank you for contacting RightHome Proptech",
      text: [
        `Dear ${customerName},`,
        "",
        "Thank you for contacting RightHome Proptech. We sincerely appreciate you taking the time to reach out to us.",
        "",
        "We have received your message, and a member of our team will review your enquiry carefully and get back to you as soon as possible.",
        "",
        "What happens next:",
        "• Our team will review the information you provided.",
        "• The appropriate property specialist will follow up with you.",
        "• You can expect a response within 24 hours.",
        "",
        "For urgent enquiries, please contact our team at help@righthomeproptech.com.",
        "",
        "We greatly appreciate your interest in RightHome Proptech and look forward to assisting you with your property needs.",
        "",
        "Warm regards,",
        "The RightHome Proptech Team",
        "help@righthomeproptech.com",
      ].join("\n"),
      html: `
        <div style="margin:0;background:#f5f5f7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#17172f">
          <div style="max-width:620px;margin:0 auto;overflow:hidden;border-radius:18px;background:#ffffff;border:1px solid #e9e9ef">
            <div style="background:#060243;padding:28px 32px">
              <div style="font-size:22px;font-weight:700;color:#ffffff">Right<span style="color:#f24c21">Home</span> Proptech</div>
              <div style="margin-top:6px;font-size:13px;color:#d6d4ee">Professional property guidance you can trust</div>
            </div>
            <div style="padding:32px">
              <p style="margin:0 0 20px;font-size:16px;line-height:1.7">Dear ${safeCustomerName},</p>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7">Thank you for contacting RightHome Proptech. We sincerely appreciate you taking the time to reach out to us.</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7">We have received your message, and a member of our team will review your enquiry carefully and get back to you as soon as possible.</p>
              <div style="margin:0 0 24px;border-left:4px solid #f24c21;border-radius:8px;background:#f8f7fc;padding:18px 20px">
                <div style="margin-bottom:10px;font-size:14px;font-weight:700;color:#060243">What happens next</div>
                <div style="font-size:14px;line-height:1.8;color:#44445a">Our team will review your information, connect your enquiry with the appropriate property specialist, and respond within 24 hours.</div>
              </div>
              <p style="margin:0 0 18px;font-size:15px;line-height:1.7">For urgent enquiries, please contact our team at help@righthomeproptech.com.</p>
              <p style="margin:0 0 26px;font-size:15px;line-height:1.7">We greatly appreciate your interest in RightHome Proptech and look forward to assisting you with your property needs.</p>
              <p style="margin:0;font-size:15px;line-height:1.7"><strong>Warm regards,</strong><br />The RightHome Proptech Team</p>
            </div>
            <div style="border-top:1px solid #eeeeF3;padding:18px 32px;font-size:12px;line-height:1.6;color:#6b6b7c">Thank you for contacting RightHome Proptech. We appreciate your trust and look forward to assisting you.</div>
          </div>
        </div>
      `,
    });
    await setDeliveryStatus(collection, submissionId, "acknowledgement", "sent");
  } catch (error) {
    console.error("Customer acknowledgement delivery failed", error);
    await setDeliveryStatus(collection, submissionId, "acknowledgement", "failed", error);
  }
}

function describeContactError(error) {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("MONGODB_URI is missing") || message.includes("SMTP configuration")) {
    return "The contact service is not fully configured. Please email help@righthomeproptech.com directly.";
  }
  if (message.includes("Team email delivery failed")) {
    const smtpError = error instanceof Error && error.cause ? error.cause : error;
    const code = typeof smtpError?.code === "string" ? smtpError.code : "UNKNOWN";
    const responseCode = Number.isInteger(smtpError?.responseCode)
      ? smtpError.responseCode
      : null;

    console.error("SMTP delivery failed", {
      code,
      responseCode,
      command: typeof smtpError?.command === "string" ? smtpError.command : null,
    });

    if (code === "EAUTH" || responseCode === 535) {
      return "Zoho SMTP authentication failed. Please verify the complete mailbox address and its app-specific password.";
    }
    if (["ECONNECTION", "ECONNREFUSED", "ENOTFOUND", "ESOCKET"].includes(code)) {
      return "Netlify could not connect to the configured Zoho SMTP server. Please verify the Zoho server hostname and port.";
    }
    if (code === "ETIMEDOUT") {
      return "The connection to Zoho SMTP timed out. Please use port 587 with TLS and try again.";
    }
    if (code === "EENVELOPE" || responseCode === 550 || responseCode === 553) {
      return "Zoho rejected the sender address. CONTACT_FROM_EMAIL must match the authenticated Zoho mailbox or one of its aliases.";
    }

    return "Zoho could not deliver the notification email. Please review the SMTP error code in the Netlify Function log.";
  }

  return null;
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
    turnstileToken: clampText(payload.turnstileToken, 2048),
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
    return withCorsHeaders(jsonResponse({ error: "Method not allowed" }, 405), request);
  }

  if (!isAllowedOrigin(request)) {
    return withCorsHeaders(jsonResponse({ error: "Invalid origin" }, 403), request);
  }

  const ip = getClientIp(request);
  pruneRateLimitBuckets();
  if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return withCorsHeaders(
      jsonResponse({ error: "Too many submissions. Please try again shortly." }, 429),
      request,
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return withCorsHeaders(jsonResponse({ error: "Invalid request body" }, 400), request);
  }

  const payload = parseContactPayload(body);
  if (payload.honeypot) {
    return withCorsHeaders(jsonResponse({ ok: true }), request);
  }

  const validation = contactPayloadSchema.safeParse(payload);
  if (!validation.success) {
    const invalidField = validation.error.issues[0]?.path[0];
    const validationMessages = {
      name: "Please enter a valid name.",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number.",
      interest: "Please select a valid area of interest.",
      message: "Please enter a message of at least 10 characters.",
    };
    return withCorsHeaders(
      jsonResponse(
        {
          error:
            validationMessages[invalidField] || "Please review your information and try again.",
        },
        400,
      ),
      request,
    );
  }

  const validatedPayload = validation.data;

  try {
    let collection = null;
    let submissionId = null;
    try {
      const storedSubmission = await storeContactSubmission(env, validatedPayload, request);
      collection = storedSubmission.collection;
      submissionId = storedSubmission.submissionId;
    } catch (error) {
      console.error("MongoDB contact persistence failed; continuing with email delivery", error);
    }
    await deliverContactEmails(
      env,
      validatedPayload,
      request,
      collection,
      submissionId,
    );
    return withCorsHeaders(
      jsonResponse({
        ok: true,
        message:
          "Thank you for contacting RightHome Proptech. Your message has been received successfully, and our team will respond within 24 hours.",
      }),
      request,
    );
  } catch (error) {
    console.error("Contact submission failed", error);
    const contactError = describeContactError(error);
    if (contactError) {
      return withCorsHeaders(jsonResponse({ error: contactError }, 502), request);
    }
    return withCorsHeaders(
      jsonResponse(
        {
          error:
            "We could not send your message right now. Please email help@righthomeproptech.com directly.",
        },
        503,
      ),
      request,
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

  if (event.httpMethod === "OPTIONS") {
    const preflight = new Response(null, { status: 204 });
    preflight.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    preflight.headers.set("Access-Control-Allow-Headers", "Content-Type");
    preflight.headers.set("Access-Control-Allow-Origin", request.headers.get("origin") || "*");
    preflight.headers.set("Vary", "Origin");
    return toNetlifyResponse(preflight);
  }

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
