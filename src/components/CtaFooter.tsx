import { MessageCircle, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

import logoUrl from "@/assets/Logo.png";

const footerLinks = [
  {
    heading: "Product",
    items: [
      { label: "Listings", to: "/properties" },
      { label: "Virtual Tours", to: "/services" },
      { label: "Analytics", to: "/insights" },
      { label: "Management", to: "/services" },
      { label: "RightAI Chat", to: "/chat" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Press", to: "/press" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Terms", to: "/terms" },
      { label: "Privacy", to: "/privacy" },
      { label: "Security", to: "/security" },
      { label: "Cookies", to: "/privacy" },
    ],
  },
];

export function CtaFooter() {
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 text-center md:p-16">
          <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-60" />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
              <Sparkles className="h-3 w-3 text-primary" />
              Meet your AI property concierge
            </div>
            <h2 className="mx-auto max-w-3xl text-4xl font-display font-bold leading-tight md:text-6xl">
              Your next property is one <span className="text-gradient-primary">conversation</span>{" "}
              away.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Chat with RightAI - describe what you want and we'll surface verified, ROI-ranked
              options instantly.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-7 py-3.5 text-sm font-semibold shadow-[var(--shadow-glow)] transition hover:scale-105"
              >
                <MessageCircle className="h-4 w-4" />
                Ask RightAI
              </Link>
              <Link
                to="/contact"
                className="rounded-full glass-strong px-7 py-3.5 text-sm font-semibold transition hover:bg-white/10"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-16 grid grid-cols-2 gap-8 text-sm md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-3 text-lg font-display font-bold">
              <img
                src={logoUrl}
                alt="RIGHTHOME logo"
                className="h-8 w-8 rounded-2xl border border-white/10 bg-white/5 object-contain"
              />
              RIGHT<span className="text-primary">HOME</span>
            </div>
            <p className="mt-3 max-w-xs text-xs text-muted-foreground">
              Africa's intelligent proptech platform - AI, blockchain, IoT.
            </p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.heading}>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                {column.heading}
              </div>
              <ul className="mt-3 space-y-2 text-xs">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-muted-foreground transition hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </footer>

        <div className="mt-10 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-6 text-xs text-muted-foreground">
          <span>&copy; 2026 RightHome. Built in Nigeria.</span>
          <span>Powered by AI - Secured by Blockchain</span>
        </div>
      </div>
    </section>
  );
}
