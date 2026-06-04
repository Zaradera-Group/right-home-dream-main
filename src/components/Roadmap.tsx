import { Rocket, Brain, Home, Globe } from "lucide-react";

const steps = [
  { q: "Q1 2026", icon: Rocket, title: "Platform Launch", desc: "Listings, virtual tours, verified titles." },
  { q: "Q3 2026", icon: Brain, title: "AI Valuation Engine", desc: "ML-driven pricing and ROI forecasts." },
  { q: "Q1 2027", icon: Home, title: "Smart Home Services", desc: "IoT bundle for tenants & landlords." },
  { q: "Q3 2027", icon: Globe, title: "Pan-African Expansion", desc: "Ghana, Kenya, Rwanda partnerships." },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs text-primary font-mono tracking-wider">GROWTH OUTLOOK</div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-2">The road ahead</h2>
        </div>
        <div className="relative">
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent hidden md:block" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.q} className="glass-strong rounded-2xl p-6 relative hover:-translate-y-1 transition">
                <div className="absolute -top-3 left-6 text-[10px] font-mono bg-[var(--gradient-primary)] px-2 py-1 rounded-full">{s.q}</div>
                <div className="w-12 h-12 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center mt-2 mb-4 shadow-[var(--shadow-glow)]">
                  <s.icon className="w-5 h-5" />
                </div>
                <div className="font-display font-semibold">{s.title}</div>
                <div className="text-xs text-muted-foreground mt-2">{s.desc}</div>
                <div className="text-xs text-primary/60 font-mono mt-3">0{i+1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
