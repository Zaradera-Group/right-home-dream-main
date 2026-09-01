import { Linkedin } from "lucide-react";
import wisdomPhoto from "@/assets/wisdom-ndubuisi.png";

const teamMembers = [
  {
    name: "Wisdom Chukwunonso Ndubuisi",
    role: "Founder & CEO",
    photo: wisdomPhoto,
    bio: "Leading RightHome Proptech's mission to make property ownership across Africa smarter, more secure, and more accessible.",
    linkedin:
      "https://www.linkedin.com/in/wisdom-chukwunonso-ndubuisi-mba-mnim-mcilrm-mcib-92a11487/",
  },
];

export function Team() {
  return (
    <section className="px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mx-auto grid max-w-sm grid-cols-1 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
              <div className="h-72 overflow-hidden bg-muted">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="media-polished h-full w-full object-cover transition duration-500 group-hover:scale-105"
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
