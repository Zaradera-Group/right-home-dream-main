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
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="glass-strong mx-auto max-w-7xl rounded-2xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-display font-bold text-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <img src={logoUrl} alt="RIGHTHOME logo" className="h-8 w-8 object-contain" />
          </div>
          <span>
            RIGHT<span className="text-primary">HOME</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm">
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
            className="md:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>
      {open && (
        <div className="md:hidden glass-strong mt-2 mx-auto max-w-7xl rounded-2xl p-4 flex flex-col gap-3 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
