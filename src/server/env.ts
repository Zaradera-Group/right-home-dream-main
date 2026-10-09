import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const REQUIRED_SERVER_KEYS = ["OPENAI_API_KEY"] as const;

function parseDotEnv(content: string): Record<string, string> {
  const parsed: Record<string, string> = {};

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

    parsed[key] = value;
  }

  return parsed;
}

export function loadDotEnvFile(filePath = resolve(process.cwd(), ".env")): string[] {
  if (!existsSync(filePath)) {
    return [];
  }

  const parsed = parseDotEnv(readFileSync(filePath, "utf8"));
  const loadedKeys: string[] = [];

  for (const [key, value] of Object.entries(parsed)) {
    if (!process.env[key]) {
      process.env[key] = value;
      loadedKeys.push(key);
    }
  }

  return loadedKeys;
}

export function validateRequiredServerEnv(context: string, keys: readonly string[] = REQUIRED_SERVER_KEYS): void {
  const missingKeys = keys.filter((key) => !process.env[key]?.trim());
  if (missingKeys.length === 0) {
    return;
  }

  const message = `${context}: missing required environment variable(s): ${missingKeys.join(", ")}. Set them in your local .env file or as deployment secrets before starting the app.`;
  console.error(message);
  throw new Error(message);
}

export function bootstrapLocalServerEnv(context: string): void {
  const loadedKeys = loadDotEnvFile();
  if (loadedKeys.length > 0 || existsSync(resolve(process.cwd(), ".env"))) {
    const requiredKeys = [
      ...REQUIRED_SERVER_KEYS,
      "MONGODB_URI",
      "SMTP_HOST",
      "SMTP_USER",
      "SMTP_PASS",
    ];
    validateRequiredServerEnv(context, requiredKeys);
  }
}
