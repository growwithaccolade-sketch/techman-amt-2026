import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Warranty", description: "Understand the warranty attached to your TechMan AMT product before you buy." };

const fallback = {
  slug: "warranty",
  eyebrow: "WARRANTY YOU CAN CHECK",
  title: "Know the cover before checkout.",
  intro: "Warranty terms differ by product. Check the warranty shown on the product page or sales confirmation so you know who provides the cover and for how long.",
  sections: [
    {
      title: "Who provides the warranty?",
      body: "Coverage may come from TechMan AMT, a distributor or the manufacturer depending on the item. The responsible provider and duration should be clear on the order."
    },
    {
      title: "What is usually covered?",
      body: "Warranty generally applies to qualifying manufacturing or functional faults. Accidental damage, liquid damage, misuse and unauthorised repairs are commonly excluded unless a separate protection plan states otherwise."
    },
    {
      title: "Need to make a claim?",
      body: "Keep your order reference, proof of purchase and device identifiers. Support may request diagnostics, photos or an inspection so the issue can be assessed properly."
    }
  ]
};

export default async function Page() {
  const stored = await getEditablePage("warranty", fallback);
  const page = stored.title === "Know what is covered before you buy." ? fallback : stored;
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
