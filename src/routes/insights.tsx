import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { SmartAlerts } from "@/components/SmartAlerts";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Activity, TrendingUp, BarChart3, DollarSign } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Market Insights — RIGHTHOME" },
      {
        name: "description",
        content:
          "Live property intelligence, AI-driven valuations, ROI heatmaps and market volatility for Nigerian real estate.",
      },
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
            { icon: TrendingUp, label: "PH Index", value: 12.4, suffix: "%", sub: "12-week" },
            { icon: DollarSign, label: "Avg ROI", value: 18.3, suffix: "%", sub: "All assets" },
            { icon: BarChart3, label: "Liquidity", value: "High", sub: "Tier 1 zones" },
            { icon: Activity, label: "Active deals", value: 342, sub: "This month" },
          ].map((k) => (
            <div key={k.label} className="glass-strong rounded-2xl p-5">
              <k.icon className="w-5 h-5 text-primary mb-3" />
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="text-2xl font-display font-bold mt-1">
                {typeof k.value === "number" ? (
                  <AnimatedNumber value={k.value} suffix={k.suffix} />
                ) : (
                  k.value
                )}
              </div>
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
                ].map((z) => (
                  <div key={z.z}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span>{z.z}</span>
                      <span className="text-primary font-mono">{z.v}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-[var(--gradient-primary)] ${getBarWidthClass(z.v)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-strong rounded-3xl p-5 border border-white/10">
              <div className="text-xs text-primary font-mono tracking-wider">RIGHTAI</div>
              <h3 className="text-xl font-display font-semibold mt-2">
                Ask RightAI about this chart
              </h3>
              <p className="text-sm text-muted-foreground mt-3">
                RightAI can interpret market data, identify high-ROI zones, and answer questions
                about price trends and property demand.
              </p>
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
  const data = [
    { week: "W1", value: 30 },
    { week: "W2", value: 42 },
    { week: "W3", value: 35 },
    { week: "W4", value: 58 },
    { week: "W5", value: 50 },
    { week: "W6", value: 68 },
    { week: "W7", value: 60 },
    { week: "W8", value: 82 },
    { week: "W9", value: 72 },
    { week: "W10", value: 95 },
    { week: "W11", value: 88 },
    { week: "W12", value: 110 },
    { week: "W13", value: 102 },
    { week: "W14", value: 125 },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="text-xs text-primary font-mono tracking-wider">VALUATION TREND</div>
          <h3 className="text-2xl font-display font-semibold mt-1">Avg. price / sqm</h3>
        </div>
        <div className="text-xs rounded-full border border-white/10 bg-white/5 px-3 py-2 text-success">
          Live market pulse
        </div>
      </div>
      <ChartContainer
        config={{ value: { label: "Price Index", color: "#F24C21" } }}
        className="h-[280px] w-full"
      >
        <LineChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="week" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--color-value)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
