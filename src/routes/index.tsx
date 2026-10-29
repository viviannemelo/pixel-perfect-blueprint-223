import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vivianne Melo — QA Engineer & AI SDET" },
      { name: "description", content: "I build solutions to improve quality assurance for products and processes." },
      { property: "og:title", content: "Vivianne Melo — QA Engineer & AI SDET" },
      { property: "og:description", content: "I build solutions to improve quality assurance for products and processes." },
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
