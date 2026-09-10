import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";

import { RightAIChartCard } from "@/components/RightAIChartCard";
import { apiUrl } from "@/lib/api-base";
import { PageHeader, PageShell } from "@/components/PageShell";
import type { RightAIChart, RightAIMessage } from "@/lib/rightai";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "RightAI Chat, RightHome Proptech" },
      {
        name: "description",
        content:
          "Chat with RightAI to ask questions about property listings, investment, verification, and market intelligence.",
      },
      { property: "og:title", content: "RightAI Chat" },
      { property: "og:description", content: "Talk to the RightHome Proptech AI concierge." },
    ],
  }),
  component: Chat,
});

type Message = RightAIMessage & {
  id: string;
  chart?: RightAIChart | null;
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi there, I'm RightAI. Ask me about verified listings at Igwuruta Ali School Road and Omagwa Station, property verification, or how to get started with RightHome Proptech.",
    chart: null,
  },
];

function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const sendMessage = async (question: string) => {
    if (!question.trim()) return;

    const trimmedQuestion = question.trim();
    const stamp = Date.now();
    const userMessage: Message = {
      id: `user-${stamp}`,
      role: "user",
      content: trimmedQuestion,
      chart: null,
    };
    const assistantMessageId = `assistant-${stamp}`;
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      chart: null,
    };
    const outgoingMessages = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content,
    }));

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/rightai/stream"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: outgoingMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("RightAI stream did not start");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          const lines = chunk.split("\n");
          const eventType = lines
            .find((line) => line.startsWith("event:"))
            ?.slice(6)
            .trim();
          const dataText = lines
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trim())
            .join("\n");

          if (!eventType || !dataText) {
            continue;
          }

          if (eventType === "message") {
            const payload = JSON.parse(dataText) as { delta?: string };
            if (typeof payload.delta === "string") {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantMessageId
                    ? { ...message, content: `${message.content}${payload.delta}` }
                    : message,
                ),
              );
            }
          }

          if (eventType === "chart") {
            const payload = JSON.parse(dataText) as RightAIChart;
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantMessageId ? { ...message, chart: payload } : message,
              ),
            );
          }

          if (eventType === "error") {
            const payload = JSON.parse(dataText) as { message?: string };
            throw new Error(payload.message || "RightAI stream failed");
          }
        }
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId && !message.content.trim()
            ? { ...message, content: "RightAI could not respond right now." }
            : message,
        ),
      );
    } catch (error) {
      console.error(error);
      const fallbackMessage =
        "RightAI is unavailable right now. Please contact hello@zaraderagroup.com for urgent help.";
      const errorMessage = error instanceof Error ? error.message : "";
      const displayMessage =
        errorMessage && !/stream did not start|fetch failed|failed to fetch/i.test(errorMessage)
          ? errorMessage
          : fallbackMessage;

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: displayMessage,
                chart: null,
              }
            : message,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(prompt);
  };

  const quickPrompts = [
    "Compare Igwuruta Ali School Road and Omagwa Station for investment.",
    "How do I verify a property title on RightHome Proptech?",
    "Show me affordable 3-bedroom homes under NGN 80M.",
    "Compare ROI for our two property locations with a chart.",
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="RIGHTAI CHAT"
        title="Talk to our AI property concierge"
        subtitle="Ask questions, get instant market insights, and discover the RightHome Proptech path for your next property decision."
        highlightedWord="AI"
      />

      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="glass-strong flex flex-col gap-6 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--gradient-primary)] p-3 text-primary-foreground shadow-[var(--shadow-glow)]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs tracking-wider text-primary font-mono">LIVE CHAT</div>
                <p className="text-sm text-muted-foreground">
                  RightAI now streams answers in real time and can generate charts for market
                  questions.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-background/80 p-4">
              <div className="flex h-full flex-col gap-4 overflow-y-auto pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-3xl p-4 ${message.role === "user" ? "self-end bg-white/10 text-foreground" : "self-start bg-white/5 text-muted-foreground"}`}
                  >
                    <div className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {message.role === "user" ? "You" : "RightAI"}
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {message.content || (loading && message.role === "assistant" ? "..." : "")}
                    </p>
                    {message.chart ? <RightAIChartCard chart={message.chart} /> : null}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="sr-only" htmlFor="rightai-prompt">
                Chat with Rai
              </label>
              <input
                id="rightai-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Ask about listings, pricing, ROI, or verification..."
                className="w-full rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="self-end rounded-full bg-[var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </form>
          </div>

          <aside className="glass-strong space-y-6 rounded-3xl p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.25em] text-primary">
              <Sparkles className="h-4 w-4" /> RightAI insights
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold">
                Connect your questions to market signals
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Ask for trends, comparisons, ROI, or pricing patterns and RightAI can add an
                illustrative chart to its answer.
              </p>
            </div>
            <div className="space-y-3">
              {quickPrompts.map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  disabled={loading}
                  onClick={() => sendMessage(promptText)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-foreground transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{promptText}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 animate-arrow-breathe text-primary" />
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
