import { AlertTriangle, FileCheck, ShieldCheck } from "lucide-react";

export function SmartAlerts() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="font-mono text-xs tracking-wider text-primary">RISK & TRUST</div>
          <h2 className="mt-2 text-3xl font-display font-bold md:text-4xl">
            Smart alerts, before you commit
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            We surface what brokers won't tell you - title status, market volatility and physical
            security checks.
          </p>
        </div>

        <div className="grid gap-4 lg:col-span-2 sm:grid-cols-3">
          <div className="glass-strong rounded-2xl p-5">
            <FileCheck className="mb-3 h-6 w-6 text-primary" />
            <div className="text-sm font-semibold">Title verification</div>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              {["C of O confirmed", "Survey lodged", "No encumbrance", "Family consent"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 text-success" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="glass-strong rounded-2xl p-5">
            <AlertTriangle className="mb-3 h-6 w-6 text-primary" />
            <div className="text-sm font-semibold">Market volatility</div>
            <Volatility />
            <div className="mt-2 text-xs text-muted-foreground">PH index, 12-week</div>
          </div>

          <div className="glass-strong rounded-2xl p-5">
            <ShieldCheck className="mb-3 h-6 w-6 text-primary" />
            <div className="text-sm font-semibold">Security score</div>
            <div className="mt-3 text-4xl font-display font-bold text-gradient-primary">A+</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Gated compound - 24/7 patrol - CCTV
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Volatility() {
  const bars = [40, 55, 38, 62, 48, 70, 52, 80, 65, 72, 60, 85];

  return (
    <div className="mt-3 flex h-16 items-end gap-1">
      {bars.map((bar, index) => (
        <div
          key={index}
          className="flex-1 rounded-t"
          style={{
            height: `${bar}%`,
            background: index === bars.length - 1 ? "#F24C21" : "rgba(242,76,33,0.35)",
          }}
        />
      ))}
    </div>
  );
}
