import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Roadmap } from "@/components/Roadmap";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Target, Heart, Zap, ShieldCheck, Sparkles, Activity } from "lucide-react";

const aboutStats = [
  { label: "Active listings", value: 3284 },
  { label: "Verified owners", value: 1156 },
  { label: "Volume transacted", value: 24, prefix: "₦", suffix: "B+" },
  { label: "Cities live", value: 12 },
];

function formatStatValue(value: number, prefix?: string, suffix?: string) {
  const formatted = value.toLocaleString();
  return `${prefix ?? ""}${formatted}${suffix ?? ""}`;
}

function CountStat({
  label,
  value,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="text-3xl md:text-5xl font-display font-bold text-gradient-primary">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div className="text-xs text-muted-foreground mt-2">{label}</div>
    </div>
  );
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — RIGHTHOME" },
      {
        name: "description",
        content:
          "RIGHTHOME is Africa's intelligent proptech platform — built to make property transactions transparent, secure and smart.",
      },
      { property: "og:title", content: "About RIGHTHOME" },
      {
        property: "og:description",
        content:
          "Our mission, roadmap and platform approach for safe and seamless property transactions.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="ABOUT US"
        title="Built for the next generation of African real estate"
        subtitle="We exist to remove friction, fraud and guesswork from property — for buyers, renters, investors and developers."
        highlightedWord="generation"
      />

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "Make every property transaction in Africa transparent, secure and intelligent — from listing to title transfer.",
            },
            {
              icon: Heart,
              title: "Our Values",
              desc: "Transparency over opacity. Verification over trust. Speed without sacrificing safety. People over paperwork.",
            },
            {
              icon: Zap,
              title: "Our Edge",
              desc: "We're the only platform fusing AI matching, blockchain titles and IoT monitoring into one experience.",
            },
          ].map((c) => (
            <div key={c.title} className="glass-strong rounded-2xl p-7">
              <div className="w-12 h-12 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)] mb-5">
                <c.icon className="w-5 h-5" />
              </div>
              <div className="font-display font-semibold text-xl">{c.title}</div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="glass-strong rounded-3xl p-8">
            <div className="text-xs text-primary font-mono tracking-wider">OUR FRAMEWORK</div>
            <h2 className="mt-4 text-3xl md:text-4xl font-display font-bold">
              A connected platform for every step of the property journey
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We combine intelligent search, real-time verification, and operational workflows so
              buyers, sellers, and managers can move with confidence.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              <li>• AI-powered discovery tailored to your budget, location, and goals.</li>
              <li>• Blockchain-secured title checks and transaction transparency.</li>
              <li>• Digital leasing, management, and IoT monitoring for long-term ownership.</li>
            </ul>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "Verified trust",
                desc: "Blockchain-backed records and title checks ensure every listing is authentic and secure.",
              },
              {
                icon: Sparkles,
                title: "Smart discovery",
                desc: "AI filtering, neighborhood analytics, and guided tours help you compare the best options quickly.",
              },
              {
                icon: Activity,
                title: "Operational clarity",
                desc: "Property health, maintenance, and tenancy status are visible in one centralized dashboard.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-glow)] mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-lg">{item.title}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-10">
        <div className="max-w-7xl mx-auto glass-strong rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {aboutStats.map((stat) => (
            <CountStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 xl:gap-10 mt-12">
          {[
            {
              title: "Customer-first support",
              desc: "Our teams guide every customer through discovery, verification, and closing with local expertise and digital speed.",
            },
            {
              title: "Regulatory alignment",
              desc: "RIGHTHOME works with local title experts, surveyors, and legal partners to make each transaction compliant and clear.",
            },
            {
              title: "Accessible innovation",
              desc: "We build tools that work for first-time buyers, investors, and property managers across diverse African markets.",
            },
          ].map((item) => (
            <div key={item.title} className="glass-strong rounded-3xl p-8">
              <div className="font-display font-semibold text-xl">{item.title}</div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Roadmap />
    </PageShell>
  );
}
