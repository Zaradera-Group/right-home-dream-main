import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { NigeriaMap } from "@/components/NigeriaMap";
import { PageHeader, PageShell } from "@/components/PageShell";
import { propertyListings, type PropertyCategory } from "@/lib/property-listings";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Properties, RightHome Proptech" },
      {
        name: "description",
        content:
          "Browse verified properties at Igwuruta Ali School Road and Omagwa Station.",
      },
      { property: "og:title", content: "RightHome Proptech Properties" },
      { property: "og:description", content: "Verified listings with title-backed details." },
    ],
  }),
  component: Properties,
});

const filters: Array<{ key: "all" | PropertyCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "buy", label: "Buy" },
  { key: "invest", label: "Invest" },
  { key: "rent", label: "Rent" },
  { key: "workspace", label: "Workspace" },
  { key: "land", label: "Land" },
];

function Properties() {
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]["key"]>("all");

  const filteredProperties = useMemo(() => {
    if (activeFilter === "all") return propertyListings;
    return propertyListings.filter((property) => property.category === activeFilter);
  }, [activeFilter]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="LISTINGS"
        title="Verified properties, ready to view"
        subtitle="Every listing includes a dedicated details page, so buyers can explore the essentials without clutter."
        highlightedWord="Verified"
      />

      <section className="px-4 pb-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 rounded-2xl bg-white/5 p-3 glass-strong">
          {filters.map((filter) => {
            const active = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-xl px-4 py-2 text-sm transition ${active ? "bg-[var(--gradient-primary)] font-semibold text-primary-foreground shadow-[var(--shadow-glow)]" : "text-muted-foreground hover:bg-white/10 hover:text-foreground"}`}
              >
                {filter.label}
              </button>
            );
          })}
          <div className="ml-auto pr-3 text-xs text-muted-foreground">
            {filteredProperties.length} results
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProperties.map((property, index) => (
            <Link
              key={property.slug}
              to="/properties/$slug"
              params={{ slug: property.slug }}
              style={{ transitionDelay: `${index * 50}ms` }}
              className="group rounded-2xl transition-transform duration-300 hover:-translate-y-1"
            >
              <article
                role="link"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const anchor = (e.currentTarget.closest("a") as HTMLAnchorElement | null);
                    anchor?.click();
                  }
                }}
                className="glass-strong hover-accent overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.img}
                    alt={property.loc}
                    loading="lazy"
                    decoding="async"
                    className="media-polished h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute left-3 top-3 rounded-full glass-strong px-2.5 py-1 text-[11px] flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-success" /> Verified
                  </div>
                  <div className="absolute right-3 top-3 rounded-full glass-strong px-2.5 py-1 text-[11px] font-semibold text-primary">
                    ROI {property.roi}
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-3 py-1.5 text-[11px] text-white/90 backdrop-blur-sm">
                    View details
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">{property.type}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-sm font-display font-semibold">
                        <MapPin className="h-3 w-3 text-primary" /> {property.loc}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-gradient-primary">
                        {property.price}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {property.description}
                  </p>

                  <div className="mt-4 flex gap-4 border-t border-white/10 pt-4 text-xs text-muted-foreground">
                    {property.beds > 0 ? <span>{property.beds} beds</span> : null}
                    {property.baths > 0 ? <span>{property.baths} baths</span> : null}
                    <span>{property.area}</span>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:gap-3">
                    Open full listing
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <NigeriaMap />
    </PageShell>
  );
}
