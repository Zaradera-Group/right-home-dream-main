export const SUPPORT_EMAIL = "hello@zaraderagroup.com";
export const SUPPORT_PHONE = "+234 7017683590";
export const DEFAULT_CONTACT_TO_EMAIL = SUPPORT_EMAIL;
export const DEFAULT_CONTACT_FROM_EMAIL = "no-reply@righthomeproptech.com";

export const ENV_KEYS = {
  openaiApiKey: "OPENAI_API_KEY",
  mongoDbUri: "MONGODB_URI",
  mongoDbName: "MONGODB_DB_NAME",
  smtpHost: "SMTP_HOST",
  smtpPort: "SMTP_PORT",
  smtpSecure: "SMTP_SECURE",
  smtpUser: "SMTP_USER",
  smtpPass: "SMTP_PASS",
  contactToEmail: "CONTACT_TO_EMAIL",
  contactFromEmail: "CONTACT_FROM_EMAIL",
  turnstileSecretKey: "TURNSTILE_SECRET_KEY",
  turnstileSiteKey: "VITE_TURNSTILE_SITE_KEY",
} as const;
