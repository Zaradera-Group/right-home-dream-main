import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press, RightHome Proptech" },
      { name: "description", content: "Media and press information for RightHome Proptech." },
      { property: "og:title", content: "RightHome Proptech Press" },
      { property: "og:description", content: "Find the latest RightHome Proptech news and media contacts." },
    ],
  }),
  component: Press,
});

function Press() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="PRESS"
        title="RightHome Proptech in the news"
        subtitle="Get the latest announcements, media resources, and press contacts for our proptech platform."
        highlightedWord="news"
      />
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground">
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Media resources</h2>
            <p className="mt-4 leading-relaxed">Our team is available for interviews, company updates, and stories about property innovation in Africa.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Contact press</h2>
            <p className="mt-4 leading-relaxed">For media enquiries, please use the contact page and mention "Press" so we can respond faster.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
