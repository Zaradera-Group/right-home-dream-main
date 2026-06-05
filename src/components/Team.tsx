import { Instagram, Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Aisha Okonkwo",
    role: "Founder & CEO",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    bio: "Leading RIGHTHOME with a vision for secure, smart home ownership across Africa.",
    linkedin: "https://www.linkedin.com/in/aisha-okonkwo",
    instagram: "https://www.instagram.com/aisha.okonkwo",
  },
  {
    name: "Chinedu Abiola",
    role: "Chief Technology Officer",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    bio: "Building AI, blockchain, and IoT systems that make property transactions frictionless.",
    linkedin: "https://www.linkedin.com/in/chinedu-abiola",
    instagram: "https://www.instagram.com/chinedu.abiola",
  },
  {
    name: "Ifeoma Nwosu",
    role: "Head of Operations",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    bio: "Ensuring every listing, contract, and customer experience is handled with care and trust.",
    linkedin: "https://www.linkedin.com/in/ifeoma-nwosu",
    instagram: "https://www.instagram.com/ifeoma.nwosu",
  },
  {
    name: "David Mensah",
    role: "Growth & Partnerships Lead",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    bio: "Connecting property owners, investors and communities through data-driven growth.",
    linkedin: "https://www.linkedin.com/in/david-mensah",
    instagram: "https://www.instagram.com/david.mensah",
  },
];

export function Team() {
  return (
    <section className="px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <div className="h-72 overflow-hidden bg-muted">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div>
                  <div className="text-lg font-semibold">{member.name}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-primary/90 mt-2">{member.role}</div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-white/10"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-white/10"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
