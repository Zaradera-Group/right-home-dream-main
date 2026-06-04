import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Navbar } from "./Navbar";
import { CtaFooter } from "./CtaFooter";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen">
      <Navbar />
      {children}
      <CtaFooter />
      <Link
        to="/chat"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:-translate-y-0.5 transition-transform"
      >
        <MessageCircle className="w-4 h-4" />
        Ask RightAI
      </Link>
    </main>
  );
}

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="pt-36 pb-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="text-xs text-primary font-mono tracking-wider">{eyebrow}</div>
        <h1 className="text-4xl md:text-6xl font-display font-bold mt-3 max-w-3xl mx-auto leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-muted-foreground mt-5 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
