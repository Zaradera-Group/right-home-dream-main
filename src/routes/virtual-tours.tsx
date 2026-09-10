import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, MapPin, MessageCircle, Play, Video } from "lucide-react";

import { PageHeader, PageShell } from "@/components/PageShell";
import propertyOne from "@/assets/property-1.jpg";
import propertyTwo from "@/assets/property-2.jpg";
import propertyThree from "@/assets/property-3.jpg";
import developmentVideo from "@/assets/development-walkthrough.mp4";

type TourItem = {
  title: string;
  caption: string;
  image?: string;
  video?: string;
  poster?: string;
  kind: "image" | "video";
  details: string;
  location: string;
  status: string;
};

const featuredTours: TourItem[] = [
  {
    title: "Igwuruta Ali School Road Property",
    caption: "A polished property preview with exterior and living-space highlights.",
    image: propertyOne,
    kind: "image",
    details:
      "A gallery-style look at the property's design, key spaces and surrounding environment.",
    location: "Igwuruta Ali School Road",
    status: "Photo tour",
  },
  {
    title: "Development Video Walkthrough",
    caption: "A real on-site walkthrough showing the current stage of construction.",
    video: developmentVideo,
    poster: propertyTwo,
    kind: "video",
    details:
      "A full-screen progress walkthrough showing the drainage route, boundary works, and active site conditions.",
    location: "Omagwa Station",
    status: "Site video",
  },
  {
    title: "Omagwa Station Property",
    caption: "A curated property preview featuring indoor and outdoor spaces.",
    image: propertyThree,
    kind: "image",
    details:
      "A gallery-style preview of the property, including shared spaces and the surrounding environment.",
    location: "Omagwa Station",
    status: "Image gallery",
  },
];

export const Route = createFileRoute("/virtual-tours")({
  head: () => ({
    meta: [
      { title: "Virtual Tours, RightHome Proptech" },
      {
        name: "description",
        content:
          "Explore properties remotely with immersive virtual tours, live walkthroughs, and 3D previews.",
      },
      { property: "og:title", content: "RightHome Proptech Virtual Tours" },
      {
        property: "og:description",
        content:
          "See homes in vivid detail from anywhere with 360-degree walkthroughs and interactive floor plans.",
      },
    ],
  }),
  component: VirtualToursPage,
});

function VirtualToursPage() {
  const [selectedTour, setSelectedTour] = useState<TourItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

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
        closeTourDrawer();
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
      document.body.style.overflow = "";
    };
  }, []);

  const openTourDrawer = (tour: TourItem) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSelectedTour(tour);
    setDrawerOpen(true);
  };

  const closeTourDrawer = () => {
    setDrawerOpen(false);

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setSelectedTour(null);
      closeTimerRef.current = null;
    }, 320);
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="VIRTUAL TOURS"
        title="Explore properties remotely with immersive walkthroughs"
        subtitle="View homes from anywhere in Africa using 360-degree tours, VR-ready previews and live guided walkthroughs."
        highlightedWord="immersive"
      />

      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-7xl gap-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "360-degree Home Tours",
                desc: "Move through rooms, inspect finishes, and compare layouts with fully immersive property previews.",
              },
              {
                icon: Video,
                title: "Live Guided Walkthroughs",
                desc: "Schedule a hosted tour with an agent who can answer questions and show the property in real time.",
              },
              {
                icon: Play,
                title: "VR and Mobile Ready",
                desc: "Use any device, desktop, phone or VR headset, to experience the property as if you were there.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-strong rounded-3xl p-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-glow)]">
                  <item.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-strong grid gap-6 rounded-3xl p-10 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold">On-demand property previews</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Explore listings instantly without travel. Our virtual tours combine high-resolution
                imagery, rich floor plans, and embedded neighborhood data so you can make decisions
                faster.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>- Panoramic room views with quick jump points</li>
                <li>- Floor-plan overlays with room dimensions</li>
                <li>- Virtual staging to visualize furniture and finishes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Guided walkthroughs for remote buyers</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Book a live session with a local expert who walks the property on your behalf,
                highlights features, and answers your questions as you explore remotely.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>- Real-time commentary from listing agents</li>
                <li>- Instant chat, notes, and screenshot sharing</li>
                <li>- Seamless follow-up booking for in-person visits</li>
              </ul>
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">FEATURED TOURS</div>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {featuredTours.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => openTourDrawer(item)}
                  className={`group rounded-2xl text-left hover:-translate-y-1 ${selectedTour?.title === item.title ? "ring-1 ring-primary/40 shadow-[0_24px_80px_rgba(242,76,33,0.18)]" : ""}`}
                >
                  <div className="glass-strong overflow-hidden rounded-2xl">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {item.kind === "video" ? (
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="media-polished h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="media-polished h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      <div className="absolute left-3 top-3 rounded-full glass-strong px-2.5 py-1 text-[11px] flex items-center gap-1">
                        <Video className="h-3 w-3 text-success" />
                        {item.status}
                      </div>
                      <div className="absolute right-3 top-3 rounded-full glass-strong px-2.5 py-1 text-[11px] font-semibold text-primary">
                        {item.kind === "video" ? "Video" : "Gallery"}
                      </div>
                      <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-3 py-1.5 text-[11px] text-white/90 backdrop-blur-sm">
                        Tap to expand
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {item.kind === "video" ? "Video walkthrough" : "Photo gallery"}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1 text-sm font-display font-semibold">
                            <MapPin className="h-3 w-3 text-primary" /> {item.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-lg font-bold text-gradient-primary">
                            {item.kind === "video" ? "Play" : "View"}
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {item.caption}
                      </p>
                      <div className="mt-4 flex gap-4 border-t border-white/10 pt-4 text-xs text-muted-foreground">
                        <span>{item.kind === "video" ? "Motion preview" : "Still preview"}</span>
                        <span>Open details</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">HOW IT WORKS</div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Select a listing",
                  details: "Choose the property you want to tour and open the virtual preview.",
                },
                {
                  step: "2",
                  title: "Explore remotely",
                  details:
                    "Walk every room, inspect finishes, and view the layout without leaving home.",
                },
                {
                  step: "3",
                  title: "Request follow-up",
                  details:
                    "Save favorites, ask questions, or book an in-person viewing when ready.",
                },
              ].map((item) => (
                <div key={item.step} className="rounded-3xl border border-white/10 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-white/5 text-lg font-bold text-primary">
                    {item.step}
                  </div>
                  <div className="text-lg font-semibold">{item.title}</div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {selectedTour ? (
        <div
          className={`fixed inset-0 z-[60] transition-opacity duration-300 ${drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          aria-hidden={!drawerOpen}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#020114]/70 backdrop-blur-xl"
            onClick={closeTourDrawer}
            aria-label="Close tour details"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedTour.title} tour details`}
            className={`absolute inset-0 flex h-full w-full flex-col overflow-y-auto bg-[#05031f]/95 text-foreground shadow-[0_30px_120px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#05031f]/90 backdrop-blur-2xl">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeTourDrawer}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                    aria-label="Close tour details"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.24em] text-primary">
                      Featured tour
                    </div>
                    <h3 className="text-lg font-display font-semibold md:text-xl">
                      {selectedTour.title}
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
                  {selectedTour.kind === "video" && selectedTour.video ? (
                    <video
                      controls
                      autoPlay
                      muted
                      playsInline
                      poster={selectedTour.poster}
                      className="media-polished h-[320px] w-full object-cover md:h-[460px]"
                    >
                      <source src={selectedTour.video} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <img
                      src={selectedTour.image}
                      alt={selectedTour.title}
                      className="media-polished h-[320px] w-full object-cover md:h-[460px]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#05031f] via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full glass-strong px-3 py-1.5 text-xs flex items-center gap-2">
                    <Video className="h-3.5 w-3.5 text-success" /> {selectedTour.status}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/70">
                        {selectedTour.kind === "video" ? "Video walkthrough" : "Photo gallery"}
                      </div>
                      <div className="text-3xl font-display font-bold text-white md:text-5xl">
                        {selectedTour.title}
                      </div>
                    </div>
                    <div className="rounded-full bg-black/40 px-4 py-2 text-sm backdrop-blur-md">
                      {selectedTour.location}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-primary">
                      About
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {selectedTour.caption}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-primary">
                      Tour notes
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {selectedTour.details}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:p-6">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Details</div>
                  <div className="mt-4 space-y-4">
                    <DetailRow label="Title" value={selectedTour.title} />
                    <DetailRow label="Location" value={selectedTour.location} />
                    <DetailRow
                      label="Format"
                      value={selectedTour.kind === "video" ? "Video" : "Image"}
                    />
                    <DetailRow label="Status" value={selectedTour.status} />
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
                      Chat with Rai
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
                    This full-screen drawer keeps the tour readable while staying on the page.
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
