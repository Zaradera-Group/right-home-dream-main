import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — RIGHTHOME" },
      { name: "description", content: "Explore career opportunities at RIGHTHOME." },
      { property: "og:title", content: "RIGHTHOME Careers" },
      { property: "og:description", content: "Join the RIGHTHOME team and help build Africa's smartest proptech platform." },
    ],
  }),
  component: Careers,
});

function Careers() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="CAREERS"
        title="Grow with RIGHTHOME"
        subtitle="We are hiring builders, operators, and product thinkers for property, AI, blockchain, and real estate experiences." 
      />
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground">
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">What we look for</h2>
            <p className="mt-4 leading-relaxed">Curiosity, ownership, and a passion for making property easier to buy, sell, and manage in Africa.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Open roles</h2>
            <p className="mt-4 leading-relaxed">We often hire for product, engineering, trust, operations, and customer success roles. Reach out through the contact page to inquire.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
