import { ArrowRight, Sparkles, Facebook, Instagram, Linkedin, Twitter, Music2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

import logoUrl from "@/assets/Logo.png";

const footerLinks = [
  {
    heading: "Product",
    items: [
      { label: "Listings", to: "/properties" },
      { label: "Virtual Tours", to: "/virtual-tours" },
      { label: "Analytics", to: "/analytics" },
      { label: "Management", to: "/management" },
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
          <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-40" />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              Property guidance, whenever you need it
            </div>
            <h2 className="mx-auto max-w-3xl text-4xl font-display font-bold leading-tight md:text-6xl">
              Your next move starts with the right{" "}
              <span className="text-gradient-primary">details</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
              Use RightAI anywhere on the site for quick answers, or speak with our team for a
              guided consultation and verified listings.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.02]"
              >
                Chat with Ria
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold transition hover:bg-[#f24c21]/15 hover:text-primary"
              >
                Book a tour
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
            {/* Social Media Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://facebook.com/righthome"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden group relative items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-[#F24C21]/20 hover:border-[#F24C21]/50 hover:scale-110 hover:-translate-y-1"
                title="Follow us on Facebook"
              >
                <Facebook className="h-4 w-4 text-muted-foreground group-hover:text-[#F24C21] transition-colors" />
                <span className="absolute -inset-0.5 rounded-lg bg-[#F24C21]/0 group-hover:bg-[#F24C21]/10 transition-all duration-300" />
              </a>

              <a
                href="https://instagram.com/righthome"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden group relative items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-[#F24C21]/20 hover:border-[#F24C21]/50 hover:scale-110 hover:-translate-y-1"
                title="Follow us on Instagram"
              >
                <Instagram className="h-4 w-4 text-muted-foreground group-hover:text-[#F24C21] transition-colors" />
                <span className="absolute -inset-0.5 rounded-lg bg-[#F24C21]/0 group-hover:bg-[#F24C21]/10 transition-all duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/company/righthome-proptech/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-[#F24C21]/20 hover:border-[#F24C21]/50 hover:scale-110 hover:-translate-y-1"
                title="Connect with us on LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-[#F24C21] transition-colors" />
                <span className="absolute -inset-0.5 rounded-lg bg-[#F24C21]/0 group-hover:bg-[#F24C21]/10 transition-all duration-300" />
              </a>
              <a
                href="https://twitter.com/righthome"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden group relative items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-[#F24C21]/20 hover:border-[#F24C21]/50 hover:scale-110 hover:-translate-y-1"
                title="Follow us on Twitter"
              >
                <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-[#F24C21] transition-colors" />
                <span className="absolute -inset-0.5 rounded-lg bg-[#F24C21]/0 group-hover:bg-[#F24C21]/10 transition-all duration-300" />
              </a>
              <a
                href="https://tiktok.com/@righthome"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden group relative items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-[#F24C21]/20 hover:border-[#F24C21]/50 hover:scale-110 hover:-translate-y-1"
                title="Follow us on TikTok"
              >
                <Music2 className="h-4 w-4 text-muted-foreground group-hover:text-[#F24C21] transition-colors" />
                <span className="absolute -inset-0.5 rounded-lg bg-[#F24C21]/0 group-hover:bg-[#F24C21]/10 transition-all duration-300" />
              </a>
            </div>
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
                      className="text-muted-foreground transition hover:text-primary"
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
