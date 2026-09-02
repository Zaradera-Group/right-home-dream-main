import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { BentoHero } from "@/components/BentoHero";
import { AdvantageFlow } from "@/components/AdvantageFlow";
import { Personas } from "@/components/Personas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RightHome Proptech, Smart Property Transactions" },
      {
        name: "description",
        content:
          "Africa's intelligent proptech platform. Discover verified properties, virtual tours and smart property investment insights powered by AI and secured on blockchain.",
      },
      { property: "og:title", content: "RightHome Proptech, Smart Property Transactions" },
      {
        property: "og:description",
        content:
          "AI-powered property location, blockchain-verified titles and property development insight.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <BentoHero />
      <Personas />
      <AdvantageFlow />
    </PageShell>
  );
}
