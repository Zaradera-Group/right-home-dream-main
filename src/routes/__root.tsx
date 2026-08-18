import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import appCss from "../styles.css?url";
import logoUrl from "../assets/logo_bg.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RIGHTHOME_PROPTECH - AI property, blockchain title security" },
      {
        name: "description",
        content:
          "RIGHTHOME is Africa's intelligent proptech platform for verified listings, investment insights, and smart ownership.",
      },
      { name: "author", content: "RIGHTHOME" },
      { property: "og:title", content: "RIGHTHOME" },
      {
        property: "og:description",
        content:
          "AI-powered property search, blockchain-secured titles, and verified Nigerian real estate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@RIGHTHOME" },
    ],
    links: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "64x64",
        href: logoUrl,
      },
      {
        rel: "apple-touch-icon",
        type: "image/png",
        sizes: "180x180",
        href: logoUrl,
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  // During SSR we must emit the full document (<html>/<head>/<body>),
  // but on the client we should only render the children to avoid
  // nesting <html> inside an existing container and causing hydration errors.
  if (typeof document === "undefined") {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <Scripts />
        </body>
      </html>
    );
  }

  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [showSplash, setShowSplash] = useState(true);
  const overflowRef = useRef<{ html: string; body: string } | null>(null);

  // Use an effect that reliably hides the splash on mount and always
  // restores html/body overflow on cleanup. Avoid requestAnimationFrame
  // to prevent the timeout being deferred in some desktop environments.
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    // Save previous overflow values so we can restore them.
    overflowRef.current = {
      html: root.style.overflow,
      body: body.style.overflow,
    };

    // Prevent scrolling while the splash is visible.
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const timeoutId = window.setTimeout(() => {
      setShowSplash(false);
    }, 1400);

    return () => {
      // Restore previous overflow values.
      if (overflowRef.current) {
        root.style.overflow = overflowRef.current.html || "";
        body.style.overflow = overflowRef.current.body || "";
        overflowRef.current = null;
      } else {
        root.style.overflow = "";
        body.style.overflow = "";
      }

      window.clearTimeout(timeoutId);
    };
    // Run only once on mount/unmount.
  }, []);

  // Ensure the splash is dismissed if the user interacts or navigates
  // before the timeout completes (prevents stuck overlay on some devices).
  useEffect(() => {
    const hide = () => {
      if (showSplash) setShowSplash(false);
      if (overflowRef.current) {
        document.documentElement.style.overflow = overflowRef.current.html || "";
        document.body.style.overflow = overflowRef.current.body || "";
        overflowRef.current = null;
      }
    };

    const onInteraction = () => hide();

    window.addEventListener("click", onInteraction, { once: true, capture: true });
    window.addEventListener("keydown", onInteraction, { once: true, capture: true });
    window.addEventListener("popstate", onInteraction);

    return () => {
      window.removeEventListener("click", onInteraction, { capture: true } as any);
      window.removeEventListener("keydown", onInteraction, { capture: true } as any);
      window.removeEventListener("popstate", onInteraction);
    };
  }, [showSplash]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        <div
          className={`min-h-screen transition-[opacity,transform,filter] duration-700 ease-out ${
            showSplash ? "opacity-0 scale-[0.985] blur-sm" : "opacity-100"
          }`}
          inert={showSplash ? true : undefined}
        >
          <Outlet />
        </div>
        <Link
          to="/chat"
          className="fixed right-4 top-1/2 z-40 inline-flex max-w-[calc(100vw-2rem)] -translate-y-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#060243]/90 px-3.5 py-3 text-xs font-semibold text-white shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-[calc(50%+2px)] hover:border-[#f24c21]/40 hover:bg-[#0d0a55]/95 hover:shadow-[0_0_0_1px_rgba(242,76,33,0.3),0_0_40px_rgba(242,76,33,0.25)] md:right-6 md:px-4 md:text-sm"
        >
          <MessageCircle className="h-4 w-4 text-primary" />
          Chat with Ria
        </Link>
        {showSplash ? <SplashScreen /> : null}
      </div>
    </QueryClientProvider>
  );
}

function SplashScreen() {
  return (
    <div className="splash-screen fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,76,33,0.22),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.1),transparent_24%),radial-gradient(circle_at_50%_85%,rgba(255,123,79,0.16),transparent_28%)]" />
      <div className="absolute inset-0 animate-splash-orbit bg-[radial-gradient(circle,rgba(242,76,33,0.18)_0,rgba(242,76,33,0.08)_14%,transparent_34%)] opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_46%,transparent_54%)] opacity-0 animate-splash-sheen" />
      <div className="relative space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_0_80px_rgba(242,76,33,0.35)] backdrop-blur-xl">
          <img src={logoUrl} alt="RIGHTHOME" className="h-14 w-14 animate-splash-logo" />
        </div>
        <div className="space-y-4">
          <div className="text-3xl font-semibold tracking-tight text-white">RIGHTHOME</div>
          <div className="mx-auto max-w-sm text-sm leading-relaxed text-white/70">
            Loading a faster, cleaner property experience.
          </div>
          <div className="relative mx-auto h-3 w-72 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
            <div className="absolute inset-y-0 left-0 w-1/2 animate-splash-progress rounded-full bg-gradient-to-r from-[#f24c21] via-[#ff7b4f] to-[#ffddb6]" />
          </div>
        </div>
      </div>
    </div>
  );
}
