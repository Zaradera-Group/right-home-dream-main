import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { MapPinned, Ruler, HardHat } from "lucide-react";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Property Development, RightHome Proptech" },
      {
        name: "description",
        content: "Move from land assessment to project completion with practical property development guidance.",
      },
      { property: "og:title", content: "RightHome Proptech Property Development" },
      {
        property: "og:description",
        content: "Plan, monitor and understand property development with clearer project information.",
      },
    ],
  }),
  component: ManagementPage,
});

function ManagementPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="PROPERTY DEVELOPMENT"
        title="Clear property development from land to completion"
        subtitle="Understand the site, follow construction progress and make better-informed development decisions."
        highlightedWord="development"
      />

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid gap-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: MapPinned,
                title: "Land and site assessment",
                desc: "Review location, access, documentation and development suitability before work begins.",
              },
              {
                icon: Ruler,
                title: "Development planning",
                desc: "Organize project requirements, milestones and professional input around a clear plan.",
              },
              {
                icon: HardHat,
                title: "Construction progress",
                desc: "Follow visible site progress and key development stages from groundwork to completion.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-strong rounded-3xl p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-glow)] mb-5">
                  <item.icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-strong rounded-3xl p-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold">Owner and project collaboration</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Keep owners, consultants and project teams aligned with clear information and shared documents.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Project milestone and progress updates</li>
                <li>• Development document organization</li>
                <li>• Clear communication across project teams</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Development visibility</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Follow active projects, review progress and understand the next development priorities.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Site-level views for each development</li>
                <li>• Construction milestone tracking</li>
                <li>• Documentation and review reminders</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">WHY IT MATTERS</div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {[
                { title: "Plan clearly", detail: "Understand the site and development requirements before committing." },
                { title: "Protect value", detail: "Make informed choices throughout each stage of development." },
                { title: "Track progress", detail: "Keep project information and milestones visible in one place." },
              ].map((card) => (
                <div key={card.title} className="rounded-3xl bg-slate-950/80 p-6">
                  <div className="font-semibold text-lg">{card.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
