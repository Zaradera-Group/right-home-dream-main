import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Roadmap } from "@/components/Roadmap";
import { Testimonials } from "@/components/Testimonials";
import { Target, Heart, Zap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — RIGHTHOME" },
      { name: "description", content: "RIGHTHOME is Africa's intelligent proptech platform — built to make property transactions transparent, secure and smart." },
      { property: "og:title", content: "About RIGHTHOME" },
      { property: "og:description", content: "Our mission, roadmap and customer stories." },
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
      />

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Target, title: "Our Mission", desc: "Make every property transaction in Africa transparent, secure and intelligent — from listing to title transfer." },
            { icon: Heart, title: "Our Values", desc: "Transparency over opacity. Verification over trust. Speed without sacrificing safety. People over paperwork." },
            { icon: Zap, title: "Our Edge", desc: "We're the only platform fusing AI matching, blockchain titles and IoT monitoring into one experience." },
          ].map(c => (
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

      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto glass-strong rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { n: "3,284", l: "Active listings" },
            { n: "1,156", l: "Verified owners" },
            { n: "₦24B+", l: "Volume transacted" },
            { n: "12", l: "Cities live" },
          ].map(s => (
            <div key={s.l}>
              <div className="text-3xl md:text-5xl font-display font-bold text-gradient-primary">{s.n}</div>
              <div className="text-xs text-muted-foreground mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <Roadmap />
      <Testimonials />
    </PageShell>
  );
}
