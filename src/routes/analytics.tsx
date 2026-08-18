import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Sparkles, ShieldCheck, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — RIGHTHOME_PROPTECH" },
      {
        name: "description",
        content:
          "Unlock data-driven property insights, market forecasts, and investment analytics for smarter decisions.",
      },
      { property: "og:title", content: "RIGHTHOME Analytics" },
      {
        property: "og:description",
        content:
          "Use property trends, ROI forecasting, and neighborhood analytics to choose the best investments.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="ANALYTICS"
        title="Data-powered insights for smarter property investments"
        subtitle="Monitor market trends, compare neighborhoods, and forecast returns with RIGHTHOME analytics."
        highlightedWord="smarter"
      />

      <section className="px-4 pb-10">
        <div className="max-w-7xl mx-auto min-w-0 glass-strong rounded-3xl p-5 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Market pulse",
                value: 18,
                prefix: "+",
                suffix: "%",
                desc: "Real-time pricing momentum for top markets across the region.",
              },
              {
                title: "Portfolio readiness",
                value: 92,
                suffix: "%",
                desc: "Percentage of assets tracked with lease, rent, and valuation analytics.",
              },
              {
                title: "Verified insights",
                value: 100,
                suffix: "%",
                desc: "Built from authenticated title, survey, and transaction data.",
              },
            ].map((item) => (
              <div key={item.title} className="min-w-0 rounded-2xl border border-white/10 p-5 sm:rounded-3xl sm:p-8">
                <div className="text-4xl font-display font-bold text-gradient-primary">
                  <AnimatedNumber value={item.value} prefix={item.prefix} suffix={item.suffix} />
                </div>
                <div className="mt-4 font-semibold text-lg">{item.title}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14">
        <div className="max-w-7xl mx-auto grid gap-8">
          <div className="min-w-0 glass-strong rounded-3xl p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs text-primary font-mono tracking-wider">VALUATION TREND</div>
                <h2 className="mt-3 text-3xl font-display font-semibold">
                  Live price momentum across the portfolio
                </h2>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  See active valuation movement, demand pressure, and monthly price pulse in one
                  live analytics view.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-muted-foreground">
                Hover each chart to explore pricing insight
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 sm:rounded-3xl sm:p-6">
                <ValuationTrendChart />
              </div>
              <div className="grid gap-6">
                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 sm:rounded-3xl sm:p-6">
                  <div className="text-xs text-primary font-mono tracking-wider">
                    DEMAND PROFILE
                  </div>
                  <div className="mt-5 h-[240px]">
                    <DemandBarChart />
                  </div>
                </div>
                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 sm:rounded-3xl sm:p-6">
                  <div className="text-xs text-primary font-mono tracking-wider">
                    SALES VELOCITY
                  </div>
                  <div className="mt-5 h-[240px]">
                    <VelocityAreaChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid gap-10">
          <div className="glass-strong rounded-3xl p-5 sm:p-8 lg:p-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: "Market Trends",
                desc: "Track pricing, demand, and valuation shifts across cities and neighborhoods.",
              },
              {
                icon: TrendingUp,
                title: "ROI Forecasts",
                desc: "Predict rental and resale performance using AI-driven investment scoring.",
              },
              {
                icon: ShieldCheck,
                title: "Verified Data",
                desc: "View analytics backed by verified title, survey and on-chain property records.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 p-5 sm:rounded-3xl sm:p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-glow)] mb-5">
                  <item.icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-strong rounded-3xl p-5 sm:p-8 lg:p-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold">Neighborhood intelligence</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Compare detailed area reports with commute metrics, local amenities, school quality,
                and pricing momentum.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Heatmaps for price growth and investment demand</li>
                <li>• Commuting, schools, and lifestyle scorecards</li>
                <li>• Historical and forward-looking trend comparisons</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Portfolio performance</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Keep track of your assets with dashboards for occupancy, rental yield, and long-term
                value projections.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Rental yield and cashflow projections</li>
                <li>• Risk analysis and diversification insights</li>
                <li>• Alerts for market shifts and price changes</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8 lg:p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">WHAT YOU CAN DO</div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {[
                {
                  title: "Compare investments",
                  detail: "Side-by-side metrics for competing listings and neighborhoods.",
                },
                {
                  title: "Analyze cashflow",
                  detail: "Estimate rental income, expenses, and net returns before you buy.",
                },
                {
                  title: "Spot opportunities",
                  detail: "Find high-growth areas and undervalued properties faster.",
                },
              ].map((card) => (
                <div key={card.title} className="rounded-3xl bg-slate-950/80 p-6">
                  <div className="font-semibold text-lg">{card.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {card.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ValuationTrendChart() {
  const data = [
    { month: "Jan", value: 78 },
    { month: "Feb", value: 86 },
    { month: "Mar", value: 92 },
    { month: "Apr", value: 89 },
    { month: "May", value: 97 },
    { month: "Jun", value: 104 },
    { month: "Jul", value: 112 },
    { month: "Aug", value: 120 },
    { month: "Sep", value: 128 },
  ];

  return (
    <>
      <div className="flex flex-col items-start gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.3em] text-primary">Average price / sqm</div>
          <div className="text-2xl font-semibold">₦128,000</div>
        </div>
        <div className="text-xs rounded-full border border-white/10 bg-white/5 px-3 py-2 text-success">
          +12.4% vs last month
        </div>
      </div>
      <ChartContainer
        config={{ value: { label: "Price Index", color: "#F24C21" } }}
        className="h-[260px] min-w-0 w-full sm:h-[320px]"
      >
        <LineChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
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
    </>
  );
}

function DemandBarChart() {
  const data = [
    { label: "GRA", value: 32 },
    { label: "Trans-Amadi", value: 28 },
    { label: "Omagwa", value: 24 },
    { label: "Rumuokoro", value: 20 },
    { label: "Eliozu", value: 17 },
  ];

  return (
    <ChartContainer
      config={{ value: { label: "Demand Score", color: "#4F46E5" } }}
      className="h-full w-full"
    >
      <BarChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

function VelocityAreaChart() {
  const data = [
    { label: "Week 1", value: 55 },
    { label: "Week 2", value: 64 },
    { label: "Week 3", value: 72 },
    { label: "Week 4", value: 81 },
    { label: "Week 5", value: 93 },
  ];

  return (
    <ChartContainer
      config={{ value: { label: "Velocity", color: "#10B981" } }}
      className="h-full w-full"
    >
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          fill="var(--color-value)"
          fillOpacity={0.18}
        />
      </AreaChart>
    </ChartContainer>
  );
}
