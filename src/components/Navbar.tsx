import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import logoUrl from "@/assets/Logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/properties", label: "Properties" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/85 px-3 py-3 shadow-[0_12px_36px_rgba(0,0,0,0.2)] backdrop-blur-xl md:px-4 md:py-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-1 md:px-2">
        <Link
          to="/"
          className="flex items-center gap-3 whitespace-nowrap font-display font-bold text-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <img src={logoUrl} alt="RightHome Proptech logo" className="h-8 w-8 object-contain" />
          </div>
          <span>
            Right<span className="text-primary">Home</span> Proptech
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-7 text-sm">
          {links.slice(1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-muted-foreground hover:text-foreground transition"
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            className="rounded-xl border border-white/10 bg-white/10 p-2 text-foreground shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:bg-white/15 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>
      {open && (
        <div className="mx-auto mt-3 flex max-w-7xl flex-col gap-3 rounded-2xl border border-white/15 bg-background/95 p-4 text-sm shadow-[var(--shadow-card)] backdrop-blur-xl lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
