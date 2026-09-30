"use client";

import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm, type FieldErrors, type UseFormRegisterReturn } from "react-hook-form";
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";

import { apiUrl } from "@/lib/api-base";
import { PageHeader, PageShell } from "@/components/PageShell";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/runtime-config";
import {
  contactFormSchema,
  contactInterestValues,
  type ContactFormValues,
} from "@/lib/form-validation";

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
  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      interest: initialInterest,
      message: "",
      website: "",
    },
  });

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

  const submitContact = async (values: ContactFormValues) => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.replace(/\D/g, "").trim(),
      interest: values.interest,
      message: values.message.trim(),
      website: values.website?.trim() || "",
      turnstileToken,
    };

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
        if (data.error?.includes("Cloudflare verification")) {
          setTurnstileVerified(false);
          setTurnstileToken("");
          const turnstile = window.turnstile;
          if (turnstile && widgetIdRef.current !== null) {
            turnstile.reset(widgetIdRef.current);
          }
        }
        return;
      }

      setStatus("success");
      setNotice(
        data.message ||
          `Thanks. Your message has been sent to ${SUPPORT_EMAIL} and our team will reply soon.`,
      );
      resetForm();
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

  const handleInvalid = (_errors: FieldErrors<ContactFormValues>) => {
    setStatus("error");
    setNotice("Please correct the highlighted fields before sending your message.");
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
            onSubmit={handleSubmit(submitContact, handleInvalid)}
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
                  id="contact-name"
                  placeholder="Your name"
                  autoComplete="name"
                  registration={register("name")}
                  error={errors.name?.message}
                />
                <Field
                  label="Email"
                  id="contact-email"
                  type="email"
                  placeholder="you@email.com"
                  autoComplete="email"
                  registration={register("email")}
                  error={errors.email?.message}
                />
                <div>
                  <label htmlFor="contact-phone" className="text-xs text-muted-foreground">
                    Phone
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="+234..."
                    autoComplete="tel"
                    {...register("phone")}
                    onKeyDown={handlePhoneKeyDown}
                    onPaste={handlePhonePaste}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                    className={`relative z-10 mt-1.5 w-full rounded-xl border bg-white/5 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${errors.phone ? "border-red-400/70" : "border-white/10 focus:border-primary"}`}
                  />
                  <FieldError id="contact-phone-error" message={errors.phone?.message} />
                </div>
                <div>
                  <label htmlFor="contact-interest" className="text-xs text-muted-foreground">
                    I'm interested in
                  </label>
                  <select
                    id="contact-interest"
                    {...register("interest")}
                    aria-invalid={Boolean(errors.interest)}
                    className="relative z-10 mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  >
                    {contactInterestValues.map((interest) => (
                      <option key={interest} value={interest} className="bg-[#060243]">
                        {interest}
                      </option>
                    ))}
                  </select>
                  <FieldError id="contact-interest-error" message={errors.interest?.message} />
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
                  rows={6}
                  placeholder="Tell us a bit more..."
                  {...register("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={`advanced-scrollbar relative z-10 mt-1.5 w-full resize-none rounded-xl border bg-white/5 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${errors.message ? "border-red-400/70" : "border-white/10 focus:border-primary"}`}
                />
                <FieldError id="contact-message-error" message={errors.message?.message} />
              </div>

              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                {...register("website")}
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
  registration,
  error,
  id,
  ...props
}: {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  id: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue">) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        {...registration}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`relative z-10 mt-1.5 w-full rounded-xl border bg-white/5 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 ${error ? "border-red-400/70" : "border-white/10 focus:border-primary"}`}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-200">
      {message}
    </p>
  ) : null;
}
