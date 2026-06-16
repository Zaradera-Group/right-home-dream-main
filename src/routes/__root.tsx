import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";
import logoUrl from "../assets/Logo.png";

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
      { title: "RIGHTHOME — AI property, blockchain title security" },
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

  useEffect(() => {
    let raf: number | null = null;
    let timeoutId: number | null = null;

    raf = window.requestAnimationFrame(() => {
      timeoutId = window.setTimeout(() => {
        setShowSplash(false);
      }, 1400);
    });

    return () => {
      if (raf !== null) window.cancelAnimationFrame(raf);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen">
        <div
          className={`min-h-screen transition-[opacity,transform,filter] duration-700 ease-out ${
            showSplash ? "opacity-0 scale-[0.985] blur-sm" : "opacity-100 scale-100 blur-0"
          }`}
          aria-hidden={showSplash ? "true" : undefined}
        >
          <Outlet />
        </div>
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
