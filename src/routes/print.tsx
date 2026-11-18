import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { slides } from "@/components/deck/registry";
import { SlideContext } from "@/components/deck/context";

export const Route = createFileRoute("/print")({
  head: () => ({
    meta: [
      { title: "PDF տարբերակ — Էներգաարդյունավետության նախագիծ" },
      { name: "description", content: "Պրեզենտացիայի բոլոր սլայդները՝ տպելու կամ PDF պահպանելու համար։" },
      { property: "og:title", content: "PDF տարբերակ — Էներգաարդյունավետության նախագիծ" },
      { property: "og:description", content: "Պրեզենտացիայի բոլոր սլայդները՝ տպելու կամ PDF պահպանելու համար։" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrintDeck,
});

function PrintDeck() {
  useEffect(() => {
    const t = setTimeout(() => {
      document.fonts?.ready.then(() => window.print());
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="bg-ink">
      {slides.map((s, i) => (
        <div key={s.id} className="print-page" style={{ width: 1920, height: 1080 }}>
          <SlideContext.Provider value={{ page: i + 1, total: slides.length, static: true }}>
            <s.Component />
          </SlideContext.Provider>
        </div>
      ))}
    </div>
  );
}
