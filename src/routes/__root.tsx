import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Zoombie Keep",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.jpg" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4 text-center">
        <h1 className="text-4xl font-black mb-4">
          404 - LOST IN THE GRAVEYARD
        </h1>
        <p className="text-zinc-400 mb-8">
          The route you're looking for has been claimed by the vampires.
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-purple-600 rounded-full font-bold hover:bg-purple-500 transition-colors"
        >
          Return to Safety
        </a>
      </div>
    );
  },
});

import { useEffect } from "react";
import { AudioUtils } from "../utils/audio";

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return () => {
      AudioUtils.cleanup();
    };
  }, []);

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
