import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageShell";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security, RightHome Proptech" },
      { name: "description", content: "RightHome Proptech security and platform protection information." },
      { property: "og:title", content: "RightHome Proptech Security" },
      { property: "og:description", content: "Security measures for RightHome Proptech users." },
    ],
  }),
  component: Security,
});

function Security() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="SECURITY"
        title="Secure property search and ownership"
        subtitle="RightHome Proptech combines encryption, verification, and monitoring so your transaction journey is safe from end to end."
        highlightedWord="Secure"
      />
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-8 text-sm text-muted-foreground">
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Encrypted access</h2>
            <p className="mt-4 leading-relaxed">All communications and account data are protected with strong encryption and secure session handling.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Blockchain verification</h2>
            <p className="mt-4 leading-relaxed">Property records and title data may be anchored on-chain to prevent tampering and ensure trust.</p>
          </div>
          <div className="glass-strong rounded-3xl p-8">
            <h2 className="text-xl font-semibold text-foreground">Responsible access</h2>
            <p className="mt-4 leading-relaxed">We limit access to sensitive systems and log activity to keep your assets safe while you explore listings.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
