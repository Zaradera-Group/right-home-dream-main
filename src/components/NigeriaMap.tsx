import { MapPin, Layers } from "lucide-react";
import prop1 from "@/assets/property-1.jpg";
import prop4 from "@/assets/property-4.jpg";

export function NigeriaMap() {
  return (
    <section id="map" aria-label="Property area view" className="px-4 pb-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-strong rounded-3xl p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* stylised map */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden aspect-[16/10] glass">
            <svg viewBox="0 0 800 500" className="w-full h-full">
              <defs>
                <radialGradient id="rg" cx="60%" cy="60%" r="70%">
                  <stop offset="0%" stopColor="#F24C21" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#060243" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="800" height="500" fill="#0a0556" />
              <rect width="800" height="500" fill="url(#rg)" />
              {/* abstract Nigeria silhouette */}
              <path
                d="M120 180 L220 130 L360 110 L500 140 L600 180 L680 250 L660 340 L560 400 L420 420 L300 400 L200 360 L140 290 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
              />
              {/* grid lines */}
              {Array.from({ length: 16 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 50}
                  y1="0"
                  x2={i * 50}
                  y2="500"
                  stroke="rgba(255,255,255,0.04)"
                />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0"
                  y1={i * 50}
                  x2="800"
                  y2={i * 50}
                  stroke="rgba(255,255,255,0.04)"
                />
              ))}
              {/* pins */}
              <g>
                <circle cx="520" cy="320" r="6" fill="#F24C21" />
                <circle cx="520" cy="320" r="14" fill="#F24C21" opacity="0.25">
                  <animate attributeName="r" from="6" to="24" dur="2s" repeatCount="indefinite" />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <text x="535" y="318" fill="#fff" fontSize="12" fontFamily="Inter">
                  Igwuruta Ali School Road
                </text>
              </g>
              <g>
                <circle cx="470" cy="350" r="6" fill="#F24C21" />
                <circle cx="470" cy="350" r="14" fill="#F24C21" opacity="0.25">
                  <animate attributeName="r" from="6" to="24" dur="2.5s" repeatCount="indefinite" />
                  <animate
                    attributeName="opacity"
                    from="0.5"
                    to="0"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <text x="380" y="375" fill="#fff" fontSize="12" fontFamily="Inter">
                  Omagwa Station
                </text>
              </g>
            </svg>
            <div className="absolute top-3 right-3 glass-strong rounded-full px-3 py-1.5 text-xs flex items-center gap-2">
              <Layers className="w-3 h-3" /> Aerial view
            </div>
          </div>

          {/* location cards */}
          <div className="flex flex-col gap-4">
            {[
              {
                img: prop1,
                name: "Igwuruta Ali School Road",
                units: "24 plots",
                price: "from ₦18M",
              },
              { img: prop4, name: "Omagwa Station", units: "48 plots", price: "from ₦12M" },
            ].map((l) => (
              <div
                key={l.name}
                className="glass rounded-2xl overflow-hidden group hover:bg-white/10 transition cursor-pointer"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={l.img}
                    alt={l.name}
                    loading="lazy"
                    decoding="async"
                    className="media-polished w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-primary text-xs">
                    <MapPin className="w-3 h-3" /> Rivers State
                  </div>
                  <div className="font-display font-semibold mt-1">{l.name}</div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>{l.units}</span>
                    <span className="text-foreground font-semibold">{l.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
