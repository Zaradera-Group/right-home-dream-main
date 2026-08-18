import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Eye,
  Link2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AdvantageFlow } from "@/components/AdvantageFlow";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Personas } from "@/components/Personas";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services - RIGHTHOME_PROPTECH" },
      {
        name: "description",
        content:
          "AI matching, virtual tours, smart investments, verified listings, blockchain transactions and IoT property management.",
      },
      { property: "og:title", content: "RIGHTHOME Services" },
      { property: "og:description", content: "The full proptech stack - AI, Blockchain, IoT." },
    ],
  }),
  component: Services,
});

const services = [
  {
    icon: Sparkles,
    title: "AI Property Match",
    desc: "Personalized listings based on browsing, budget and lifestyle. Our model learns what you actually want.",
    details:
      "We combine search behavior, saved homes and budget signals to surface properties that feel curated instead of generic.",
    proof: ["Behavior-aware ranking", "Budget and lifestyle filters", "Daily curated picks"],
    outcome: "Shorter search cycles and better-fit property suggestions.",
  },
  {
    icon: Eye,
    title: "Virtual and 360 Tours",
    desc: "Walk through every property from anywhere. VR-ready for full immersion.",
    details:
      "Open rooms, inspect layouts and compare homes without waiting for a physical site visit. It is built for quick decisions.",
    proof: ["360-degree photo tours", "Drone aerials", "VR headset support"],
    outcome: "Faster pre-viewing and less wasted travel.",
  },
  {
    icon: TrendingUp,
    title: "Smart Investments",
    desc: "Predictive ROI heatmaps and fractional ownership for high-yield assets.",
    details:
      "Use trend overlays, ROI snapshots and demand estimates to understand where a property may perform before you commit.",
    proof: ["ROI forecasting", "Fractional ownership", "Market heatmaps"],
    outcome: "Clearer investment decisions with better context.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    desc: "Every property cleared by our title and survey verification team before it lists.",
    details:
      "Each listing is checked for title status, survey alignment and basic encumbrance risks before it appears on the platform.",
    proof: ["Title verification", "Survey checks", "No-encumbrance audit"],
    outcome: "Lower risk and more trustworthy inventory.",
  },
  {
    icon: Link2,
    title: "Blockchain Transactions",
    desc: "Tamper-proof ownership records and smart-contract escrow for every deal.",
    details:
      "Transaction records can be anchored to a traceable ledger, helping preserve an auditable history from offer to close.",
    proof: ["On-chain titles", "Smart escrow", "Audit trail"],
    outcome: "A cleaner paper trail with less ambiguity.",
  },
  {
    icon: Boxes,
    title: "Property Management",
    desc: "Dashboards for landlords: rent, maintenance, tenant chat plus live IoT.",
    details:
      "Track rent, handle maintenance requests and monitor connected devices from a single operational view.",
    proof: ["Rent collection", "Maintenance tickets", "IoT monitoring"],
    outcome: "Less manual admin and faster response times.",
  },
] as const;

function Services() {
  const [activeService, setActiveService] = useState<(typeof services)[number]["title"] | null>(
    services[0].title,
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="OUR SERVICES"
        title="The full proptech stack, in one platform"
        subtitle="Six services that cover the entire property lifecycle - from discovery to ownership to ongoing management."
        highlightedWord="platform"
      />
      <section className="px-4 pb-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const expanded = activeService === service.title;

            return (
              <article
                key={service.title}
                onMouseEnter={() => setActiveService(service.title)}
                onMouseLeave={() =>
                  setActiveService((current) => (current === service.title ? null : current))
                }
                className={`glass-strong group overflow-hidden rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1 ${expanded ? "ring-2 ring-[#F24C21]/50 shadow-[0_24px_80px_rgba(242,76,33,0.3)]" : ""}`}
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
                    Live capability
                  </span>
                </div>

                <div className="font-display text-xl font-semibold">{service.title}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.desc}</p>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${expanded ? "max-h-[22rem] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1"}`}
                >
                  <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
                    <p className="text-sm leading-6 text-foreground/90">{service.details}</p>

                    <div className="grid gap-2">
                      {service.proof.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
                        Why it matters
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {service.outcome}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-4 flex flex-wrap gap-3 transition-all duration-500 ${expanded ? "max-h-24 opacity-100 translate-y-0" : "pointer-events-none max-h-0 opacity-0 -translate-y-2"}`}
                >
                  <Link
                    to="/chat"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.03]"
                  >
                    Chat with Ria
                    <ArrowRight className="h-3.5 w-3.5 animate-arrow-breathe" />
                  </Link>
                  <Link
                    to="/insights"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold transition hover:bg-[#f24c21]/12 hover:text-primary"
                  >
                    View insights
                    <ArrowUpRight className="h-3.5 w-3.5 animate-arrow-breathe" />
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveService(expanded ? null : service.title)}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-primary transition hover:gap-3"
                >
                  Learn more
                  <ArrowUpRight
                    className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""} animate-arrow-breathe`}
                  />
                </button>
              </article>
            );
          })}
        </div>
      </section>
      <AdvantageFlow />
      <Personas />
    </PageShell>
  );
}
