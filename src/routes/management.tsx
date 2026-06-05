import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Wrench, ShieldCheck, CalendarDays, Building2 } from "lucide-react";

export const Route = createFileRoute("/management")({
  head: () => ({
    meta: [
      { title: "Management — RIGHTHOME" },
      {
        name: "description",
        content: "Manage properties with smart operations, tenant workflows, and IoT monitoring for safer ownership.",
      },
      { property: "og:title", content: "RIGHTHOME Property Management" },
      {
        property: "og:description",
        content: "Simplify maintenance, leases, and asset management with intelligent property operations tools.",
      },
    ],
  }),
  component: ManagementPage,
});

function ManagementPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="MANAGEMENT"
        title="Smart property operations for owners and managers"
        subtitle="Keep assets running smoothly with maintenance workflows, tenant support, and connected building intelligence." 
      />

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid gap-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Wrench,
                title: "Maintenance workflows",
                desc: "Track repairs, schedule vendors, and approve work with transparent status updates.",
              },
              {
                icon: CalendarDays,
                title: "Lease and rent management",
                desc: "Manage contracts, rent schedules, and digital payments all in one dashboard.",
              },
              {
                icon: Building2,
                title: "IoT property monitoring",
                desc: "Stay on top of utilities, security, and asset health with live sensor data.",
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
              <h3 className="text-2xl font-semibold">Tenant and owner collaboration</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Communicate with renters, receive maintenance requests, and share documents in one secure place.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Automated tenant notifications and repair updates</li>
                <li>• Digital lease signing and document storage</li>
                <li>• Transparent billing for services and utilities</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Operational visibility</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Monitor portfolios, track occupancy, and benchmark expenses so your assets perform at scale.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Asset-level dashboards for every building</li>
                <li>• Maintenance spend and vendor performance analytics</li>
                <li>• Alerts for lease expiries and compliance reviews</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">WHY IT MATTERS</div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {[
                { title: "Reduce downtime", detail: "Keep units rented and repairs resolved faster." },
                { title: "Protect value", detail: "Preserve property condition with proactive monitoring." },
                { title: "Streamline operations", detail: "Centralize tasks for owners, managers, and service teams." },
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
