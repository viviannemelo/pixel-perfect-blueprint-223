import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portfolio & Blog — Preview" },
      { name: "description", content: "Preview of a static portfolio and blog for GitHub Pages." },
      { property: "og:title", content: "Portfolio & Blog — Preview" },
      { property: "og:description", content: "Preview of a static portfolio and blog for GitHub Pages." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/portfolio/index.html"
      title="Portfolio preview"
      className="block h-screen w-full border-0"
    />
  );
}
