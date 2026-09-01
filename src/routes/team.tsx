import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";
import { Team } from "@/components/Team";
import { Linkedin } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team, RightHome Proptech" },
      {
        name: "description",
        content: "Meet the person leading RightHome Proptech and connect on LinkedIn.",
      },
      { property: "og:title", content: "RightHome Proptech Team" },
      {
        property: "og:description",
        content: "Meet the leadership behind RightHome Proptech and reach out via LinkedIn.",
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
        title="Meet the person building smarter property experiences"
        subtitle="Connect with our leadership through LinkedIn for partnership, media, or product inquiries."
        highlightedWord="smarter"
      />

      <Team />

      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto glass-strong rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-display font-semibold">Contact the team</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed max-w-2xl">
              Reach RightHome Proptech through our professional networks for business, media, or partnership
              conversations.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/company/righthome-proptech/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white/10"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
