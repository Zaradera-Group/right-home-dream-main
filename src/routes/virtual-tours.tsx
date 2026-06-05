import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Eye, Video, Play } from "lucide-react";

const featuredTours = [
  {
    title: "Abijo Luxury Villa",
    caption: "High-resolution photo tour with exterior and living space highlights.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "City Penthouse Video Tour",
    caption: "A guided walkthrough of a premium penthouse with city views.",
    video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Riverside Duplex Gallery",
    caption: "A curated image preview of architect-designed indoor and outdoor spaces.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
];

export const Route = createFileRoute("/virtual-tours")({
  head: () => ({
    meta: [
      { title: "Virtual Tours — RIGHTHOME" },
      {
        name: "description",
        content:
          "Explore properties remotely with immersive virtual tours, live walkthroughs, and 3D previews.",
      },
      { property: "og:title", content: "RIGHTHOME Virtual Tours" },
      {
        property: "og:description",
        content:
          "See homes in vivid detail from anywhere with 360°, VR-ready walkthroughs and interactive floor plans.",
      },
    ],
  }),
  component: VirtualToursPage,
});

function VirtualToursPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="VIRTUAL TOURS"
        title="Explore properties remotely with immersive walkthroughs"
        subtitle="View homes from anywhere in Africa using 360° tours, VR-ready previews and live guided walkthroughs."
      />

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto grid gap-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "360° Home Tours",
                desc: "Move through rooms, inspect finishes, and compare layouts with fully immersive property previews.",
              },
              {
                icon: Video,
                title: "Live Guided Walkthroughs",
                desc: "Schedule a hosted tour with an agent who can answer questions and show the property in real time.",
              },
              {
                icon: Play,
                title: "VR & Mobile Ready",
                desc: "Use any device—desktop, phone, or VR headset—to experience the property as if you were there.",
              },
            ].map((item) => (
              <div key={item.title} className="glass-strong rounded-3xl p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--gradient-primary)] text-white shadow-[var(--shadow-glow)] mb-5">
                  <item.icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-strong rounded-3xl p-10 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold">On-demand property previews</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Explore listings instantly without travel. Our virtual tours combine high-resolution
                imagery, rich floor plans, and embedded neighborhood data so you can make decisions
                faster.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Panoramic room views with quick jump points</li>
                <li>• Floor-plan overlays with room dimensions</li>
                <li>• Virtual staging to visualize furniture and finishes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Guided walkthroughs for remote buyers</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Book a live session with a local expert who walks the property on your behalf,
                highlights features, and answers your questions as you explore remotely.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Real-time commentary from listing agents</li>
                <li>• Instant chat, notes, and screenshot sharing</li>
                <li>• Seamless follow-up booking for in-person visits</li>
              </ul>
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-10">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">FEATURED TOURS</div>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {featuredTours.map((item) => (
                <div
                  key={item.title}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80"
                >
                  {item.video ? (
                    <video
                      controls
                      muted
                      playsInline
                      poster={item.poster}
                      className="h-64 w-full object-cover"
                    >
                      <source src={item.video} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <img src={item.image} alt={item.title} className="h-64 w-full object-cover" />
                  )}
                  <div className="p-5">
                    <div className="font-semibold text-lg">{item.title}</div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/5 text-lg font-bold text-primary mb-4">
                    {item.step}
                  </div>
                  <div className="font-semibold text-lg">{item.title}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
