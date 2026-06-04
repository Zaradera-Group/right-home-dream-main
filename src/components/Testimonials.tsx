import { Quote, Play } from "lucide-react";

const items = [
  { name: "Amaka Eze", role: "Developer · Lagos", quote: "Closed 12 units in 3 weeks with blockchain-verified titles. Buyers trust the process." },
  { name: "Tunde Bakare", role: "Investor · Abuja", quote: "The ROI heatmap pointed me to Omagwa before everyone else. 22% in a year." },
  { name: "Chiamaka I.", role: "First-time buyer", quote: "Virtual tour to keys-in-hand in 18 days. I never visited until move-in day." },
];

export function Testimonials() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs text-primary font-mono tracking-wider">STORIES</div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mt-2">Built on real outcomes</h2>
          </div>
          <button className="glass-strong rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2 hover:bg-white/10 transition">
            <Play className="w-3 h-3" /> Watch all stories
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.name} className="glass-strong rounded-2xl p-6 hover:-translate-y-1 transition">
              <Quote className="w-6 h-6 text-primary mb-4" />
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center font-semibold text-sm">
                  {t.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
