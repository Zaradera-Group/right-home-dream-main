import { Navbar } from "./Navbar";
import { CtaFooter } from "./CtaFooter";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen overflow-x-clip">
      <Navbar />
      {children}
      <CtaFooter />
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  highlightedWord,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  highlightedWord?: string;
}) {
  const renderTitle = () => {
    if (!highlightedWord || !title.includes(highlightedWord)) {
      return title;
    }

    const parts = title.split(new RegExp(`\\b(${highlightedWord})\\b`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlightedWord.toLowerCase() ? (
        <span key={index} className="text-gradient-primary">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section className="px-4 pt-28 pb-12 md:pt-36">
      <div className="mx-auto max-w-7xl text-center">
        <div className="text-xs text-[#F24C21] font-mono tracking-wider">{eyebrow}</div>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
          {renderTitle()}
        </h1>
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
