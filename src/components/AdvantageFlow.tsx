import { Fragment } from "react";
import { Brain, Link2, Wifi, ArrowRight } from "lucide-react";

export function AdvantageFlow() {
  const nodes = [
    { icon: Brain, label: "AI", desc: "Predictive valuation & recommendations" },
    { icon: Link2, label: "Blockchain", desc: "Tamper-proof, on-chain transactions" },
    { icon: Wifi, label: "IoT", desc: "Live utilities, security & smart access" },
  ];
  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs text-primary font-mono tracking-wider">COMPETITIVE EDGE</div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mt-2">
            The intelligence layer for real estate
          </h2>
        </div>

        <div className="glass-strong rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-6">
            {nodes.map((n, i) => (
              <Fragment key={n.label}>
                <div className="md:col-span-1 group">
                  <div className="glass rounded-2xl p-6 transition text-center hover:-translate-y-1 hover:bg-[#f24c21]/12 duration-300">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)] mb-4">
                      <n.icon className="w-6 h-6" />
                    </div>
                    <div className="text-lg font-display font-semibold">{n.label}</div>
                    <div className="text-xs text-muted-foreground mt-2">{n.desc}</div>
                  </div>
                </div>
                {i < nodes.length - 1 && (
                  <div className="hidden justify-center text-primary/60 md:flex">
                    <ArrowRight className="h-6 w-6 animate-arrow-breathe text-primary" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
