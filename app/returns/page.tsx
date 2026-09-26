import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Returns", description: "Understand TechMan AMT return steps before and after your purchase." };

const fallback = {
  slug: "returns",
  eyebrow: "RETURNS, EXPLAINED CLEARLY",
  title: "If something is wrong, know what to do next.",
  intro: "Return eligibility depends on the item, its condition, packaging and the reason for the request. Keep the order details and contact support quickly when there is a problem.",
  sections: [
    {
      title: "Report an issue quickly",
      body: "If an item arrives damaged, materially different from the confirmed order or appears faulty, contact support with your order reference and clear photos or video where useful."
    },
    {
      title: "Keep the box and accessories",
      body: "Hold on to packaging, accessories, labels and proof of purchase while a return or warranty case is being reviewed. Missing items can affect the assessment."
    },
    {
      title: "Changed your mind?",
      body: "Non-fault returns depend on the specific product and its condition. Opened devices, activated software and hygiene-sensitive accessories can have extra restrictions, so check before opening or activating anything you may want to return."
    }
  ]
};

export default async function Page() {
  const stored = await getEditablePage("returns", fallback);
  const page = stored.title === "Clear return rules protect both sides." ? fallback : stored;
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
