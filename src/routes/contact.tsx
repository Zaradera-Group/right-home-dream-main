"use client";

import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";

import { apiUrl } from "@/lib/api-base";
import { PageHeader, PageShell } from "@/components/PageShell";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/runtime-config";

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
};

type TurnstileInstance = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
}

function createMathChallenge() {
  const a = Math.floor(Math.random() * 12) + 3;
  const b = Math.floor(Math.random() * 8) + 2;
  const isMultiply = Math.random() < 0.5;
  return {
    question: `${a} ${isMultiply ? "*" : "+"} ${b}`,
    answer: isMultiply ? a * b : a + b,
  };
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact, RightHome Proptech" },
      {
        name: "description",
        content:
          "Talk to the RightHome Proptech team, book a property tour, list your property or partner with us.",
      },
      { property: "og:title", content: "Contact RightHome Proptech" },
      { property: "og:description", content: "We respond within 24 hours." },
    ],
  }),
  component: Contact,
});

const initialInterest = "Buying property";

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [mathInput, setMathInput] = useState("");
  const [mathVerified, setMathVerified] = useState(false);
  const [mathChallenge, setMathChallenge] = useState(() => createMathChallenge());
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [turnstileError, setTurnstileError] = useState("");
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  const requiresTurnstile = Boolean(turnstileSiteKey);
  const verificationComplete = mathVerified && (!requiresTurnstile || turnstileVerified);
  const isSubmitDisabled = status === "sending" || !verificationComplete;
  const submitLabel =
    status === "sending"
      ? "Sending..."
      : verificationComplete
        ? "Send message"
        : "Complete verification";

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Home", "End", "Tab"];
    if (e.ctrlKey || e.metaKey || allowed.includes(e.key)) return;
    if (/^[0-9]$/.test(e.key)) return;
    e.preventDefault();
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text") || "";
    const digits = pasted.replace(/\D/g, "");
    if (!digits) {
      e.preventDefault();
      return;
    }

    const input = e.currentTarget;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const newVal = input.value.slice(0, start) + digits + input.value.slice(end);
    e.preventDefault();
    input.value = newVal;
  };

  useEffect(() => {
    if (!turnstileSiteKey) {
      return;
    }

    const renderTurnstile = () => {
      const turnstile = window.turnstile;
      const container = turnstileContainerRef.current;
      if (!turnstile || !container || widgetIdRef.current !== null) {
        return;
      }

      widgetIdRef.current = turnstile.render(container, {
        sitekey: turnstileSiteKey,
        theme: "dark",
        callback: (token: string) => {
          setTurnstileToken(token);
          setTurnstileVerified(true);
          setTurnstileError("");
        },
        "error-callback": () => {
          setTurnstileError("Cloudflare verification failed. Please retry.");
          setTurnstileVerified(false);
          setTurnstileToken("");
        },
        "expired-callback": () => {
          setTurnstileVerified(false);
          setTurnstileToken("");
        },
      });
    };

    if (window.turnstile) {
      renderTurnstile();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderTurnstile;
    script.onerror = () => {
      setTurnstileError("Unable to load Cloudflare verification. Please refresh the page.");
    };

    document.body.appendChild(script);
    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [turnstileSiteKey]);

  const handleVerifyMath = () => {
    const answer = mathChallenge.answer;
    if (Number(mathInput.trim()) === answer) {
      setMathVerified(true);
      setNotice("Maths check confirmed.");
      return;
    }

    setMathVerified(false);
    setNotice("The maths answer is incorrect. Please try again.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const nameInput = formElement.elements.namedItem("name") as HTMLInputElement | null;
    const emailInput = formElement.elements.namedItem("email") as HTMLInputElement | null;
    const messageInput = formElement.elements.namedItem("message") as HTMLTextAreaElement | null;

    nameInput?.setCustomValidity("");
    emailInput?.setCustomValidity("");
    messageInput?.setCustomValidity("");

    const formData = new FormData(formElement);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "")
        .replace(/\D/g, "")
        .trim(),
      interest: String(formData.get("interest") || initialInterest).trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      turnstileToken,
    };

    let hasClientValidationError = false;

    if (!payload.name) {
      nameInput?.setCustomValidity("Please enter your name.");
      hasClientValidationError = true;
    }

    if (!payload.email) {
      emailInput?.setCustomValidity("Please enter your email address.");
      hasClientValidationError = true;
    } else if (emailInput && !emailInput.checkValidity()) {
      emailInput.setCustomValidity("Please enter a valid email address.");
      hasClientValidationError = true;
    }

    if (!payload.message) {
      messageInput?.setCustomValidity("Please enter a message.");
      hasClientValidationError = true;
    }

    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      setStatus("error");
      setNotice("Please complete the required fields.");
      return;
    }

    if (requiresTurnstile && !turnstileVerified) {
      setStatus("error");
      setNotice("Please complete the Cloudflare verification widget before sending.");
      return;
    }

    if (!mathVerified) {
      setStatus("error");
      setNotice("Please complete the maths challenge before sending.");
      return;
    }

    if (hasClientValidationError) {
      formElement.reportValidity();
      setStatus("error");
      setNotice("Please complete the required fields.");
      return;
    }

    setStatus("sending");
    setNotice("");

    try {
      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setStatus("error");
        setNotice(
          data.error ||
            `We could not send your message right now. Please email ${SUPPORT_EMAIL} directly.`,
        );
        return;
      }

      setStatus("success");
      setNotice(
        data.message ||
          `Thanks. Your message has been sent to ${SUPPORT_EMAIL} and our team will reply soon.`,
      );
      formElement.reset();
      setMathInput("");
      setMathVerified(false);
      setMathChallenge(createMathChallenge());
      setTurnstileVerified(false);
      setTurnstileToken("");

      const turnstile = window.turnstile;
      if (turnstile && widgetIdRef.current !== null) {
        turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setNotice(
        `We could not send your message right now. Please email ${SUPPORT_EMAIL} directly.`,
      );
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="GET IN TOUCH"
        title="Let's find your right home"
        subtitle="Book a tour, list a property, or partner with us. We respond within 24 hours."
        highlightedWord="right"
      />

      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="min-w-0 space-y-4 lg:col-span-2">
            {[
              {
                icon: Mail,
                label: "Email",
                value: SUPPORT_EMAIL,
                href: `mailto:${SUPPORT_EMAIL}`,
              },
              {
                icon: Phone,
                label: "Phone",
                value: SUPPORT_PHONE,
                href: "tel:+2347017683590",
              },
              { icon: MapPin, label: "Headquarters", value: "Port Harcourt, Rivers State" },
              {
                icon: MessageCircle,
                label: "Live chat",
                value: "Available 9am-9pm WAT",
                href: "/chat",
              },
            ].map((contact) => (
              <div
                key={contact.label}
                className="glass-strong flex items-start gap-4 rounded-2xl p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--gradient-primary)] shadow-[var(--shadow-glow)]">
                  <contact.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{contact.label}</div>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="mt-0.5 inline-flex max-w-full break-all font-semibold transition hover:text-primary"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <div className="mt-0.5 font-semibold">{contact.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass-strong relative isolate min-w-0 overflow-hidden rounded-3xl p-4 sm:p-6 md:p-9 lg:col-span-3"
          >
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(242,76,33,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-primary">
                <ShieldCheck className="h-4 w-4" /> Secure submission
              </div>
              <h2 className="mt-4 text-2xl font-display font-semibold">Send us a message</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us what you're looking for and we will send it straight to our inbox.
              </p>

              {notice ? (
                <div
                  className={`mt-6 rounded-2xl border px-4 py-3 text-sm transition-all duration-500 ${status === "success" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-red-400/30 bg-red-400/10 text-red-100"}`}
                  aria-live="polite"
                >
                  {notice}
                </div>
              ) : null}

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="Full name"
                  name="name"
                  defaultValue=""
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  defaultValue=""
                  placeholder="you@email.com"
                  autoComplete="email"
                  required
                />
                <div>
                  <label htmlFor="contact-phone" className="text-xs text-muted-foreground">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    defaultValue=""
                    placeholder="+234..."
                    autoComplete="tel"
                    onKeyDown={handlePhoneKeyDown}
                    onPaste={handlePhonePaste}
                    className="relative z-10 mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label htmlFor="contact-interest" className="text-xs text-muted-foreground">
                    I'm interested in
                  </label>
                  <select
                    id="contact-interest"
                    name="interest"
                    defaultValue={initialInterest}
                    className="relative z-10 mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  >
                    <option className="bg-[#060243]">Buying property</option>
                    <option className="bg-[#060243]">Renting</option>
                    <option className="bg-[#060243]">Investing</option>
                    <option className="bg-[#060243]">Listing a property</option>
                    <option className="bg-[#060243]">Partnership</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="glass min-w-0 rounded-3xl border border-white/15 bg-white/10 p-4 sm:p-5 ring-2 ring-primary/20 shadow-[0_28px_80px_rgba(242,76,33,0.18)] transition duration-300 hover:-translate-y-1 w-full">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Human verification</div>
                      <div className="mt-1 text-sm font-semibold text-foreground">
                        Solve the quick maths challenge
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.24em] ${
                        mathVerified
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {mathVerified ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                  {mathVerified ? (
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-200">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 animate-verified-pop">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <span>Verified and ready</span>
                    </div>
                  ) : null}
                  <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-foreground">
                    {mathChallenge.question}
                  </div>
                  <div className="mt-4 flex flex-col gap-3">
                    <input
                      type="text"
                      value={mathInput}
                      onChange={(event) => setMathInput(event.target.value)}
                      placeholder="Your answer"
                      className="relative z-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyMath}
                      disabled={mathVerified}
                      className="inline-flex items-center justify-center rounded-full bg-[var(--gradient-primary)] px-4 py-2 text-sm font-semibold shadow-[var(--shadow-glow)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {mathVerified ? "Verified" : "Confirm maths"}
                    </button>
                  </div>
                </div>

                {turnstileSiteKey ? (
                  <div className="glass min-w-0 rounded-3xl border border-white/15 bg-white/10 p-4 sm:p-5 ring-2 ring-primary/20 shadow-[0_28px_80px_rgba(242,76,33,0.18)] transition duration-300 hover:-translate-y-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Cloudflare verification</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">
                          Complete the widget below
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.24em] ${
                          turnstileVerified
                            ? "bg-emerald-400/15 text-emerald-200"
                            : "bg-white/5 text-muted-foreground"
                        }`}
                      >
                        {turnstileVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                    {turnstileVerified ? (
                      <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-200">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 animate-verified-pop">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <span>Cloudflare confirmed</span>
                      </div>
                    ) : null}
                    <div className="mt-4 min-h-[140px] min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 sm:p-4">
                      {turnstileSiteKey ? (
                        <div
                          ref={turnstileContainerRef}
                          className="turnstile-container min-h-[140px] w-full"
                        />
                      ) : (
                        <div className="rounded-3xl border border-white/10 bg-[#0d0c30] p-4 text-sm text-muted-foreground">
                          Turnstile is not configured. Please set VITE_TURNSTILE_SITE_KEY.
                        </div>
                      )}
                    </div>
                    {turnstileError ? (
                      <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-100">
                        {turnstileError}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                <label className="text-xs text-muted-foreground" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  defaultValue=""
                  placeholder="Tell us a bit more..."
                  required
                  className="advanced-scrollbar relative z-10 mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                defaultValue=""
              />
              {status === "sending" ? (
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  aria-busy="true"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-7 py-3.5 text-sm font-semibold shadow-[var(--shadow-glow)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitLabel}
                  <Send className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-7 py-3.5 text-sm font-semibold shadow-[var(--shadow-glow)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitLabel}
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <input
        {...props}
        className="relative z-10 mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
