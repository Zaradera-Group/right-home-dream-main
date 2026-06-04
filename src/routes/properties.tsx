import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

import { NigeriaMap } from "@/components/NigeriaMap";
import { PageHeader, PageShell } from "@/components/PageShell";
import prop1 from "@/assets/property-1.jpg";
import prop2 from "@/assets/property-2.jpg";
import prop3 from "@/assets/property-3.jpg";
import prop4 from "@/assets/property-4.jpg";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Properties - RIGHTHOME" },
      {
        name: "description",
        content:
          "Browse verified properties across Nigeria - Igwurutali, Omagwa and beyond. Homes, apartments, workspaces and plots.",
      },
      { property: "og:title", content: "RIGHTHOME Properties" },
      { property: "og:description", content: "Verified listings with on-chain titles." },
    ],
  }),
  component: Properties,
});

type Property = {
  img: string;
  price: string;
  loc: string;
  type: string;
  roi: string;
  category: "buy" | "invest" | "rent" | "workspace" | "land";
  beds: number;
  baths: number;
  area: string;
  landmark: string;
  neighborhood: string;
  description: string;
  highlights: string[];
  transit: string;
  status: string;
};

const properties: Property[] = [
  {
    img: prop1,
    price: "₦125M",
    loc: "Igwurutali Estate",
    type: "4BR Duplex",
    roi: "21%",
    category: "buy",
    beds: 4,
    baths: 5,
    area: "420 sqm",
    landmark: "Near major school cluster and fast-growing residential corridor",
    neighborhood: "Quiet family zone with premium access roads",
    description:
      "A spacious duplex with a modern layout, large living areas and a compound that works for family living or investor-grade rentals.",
    highlights: ["Title verified", "Secure gated access", "Balcony views", "Parking for 4 cars"],
    transit: "18 minutes to the airport axis and key arterial roads",
    status: "Available for inspection",
  },
  {
    img: prop2,
    price: "₦68M",
    loc: "Omagwa Heights",
    type: "3BR Apartment",
    roi: "17%",
    category: "buy",
    beds: 3,
    baths: 3,
    area: "180 sqm",
    landmark: "Close to the Omagwa commercial stretch and transport links",
    neighborhood: "High-demand area for short and long stay tenants",
    description:
      "A clean, efficient apartment with strong rental potential and a practical floor plan for young families and professionals.",
    highlights: ["Verified owner", "Low maintenance", "Strong rental demand", "Modern finishes"],
    transit: "12 minutes to the airport road corridor",
    status: "Viewing by appointment",
  },
  {
    img: prop3,
    price: "₦240K/mo",
    loc: "GRA Phase II",
    type: "Workspace",
    roi: "Lease",
    category: "workspace",
    beds: 0,
    baths: 4,
    area: "1200 sqft",
    landmark: "Along the business and administrative district axis",
    neighborhood: "Best for teams needing prestige, access and a professional setting",
    description:
      "A flexible workspace with a corporate feel, ideal for firms needing visibility, convenience and a central business location.",
    highlights: [
      "Corporate standard",
      "Meeting room ready",
      "High foot traffic",
      "Flexible lease terms",
    ],
    transit: "Easy access to central business routes",
    status: "Lease available",
  },
  {
    img: prop4,
    price: "₦42M",
    loc: "Omagwa Plots",
    type: "Land",
    roi: "Land",
    category: "land",
    beds: 0,
    baths: 0,
    area: "650 sqm",
    landmark: "Near active growth corridors and expansion zones",
    neighborhood: "Strong hold for long-term development or resale strategy",
    description:
      "A clean plot with excellent upside for developers or long-term investors looking for a strategic land bank.",
    highlights: [
      "Survey-ready",
      "Development potential",
      "Good road access",
      "Verified documentation",
    ],
    transit: "Close to expanding residential and commercial pockets",
    status: "Ready for offer",
  },
  {
    img: prop1,
    price: "₦95M",
    loc: "Trans-Amadi",
    type: "3BR Villa",
    roi: "19%",
    category: "invest",
    beds: 3,
    baths: 4,
    area: "320 sqm",
    landmark: "Business district with strong corporate demand",
    neighborhood: "Popular with executives and high-income tenants",
    description:
      "A premium villa with strong aesthetics, a well-balanced floor plan and great liveability for owners or premium tenants.",
    highlights: ["Executive finish", "Garden space", "Secure environment", "High rental appeal"],
    transit: "Well connected to commercial hubs and waterfront routes",
    status: "Inspection open",
  },
  {
    img: prop2,
    price: "₦52M",
    loc: "Eliozu",
    type: "2BR Flat",
    roi: "15%",
    category: "rent",
    beds: 2,
    baths: 2,
    area: "140 sqm",
    landmark: "Near established residential streets and market access",
    neighborhood: "Practical entry point for first-time buyers and investors",
    description:
      "A compact, affordable flat designed for ease of ownership, low upkeep and dependable tenant demand.",
    highlights: ["Affordable entry point", "Low service cost", "Easy access", "Verified listing"],
    transit: "Fast access to nearby transport routes",
    status: "Available now",
  },
  {
    img: prop3,
    price: "₦78M",
    loc: "Rumuola Crest",
    type: "4BR Terrace",
    roi: "18%",
    category: "buy",
    beds: 4,
    baths: 4,
    area: "260 sqm",
    landmark: "Near the busy Rumuola commercial spine",
    neighborhood: "Balanced for owners and premium tenants",
    description:
      "A modern terrace home with a practical footprint, premium finishes and strong appeal for buyers who want comfort and solid resale potential.",
    highlights: ["Secure compound", "Modern finish", "High resale appeal", "Family-friendly"],
    transit: "Good access to major city routes",
    status: "Available for inspection",
  },
  {
    img: prop4,
    price: "₦110M",
    loc: "Ada George Avenue",
    type: "5BR Maisonette",
    roi: "20%",
    category: "invest",
    beds: 5,
    baths: 5,
    area: "510 sqm",
    landmark: "Close to major arterial access and lifestyle amenities",
    neighborhood: "High-value corridor for long-term capital growth",
    description:
      "A larger maisonette with strong rental and resale potential in one of the city’s more active growth corridors.",
    highlights: ["Premium zone", "Large footprint", "Strong appreciation", "Investment-grade"],
    transit: "Easy access to major roads and central routes",
    status: "Viewing by appointment",
  },
  {
    img: prop1,
    price: "₦36M",
    loc: "Airport Road Axis",
    type: "Land",
    roi: "Land",
    category: "land",
    beds: 0,
    baths: 0,
    area: "500 sqm",
    landmark: "Near the airport corridor and expanding development pockets",
    neighborhood: "Great for land banking and future build plans",
    description:
      "A strategic plot for investors who want a lower entry point with long-term upside in a fast-evolving corridor.",
    highlights: ["Title verified", "Road access", "Future growth", "Plot ready"],
    transit: "Strong access to the airport corridor",
    status: "Ready for offer",
  },
  {
    img: prop2,
    price: "₦185K/mo",
    loc: "Mile 1 Extension",
    type: "2BR Flat",
    roi: "Lease",
    category: "rent",
    beds: 2,
    baths: 2,
    area: "130 sqm",
    landmark: "Popular access corridor with steady foot traffic",
    neighborhood: "Practical for professionals and small households",
    description:
      "An affordable rental unit with easy mobility, making it attractive to tenants who value convenience and lower upkeep.",
    highlights: ["Affordable rent", "High tenant demand", "Easy mobility", "Low upkeep"],
    transit: "Close to transport and daily essentials",
    status: "Available now",
  },
  {
    img: prop3,
    price: "₦310K/mo",
    loc: "Choba Business Hub",
    type: "Executive Office",
    roi: "Lease",
    category: "workspace",
    beds: 0,
    baths: 2,
    area: "980 sqft",
    landmark: "Close to the Choba business and university corridor",
    neighborhood: "Best for firms that need visibility and access",
    description:
      "A polished office space suitable for startups, agencies or service teams that want a professional base of operations.",
    highlights: ["Reception area", "Conference ready", "Professional setting", "Strong access"],
    transit: "Easy access to arterial roads and city links",
    status: "Lease available",
  },
];

function Properties() {
  const [selected, setSelected] = useState<Property>(properties[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const filterTimeoutRef = useRef<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "buy" | "invest" | "rent" | "workspace" | "land"
  >("all");
  const [cardPhase, setCardPhase] = useState<"idle" | "out" | "in">("idle");

  const featuredStats = useMemo(
    () => [
      { label: "Price", value: selected.price },
      { label: "Type", value: selected.type },
      { label: "ROI", value: selected.roi },
      { label: "Area", value: selected.area },
    ],
    [selected],
  );

  const filteredProperties = useMemo(() => {
    if (activeFilter === "all") {
      return properties;
    }

    return properties.filter((property) => property.category === activeFilter);
  }, [activeFilter]);

  const splitIndex = useMemo(
    () => Math.max(3, Math.ceil(filteredProperties.length / 2)),
    [filteredProperties.length],
  );
  const leftProperties = filteredProperties.slice(0, splitIndex);
  const rightProperties = filteredProperties.slice(splitIndex);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [drawerOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (filterTimeoutRef.current) {
        window.clearTimeout(filterTimeoutRef.current);
      }
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (cardPhase !== "in") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setCardPhase("idle");
    });

    return () => window.cancelAnimationFrame(frame);
  }, [cardPhase]);

  const openProperty = (property: Property) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelected(property);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
    }, 320);
  };

  const changeFilter = (filter: typeof activeFilter) => {
    if (filter === activeFilter) {
      return;
    }

    if (filterTimeoutRef.current) {
      window.clearTimeout(filterTimeoutRef.current);
    }

    setCardPhase("out");
    filterTimeoutRef.current = window.setTimeout(() => {
      setActiveFilter(filter);
      setCardPhase("in");
      filterTimeoutRef.current = null;
    }, 180);
  };

  const cardMotionClass = () => {
    const shared =
      "transition-all duration-500 ease-out transform-gpu will-change-[transform,opacity]";

    if (cardPhase === "out") {
      return `${shared} opacity-0 translate-y-6 scale-[0.98]`;
    }

    if (cardPhase === "in") {
      return `${shared} opacity-0 translate-y-5 scale-[0.98]`;
    }

    return `${shared} opacity-100 translate-y-0 scale-100`;
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="LISTINGS"
        title="Verified properties, ready to view"
        subtitle="Every listing comes with title verification, drone aerials and a virtual walk-through."
      />

      <section className="px-4 pb-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 rounded-2xl bg-white/5 p-3 glass-strong">
          {[
            { key: "all", label: "All" },
            { key: "buy", label: "Buy" },
            { key: "invest", label: "Invest" },
            { key: "rent", label: "Rent" },
            { key: "workspace", label: "Workspace" },
            { key: "land", label: "Land" },
          ].map((filter) => {
            const active = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => changeFilter(filter.key as typeof activeFilter)}
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
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {leftProperties.map((property, index) => {
              const active = selected.loc === property.loc;

              return (
                <button
                  key={property.loc}
                  type="button"
                  onClick={() => openProperty(property)}
                  style={{ transitionDelay: `${index * 60}ms` }}
                  className={`group rounded-2xl text-left hover:-translate-y-1 ${cardMotionClass()} ${active ? "ring-1 ring-primary/40 shadow-[0_24px_80px_rgba(242,76,33,0.18)]" : ""}`}
                >
                  <div className="glass-strong overflow-hidden rounded-2xl">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={property.img}
                        alt={property.loc}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute left-3 top-3 rounded-full glass-strong px-2.5 py-1 text-[11px] flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-success" /> Verified
                      </div>
                      <div className="absolute right-3 top-3 rounded-full glass-strong px-2.5 py-1 text-[11px] font-semibold text-primary">
                        ROI {property.roi}
                      </div>
                      <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-3 py-1.5 text-[11px] text-white/90 backdrop-blur-sm">
                        Tap to expand
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
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
                      <div className="mt-4 flex gap-4 border-t border-white/10 pt-4 text-xs text-muted-foreground">
                        {property.beds > 0 ? <span>{property.beds} beds</span> : null}
                        {property.baths > 0 ? <span>{property.baths} baths</span> : null}
                        <span>{property.area}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:block">
            {rightProperties.length > 0 ? (
              rightProperties.map((property, index) => {
                const active = selected.loc === property.loc;
                const motionIndex = leftProperties.length + index;

                return (
                  <button
                    key={property.loc}
                    type="button"
                    onClick={() => openProperty(property)}
                    style={{ transitionDelay: `${motionIndex * 60}ms` }}
                    className={`group rounded-2xl text-left hover:-translate-y-1 ${cardMotionClass()} ${active ? "ring-1 ring-primary/40 shadow-[0_24px_80px_rgba(242,76,33,0.18)]" : ""}`}
                  >
                    <div className="glass-strong overflow-hidden rounded-2xl lg:flex lg:h-full">
                      <div className="relative aspect-[4/3] overflow-hidden lg:h-full lg:w-[42%] lg:shrink-0 lg:aspect-auto">
                        <img
                          src={property.img}
                          alt={property.loc}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                        <div className="absolute left-3 top-3 rounded-full glass-strong px-2.5 py-1 text-[11px] flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-success" /> Verified
                        </div>
                      </div>
                      <div className="p-5 lg:flex lg:flex-1 lg:flex-col lg:justify-between">
                        <div className="flex items-start justify-between gap-2">
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
                        <div className="mt-4 flex gap-4 border-t border-white/10 pt-4 text-xs text-muted-foreground">
                          {property.beds > 0 ? <span>{property.beds} beds</span> : null}
                          {property.baths > 0 ? <span>{property.baths} baths</span> : null}
                          <span>{property.area}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-muted-foreground">
                No properties match this category right now.
              </div>
            )}
          </div>
        </div>
      </section>

      <NigeriaMap />

      {selected ? (
        <div
          className={`fixed inset-0 z-[60] transition-opacity duration-300 ${drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={!drawerOpen}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#020114]/70 backdrop-blur-xl"
            onClick={closeDrawer}
            aria-label="Close property details"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${selected.loc} property details`}
            className={`absolute inset-0 flex h-full w-full flex-col overflow-y-auto bg-[#05031f]/95 text-foreground shadow-[0_30px_120px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#05031f]/90 backdrop-blur-2xl">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                    aria-label="Close details"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.24em] text-primary">
                      Property details
                    </div>
                    <h3 className="text-lg font-display font-semibold md:text-xl">
                      {selected.loc}
                    </h3>
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="hidden rounded-full bg-[var(--gradient-primary)] px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.03] md:inline-flex"
                >
                  Request viewing
                </Link>
              </div>
            </div>

            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-8">
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10">
                  <img
                    src={selected.img}
                    alt={selected.loc}
                    className="h-[320px] w-full object-cover md:h-[460px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#05031f] via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full glass-strong px-3 py-1.5 text-xs flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" /> Verified listing
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/70">
                        {selected.type}
                      </div>
                      <div className="text-3xl font-display font-bold text-white md:text-5xl">
                        {selected.price}
                      </div>
                    </div>
                    <div className="rounded-full bg-black/40 px-4 py-2 text-sm backdrop-blur-md">
                      ROI {selected.roi}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {featuredStats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="mt-2 text-sm font-semibold">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-primary">
                      About
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {selected.description}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-primary">
                      Highlights
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.highlights.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs text-muted-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Details</div>
                  <div className="mt-4 space-y-4">
                    <DetailRow label="Location" value={selected.loc} />
                    <DetailRow label="Landmark" value={selected.landmark} />
                    <DetailRow label="Neighborhood" value={selected.neighborhood} />
                    <DetailRow label="Transit" value={selected.transit} />
                    <DetailRow label="Status" value={selected.status} />
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary">
                    Next steps
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to="/chat"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--gradient-primary)] px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-[1.03]"
                    >
                      Ask RightAI
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Request callback
                    </Link>
                  </div>
                  <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                    This full-screen drawer keeps the listing details readable while staying on the
                    page.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </PageShell>
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
