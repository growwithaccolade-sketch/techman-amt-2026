import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "About" };

const fallback = {
  "slug": "about",
  "eyebrow": "ABOUT TECHMAN AMT",
  "title": "Buy the tech you need, not the confusion around it.",
  "intro": "TechMan AMT helps people compare, choose and buy useful technology with clear prices, useful details and direct support when the decision needs a human answer.",
  "sections": [
    {
      "title": "Clarity before checkout",
      "body": "A product page should answer the questions that matter: what it costs, what condition it is in, what it can do, what warranty applies and how to get help before paying."
    },
    {
      "title": "Built for real use cases",
      "body": "Students, creators, professionals, teams and everyday buyers use tech differently. The goal is to make it easier to match a device or setup to the work you actually need it to do."
    },
    {
      "title": "Sell with useful information",
      "body": "Clear product information, visible pricing and direct support should do more selling than noise. That is the standard TechMan AMT is built around."
    }
  ]
};

export default async function Page() {
  const page = await getEditablePage("about", fallback);
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
