import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { BentoHero } from "@/components/BentoHero";
import { AdvantageFlow } from "@/components/AdvantageFlow";
import { Personas } from "@/components/Personas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RIGHTHOME — Smart Property Transactions, AI · Blockchain · IoT" },
      { name: "description", content: "Africa's intelligent proptech platform. Discover verified properties, virtual tours, and ROI forecasts powered by AI and secured on blockchain." },
      { property: "og:title", content: "RIGHTHOME — Smart Property Transactions" },
      { property: "og:description", content: "AI-matched listings, blockchain-verified titles, IoT-enabled smart homes." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <BentoHero />
      <AdvantageFlow />
      <Personas />
    </PageShell>
  );
}
