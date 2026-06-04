import { Users, Key, TrendingUp, Building2, Briefcase } from "lucide-react";

const personas = [
  { icon: Users, title: "Buyers", desc: "Find verified homes with AI-matched listings and side-by-side comparisons.", features: ["AI matching", "Virtual tours", "Title checks"] },
  { icon: Key, title: "Renters", desc: "Lease faster with digital KYC, secure deposits, and in-app maintenance.", features: ["Digital lease", "Escrow", "Tenant chat"] },
  { icon: TrendingUp, title: "Investors", desc: "Predictive ROI heatmaps and fractional ownership for high-yield assets.", features: ["ROI forecast", "Fractional", "Heatmaps"] },
  { icon: Building2, title: "Developers", desc: "List, market, and sell new builds with built-in CRM and on-chain titles.", features: ["Project CRM", "Off-plan tools", "Smart contracts"] },
  { icon: Briefcase, title: "Corporates", desc: "Workspaces, staff housing and portfolio dashboards in one place.", features: ["Workspaces", "Portfolio", "Reports"] },
];

export function Personas() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs text-primary font-mono tracking-wider">FOR EVERYONE</div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mt-2 max-w-2xl">Tailored solutions for every player in property</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {personas.map((p) => (
            <div key={p.title} className="glass-strong rounded-2xl p-6 group hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)] mb-4">
                <p.icon className="w-5 h-5" />
              </div>
              <div className="font-display font-semibold text-lg">{p.title}</div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.features.map(f => (
                  <span key={f} className="text-[10px] glass rounded-full px-2 py-1 text-muted-foreground">{f}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
