import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — RIGHTHOME" },
      { name: "description", content: "Privacy policy for RIGHTHOME users." },
      { property: "og:title", content: "RIGHTHOME Privacy" },
      { property: "og:description", content: "How RIGHTHOME protects your personal data." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="PRIVACY"
        title="How we protect your data"
        subtitle="RIGHTHOME is committed to keeping your information safe, private, and secure while you explore property opportunities." 
      />
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground">
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Data collection</h2>
            <p className="mt-4 leading-relaxed">We collect only the information needed to personalize property recommendations, manage listings, and deliver better service.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Usage</h2>
            <p className="mt-4 leading-relaxed">Your data is used to improve recommendations, verify transactions, and power support interactions. We never sell personal data to third parties.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Security</h2>
            <p className="mt-4 leading-relaxed">Our platform uses strong encryption and modern safeguards to protect your account and property information.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
