import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { SmartAlerts } from "@/components/SmartAlerts";
import { Activity, TrendingUp, BarChart3, DollarSign } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Market Insights — RIGHTHOME" },
      { name: "description", content: "Live property intelligence, AI-driven valuations, ROI heatmaps and market volatility for Nigerian real estate." },
      { property: "og:title", content: "RIGHTHOME Market Insights" },
      { property: "og:description", content: "Predictive analytics for property investors." },
    ],
  }),
  component: Insights,
});

function getBarWidthClass(value: number) {
  if (value >= 20) return "w-[84%]";
  if (value >= 18) return "w-[72%]";
  if (value >= 14) return "w-[56%]";
  if (value >= 12) return "w-[48%]";
  if (value >= 9) return "w-[36%]";
  return "w-[24%]";
}

function Insights() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="MARKET INTELLIGENCE"
        title="Data that moves before the market does"
        subtitle="Live indicators, AI valuations and risk signals across every active corridor we track."
      />

      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: "PH Index", value: "+12.4%", sub: "12-week" },
            { icon: DollarSign, label: "Avg ROI", value: "18.3%", sub: "All assets" },
            { icon: BarChart3, label: "Liquidity", value: "High", sub: "Tier 1 zones" },
            { icon: Activity, label: "Active deals", value: "342", sub: "This month" },
          ].map(k => (
            <div key={k.label} className="glass-strong rounded-2xl p-5">
              <k.icon className="w-5 h-5 text-primary mb-3" />
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="text-2xl font-display font-bold mt-1">{k.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{k.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass-strong rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-primary font-mono tracking-wider">VALUATION TREND</div>
                <h3 className="text-2xl font-display font-semibold mt-1">Avg. price / sqm</h3>
              </div>
              <div className="text-xs glass px-3 py-1.5 rounded-full text-success">+12.4%</div>
            </div>
            <BigChart />
          </div>

          <div className="glass-strong rounded-3xl p-6 space-y-6">
            <div>
              <div className="text-xs text-primary font-mono tracking-wider">ROI HEATMAP</div>
              <h3 className="text-xl font-display font-semibold mt-1 mb-5">By zone</h3>
              <div className="space-y-3">
                {[
                  { z: "Igwurutali", v: 21 },
                  { z: "Omagwa", v: 18 },
                  { z: "GRA Phase II", v: 14 },
                  { z: "Trans-Amadi", v: 19 },
                  { z: "Eliozu", v: 12 },
                  { z: "Rumuokoro", v: 9 },
                ].map(z => (
                  <div key={z.z}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span>{z.z}</span><span className="text-primary font-mono">{z.v}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full rounded-full bg-[var(--gradient-primary)] ${getBarWidthClass(z.v)}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-strong rounded-3xl p-5 border border-white/10">
              <div className="text-xs text-primary font-mono tracking-wider">RIGHTAI</div>
              <h3 className="text-xl font-display font-semibold mt-2">Ask RightAI about this chart</h3>
              <p className="text-sm text-muted-foreground mt-3">RightAI can interpret market data, identify high-ROI zones, and answer questions about price trends and property demand.</p>
              <Link
                to="/chat"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-105 transition"
              >
                Chat with RightAI
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SmartAlerts />
    </PageShell>
  );
}

function BigChart() {
  const pts = [30, 42, 35, 58, 50, 68, 60, 82, 72, 95, 88, 110, 102, 125];
  const max = 140, w = 100, h = 100;
  const step = w / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(2)} ${(h - (v / max) * h).toFixed(2)}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-[280px]">
      <defs>
        <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#F24C21" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F24C21" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20,40,60,80].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />)}
      <path d={area} fill="url(#bg)" />
      <path d={path} fill="none" stroke="#F24C21" strokeWidth="1" />
      {pts.map((v, i) => (
        <circle key={i} cx={i * step} cy={h - (v / max) * h} r="0.6" fill="#fff" />
      ))}
    </svg>
  );
}
