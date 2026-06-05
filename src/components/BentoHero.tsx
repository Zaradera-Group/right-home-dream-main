import { Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-property.jpg";
import logoUrl from "@/assets/Logo.png";
import prop1 from "@/assets/property-1.jpg";
import prop2 from "@/assets/property-2.jpg";
import prop3 from "@/assets/property-3.jpg";
import prop4 from "@/assets/property-4.jpg";
import {
  Search, Sparkles, ShieldCheck, Boxes, Eye, TrendingUp, Link2,
  ArrowUpRight, MapPin, Activity, BarChart3, Play,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export function BentoHero() {
  return (
    <section className="pt-28 pb-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-12 grid-rows-[auto_auto] gap-4 md:gap-5">
        {/* HERO — top-left large */}
        <div className="col-span-12 lg:col-span-8 row-span-1 relative overflow-hidden rounded-3xl glass-strong p-8 md:p-12 min-h-[560px] flex flex-col justify-between">
          <img src={heroImg} alt="Luxury Nigerian real estate at twilight" className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#060243] via-[#060243]/70 to-transparent" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <img src={logoUrl} alt="RIGHTHOME logo" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-[0.28em] uppercase text-primary">RIGHTHOME</div>
                <p className="text-xs text-muted-foreground">AI · Blockchain · IoT property platform</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Powered by AI · Blockchain · IoT
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] max-w-3xl">
              Seamless, Secure, <span className="text-gradient-primary">Smart</span> Property Transactions
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
              Africa's most intelligent proptech platform — discover, verify and own property with confidence, from anywhere.
            </p>
          </div>

          <div className="relative space-y-5">
            {/* AI Smart Search */}
            <div className="glass-strong rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2">
              <div className="flex items-center gap-2 px-3 flex-1">
                <Search className="w-4 h-4 text-primary" />
                <input
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground py-3"
                  placeholder="Try ‘3BR duplex in Igwurutali under ₦80M’"
                />
                <Sparkles className="w-4 h-4 text-primary/70" />
              </div>
              <div className="flex gap-1 text-xs">
                {["Buy","Rent","Invest","Workspace"].map(t => (
                  <button key={t} className="px-3 py-2 rounded-xl hover:bg-white/10 transition text-muted-foreground hover:text-foreground">{t}</button>
                ))}
              </div>
              <Link to="/properties" className="rounded-xl bg-[var(--gradient-primary)] px-6 py-3 text-sm font-semibold shadow-[var(--shadow-glow)] hover:scale-[1.02] transition inline-flex items-center justify-center">
                Search
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/properties" className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-6 py-3 text-sm font-semibold shadow-[var(--shadow-glow)] hover:scale-105 transition">
                Explore Properties <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold hover:bg-white/10 transition">
                <Play className="w-4 h-4" /> List Your Property
              </Link>
            </div>
          </div>
        </div>

        {/* QUICK ACCESS — top-right */}
        <div id="services" className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-4 md:gap-5 content-stretch">
          {[
            { icon: Sparkles, label: "AI Property Match", sub: "Personalized for you" },
            { icon: Eye, label: "Virtual Tours", sub: "360° + VR ready" },
            { icon: TrendingUp, label: "Smart Investments", sub: "ROI forecasts" },
            { icon: ShieldCheck, label: "Verified Listings", sub: "Title-checked" },
            { icon: Link2, label: "Blockchain Txns", sub: "On-chain ledger" },
            { icon: Boxes, label: "Property Mgmt", sub: "IoT + dashboards" },
          ].map(({ icon: Icon, label, sub }) => (
            <Link
              key={label}
              to="/services"
              className="glass-strong rounded-2xl p-4 text-left group hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center mb-3 shadow-[var(--shadow-glow)] group-hover:scale-110 transition">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
            </Link>
          ))}
        </div>

        {/* ANALYTICS — bottom-left wide */}
        <div id="insights" className="col-span-12 lg:col-span-7 glass-strong rounded-3xl p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="text-xs text-primary font-mono tracking-wider">MARKET INSIGHTS</div>
              <h3 className="text-2xl md:text-3xl font-display font-semibold mt-1">Live property intelligence</h3>
            </div>
            <div className="text-xs glass px-3 py-1.5 rounded-full flex items-center gap-2">
              <Activity className="w-3 h-3 text-success" /> Live
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Chart */}
            <div className="md:col-span-3 glass rounded-2xl p-5 h-64 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-muted-foreground">Avg. price / sqm — Port Harcourt</span>
                <span className="text-success font-mono">+12.4%</span>
              </div>
              <MiniChart />
            </div>
            {/* KPIs */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-1 gap-3">
                <Kpi label="Active Listings" value="3,284" delta="+8%" />
                <Kpi label="Verified Owners" value="1,156" delta="+22%" />
                <Kpi label="Avg. ROI / yr" value="18.3%" delta="+1.2pp" />
            </div>
          </div>
        </div>

        {/* FEATURED PROPERTIES — bottom-right */}
        <div id="properties" className="col-span-12 lg:col-span-5 glass-strong rounded-3xl p-6 md:p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs text-primary font-mono tracking-wider">FEATURED</div>
              <h3 className="text-xl font-display font-semibold mt-1">Premium properties</h3>
            </div>
            <Link to="/properties" className="text-xs text-muted-foreground hover:text-primary transition inline-flex items-center gap-1">View all <ArrowUpRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { img: prop1, price: "₦125M", loc: "Igwurutali", roi: "21%" },
              { img: prop2, price: "₦68M", loc: "Omagwa", roi: "17%" },
              { img: prop3, price: "₦240K/mo", loc: "GRA Phase II", roi: "Lease" },
              { img: prop4, price: "₦42M", loc: "Omagwa Plots", roi: "Land" },
            ].map((p, i) => (
              <Link key={i} to="/properties" className="group relative rounded-2xl overflow-hidden glass hover:scale-[1.03] transition-all duration-300 cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.loc} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                </div>
                <div className="absolute top-2 left-2 glass-strong rounded-full px-2 py-1 text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-success" /> Verified
                </div>
                <div className="absolute bottom-2 right-2 glass-strong rounded-full px-2 py-1 text-[10px] text-primary font-semibold">
                  ROI {p.roi}
                </div>
                <div className="p-3">
                  <div className="font-semibold text-sm">{p.price}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {p.loc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Kpi({ label, value, delta }: { label: string; value: string; delta: string }) {
  const numericMatch = String(value).replace(/,/g, "").match(/-?\d+\.?\d*/);
  const numeric = numericMatch ? Number(numericMatch[0]) : null;
  const suffix = String(value).trim().endsWith("%") ? "%" : undefined;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-display font-semibold mt-1">
        {numeric !== null ? (
          <AnimatedNumber value={numeric} suffix={suffix} />
        ) : (
          value
        )}
      </div>
      <div className="text-[11px] text-success mt-0.5 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {delta}</div>
    </div>
  );
}

function MiniChart() {
  const pts = [20, 35, 28, 50, 45, 62, 58, 78, 70, 92, 88, 105];
  const data = pts.map((v, i) => ({ label: `${i + 1}`, value: v }));
  const config = { value: { label: "Value", color: "#F24C21" } };

  return (
    <ChartContainer config={config} className="h-[180px] w-full">
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="var(--color-value)" fillOpacity={0.22} strokeWidth={3} isAnimationActive={true} animationDuration={1200} />
      </AreaChart>
    </ChartContainer>
  );
}
