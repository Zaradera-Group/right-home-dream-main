import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — RIGHTHOME_PROPTECH" },
      { name: "description", content: "Terms of service for RIGHTHOME's proptech platform." },
      { property: "og:title", content: "RIGHTHOME Terms" },
      { property: "og:description", content: "Terms of service for RIGHTHOME." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="TERMS"
        title="Using RIGHTHOME responsibly"
        subtitle="These terms explain how to use our platform, secure your data, and stay informed while exploring property opportunities."
        highlightedWord="responsibly"
      />
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground">
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Platform use</h2>
            <p className="mt-4 leading-relaxed">RIGHTHOME is provided to help you find, verify, and manage property. By using the service, you agree to only submit accurate information and to respect the rights of other users.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Content and verification</h2>
            <p className="mt-4 leading-relaxed">We provide curated property listings, market analytics, and verified title data. RIGHTHOME is not a substitute for professional legal or financial advice, and users must complete their own due diligence.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-4 leading-relaxed">If you have questions about these terms, reach out via the contact page and our team will respond quickly.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
