import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MessageCircle, MapPin, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { PageShell } from "@/components/PageShell";
import { getPropertyBySlug } from "@/lib/property-listings";

export const Route = createFileRoute("/properties/$slug")({
  component: PropertyDetail,
});

function PropertyDetail() {
  const { slug } = Route.useParams();
  const property = getPropertyBySlug(slug);

  if (!property) {
    throw notFound();
  }

  return (
    <PageShell>
      <section className="px-4 pb-16 pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-[#f24c21]/12 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>
        </div>

        <div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[var(--shadow-card)]">
              <img
                src={property.img}
                alt={property.loc}
                className="h-[320px] w-full object-cover md:h-[520px]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05031f] via-transparent to-transparent" />
              <div className="absolute left-4 top-4 rounded-full glass-strong px-3 py-1.5 text-xs flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-success" /> Verified listing
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/70">
                    {property.type}
                  </div>
                  <div className="text-3xl font-display font-bold text-white md:text-5xl">
                    {property.price}
                  </div>
                </div>
                <div className="rounded-full bg-black/40 px-4 py-2 text-sm backdrop-blur-md">
                  ROI {property.roi}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Metric label="Bedrooms" value={property.beds > 0 ? `${property.beds}` : "N/A"} />
              <Metric label="Bathrooms" value={property.baths > 0 ? `${property.baths}` : "N/A"} />
              <Metric label="Area" value={property.area} />
              <Metric label="Status" value={property.status} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="About" tone="text-primary">
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{property.description}</p>
              </Panel>
              <Panel title="Highlights" tone="text-primary">
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Panel>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-6">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Location</div>
              <h1 className="mt-2 text-3xl font-display font-semibold md:text-4xl">{property.loc}</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {property.neighborhood}
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{property.landmark}</p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-6">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Key details</div>
              <div className="mt-4 space-y-4">
                <DetailRow label="Transit" value={property.transit} />
                <DetailRow label="Status" value={property.status} />
                <DetailRow label="Area" value={property.area} />
                <DetailRow label="ROI" value={property.roi} />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-6">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Next steps</div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.03]"
                >
                  Chat with Ria
                  <ArrowRight className="h-4 w-4 animate-arrow-breathe" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-[#f24c21]/12 hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  Request callback
                </Link>
              </div>
              <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                This page keeps the property details visible on both desktop and mobile for a cleaner
                review flow.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Panel({
  title,
  tone,
  children,
}: {
  title: string;
  tone: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <div className={`text-[10px] uppercase tracking-[0.22em] ${tone}`}>{title}</div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="max-w-[68%] text-sm leading-6 text-foreground/90">{value}</div>
    </div>
  );
}
