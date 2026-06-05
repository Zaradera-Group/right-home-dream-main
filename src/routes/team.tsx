import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Team } from "@/components/Team";
import { Linkedin, Instagram } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — RIGHTHOME" },
      {
        name: "description",
        content: "Meet the RIGHTHOME team and connect with us on LinkedIn and Instagram.",
      },
      { property: "og:title", content: "RIGHTHOME Team" },
      {
        property: "og:description",
        content: "See the people behind RIGHTHOME and reach out via LinkedIn or Instagram.",
      },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="OUR TEAM"
        title="Meet the people building smarter property experiences"
        subtitle="Connect with our leadership and reach out through LinkedIn or Instagram for partnership, media, or product inquiries."
      />

      <Team />

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto glass-strong rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-display font-semibold">Contact the team</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
              Reach RIGHTHOME through our professional networks for business, media, or partnership
              conversations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://www.linkedin.com/company/righthome"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/righthome"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
