'use client';

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";

import { apiUrl } from "@/lib/api-base";
import { PageHeader, PageShell } from "@/components/PageShell";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/runtime-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - RIGHTHOME" },
      {
        name: "description",
        content:
          "Talk to the RIGHTHOME team - book a property consultation, list your property or partner with us.",
      },
      { property: "og:title", content: "Contact RIGHTHOME" },
      { property: "og:description", content: "We respond within 24 hours." },
    ],
  }),
  component: Contact,
});

const initialInterest = "Buying property";

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [notice, setNotice] = useState("");
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
  // Don't auto-load Turnstile on localhost to avoid invalid-site-key errors during dev.
  const [turnstileRequested, setTurnstileRequested] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const turnstileAttempts = useRef(0);
  const formRef = useRef<HTMLFormElement | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  const resetTurnstile = () => {
    if (window.turnstile && turnstileWidgetId.current) {
      window.turnstile.reset(turnstileWidgetId.current);
    }

    setTurnstileToken("");
  };

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileRef.current) {
      return undefined;
    }

    // If we're in the browser, only auto-request the widget when not on localhost.
    try {
      if (typeof window !== "undefined") {
        const host = window.location.hostname;
        const isLocal =
          host === "localhost" || host === "127.0.0.1" || host === "::1" || host.startsWith("192.168.");
        if (!isLocal) {
          setTurnstileRequested(true);
        }
      }
    } catch (err) {
      // ignore
    }

    const scriptId = "turnstile-api";
    const existingScript = document.getElementById(scriptId);

    const renderWidget = () => {
      if (!turnstileRef.current || turnstileWidgetId.current) return;

      try {
        if (!window.turnstile) {
          // script not ready yet — retry a few times
          turnstileAttempts.current += 1;
          if (turnstileAttempts.current <= 3) {
            setTimeout(renderWidget, 300 * turnstileAttempts.current);
          } else {
            setTurnstileFailed(true);
          }
          return;
        }

        // render can occasionally throw; guard it
        const wid = window.turnstile.render(turnstileRef.current, {
          sitekey: turnstileSiteKey,
          theme: "dark",
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });

        turnstileWidgetId.current = wid ?? String(Date.now());
        setTurnstileFailed(false);
        turnstileAttempts.current = 0;
      } catch (err) {
        // swallow errors and avoid blocking the page
        // schedule a retry with exponential backoff
        // eslint-disable-next-line no-console
        console.error("Turnstile render failed", err);
        turnstileAttempts.current += 1;
        if (turnstileAttempts.current <= 3) {
          const delay = 500 * Math.pow(2, turnstileAttempts.current - 1);
          setTimeout(renderWidget, delay);
        } else {
          setTurnstileFailed(true);
        }
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => setTimeout(renderWidget, 0);
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      try {
        if (window.turnstile && turnstileWidgetId.current) {
          window.turnstile.remove(turnstileWidgetId.current);
          turnstileWidgetId.current = null;
        }
      } catch (err) {
        // ignore cleanup errors
      }
    };
  }, [turnstileRequested, turnstileSiteKey]);

  const reloadTurnstile = () => {
    setTurnstileFailed(false);
    turnstileAttempts.current = 0;
    const existing = document.getElementById("turnstile-api");
    if (existing) existing.remove();
    turnstileWidgetId.current = null;
    // trigger effect to re-add script
    setTimeout(() => setTurnstileRequested((v) => !v), 50);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Tab',
    ];
    if (e.ctrlKey || e.metaKey || allowed.includes(e.key)) return;
    if (/^[0-9]$/.test(e.key)) return;
    e.preventDefault();
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text') || '';
    const digits = pasted.replace(/\D/g, '');
    if (!digits) {
      e.preventDefault();
      return;
    }
    // insert cleaned digits at cursor position
    const input = e.currentTarget;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const newVal = input.value.slice(0, start) + digits + input.value.slice(end);
    e.preventDefault();
    input.value = newVal;
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
      phone: String(formData.get("phone") || "").replace(/\D/g, "").trim(),
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

    if (hasClientValidationError) {
      formElement.reportValidity();
      setStatus("error");
      setNotice("Please complete the required fields.");
      return;
    }

    if (turnstileSiteKey && !payload.turnstileToken) {
      setTurnstileRequested(true);
      setStatus("error");
      setNotice("Please complete the anti-bot check before sending.");
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
        resetTurnstile();
        return;
      }

      setStatus("success");
      setNotice(
        data.message ||
          `Thanks. Your message has been sent to ${SUPPORT_EMAIL} and our team will reply soon.`,
      );
      formElement.reset();
      resetTurnstile();
      setTurnstileRequested(false);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setNotice(
        `We could not send your message right now. Please email ${SUPPORT_EMAIL} directly.`,
      );
      resetTurnstile();
    }
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="GET IN TOUCH"
        title="Let's find your right home"
        subtitle="Book a consultation, list a property, or partner with us. We respond within 24 hours."
      />

      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
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
              { icon: MapPin, label: "Office", value: "Port Harcourt, Rivers State" },
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
                <div>
                  <div className="text-xs text-muted-foreground">{contact.label}</div>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="mt-0.5 inline-flex font-semibold transition hover:text-primary"
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
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="glass-strong relative isolate overflow-hidden rounded-3xl p-7 md:p-9 lg:col-span-3"
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
                  <label htmlFor="contact-phone" className="text-xs text-muted-foreground">Phone</label>
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

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
                  Anti-bot check
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  This protects your inbox from automated spam. Complete the check below before
                  sending.
                </p>
                {turnstileSiteKey ? (
                  <>
                    <div ref={turnstileRef} className="relative z-10 mt-4 min-h-[65px]" />
                    {turnstileFailed ? (
                      <div className="mt-3 text-sm text-amber-200">
                        Cloudflare Turnstile failed to load (code 110200). Please verify your
                        Turnstile site key and secret are configured for this domain.
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={reloadTurnstile}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-3 text-xs text-amber-200/90">
                    Turnstile is not configured yet. Add `VITE_TURNSTILE_SITE_KEY` for the widget
                    and `TURNSTILE_SECRET_KEY` on the server.
                  </p>
                )}
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
                  className="relative z-10 mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
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
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-7 py-3.5 text-sm font-semibold shadow-[var(--shadow-glow)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "sending" ? "Sending..." : "Send message"}
                <Send className="h-4 w-4" />
              </button>
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

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLDivElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}
