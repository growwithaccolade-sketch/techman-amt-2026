import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Delivery", description: "See how TechMan AMT handles delivery, dispatch and order tracking across Nigeria." };

const fallback = {
  slug: "delivery",
  eyebrow: "DELIVERY WITHOUT THE GUESSWORK",
  title: "Know how your order gets to you.",
  intro: "Delivery should not become a surprise after checkout. Your destination, product and available courier determine the final delivery option and timing.",
  sections: [
    {
      title: "Delivery across Nigeria",
      body: "TechMan AMT supports nationwide delivery. The available courier, fee and estimated delivery window are confirmed for the order before dispatch."
    },
    {
      title: "Local delivery or pickup",
      body: "Where local delivery or pickup is available, the team will confirm the practical option for your location and order."
    },
    {
      title: "Track the order",
      body: "Orders created through online checkout receive a reference you can use on the Track Order page with the same checkout email address."
    },
    {
      title: "High-value order checks",
      body: "For some high-value purchases, payment and contact details may be verified before the device leaves fulfilment. This helps reduce failed or misdirected deliveries."
    }
  ]
};

export default async function Page() {
  const stored = await getEditablePage("delivery", fallback);
  const page = stored.title === "Know the delivery plan before payment." ? fallback : stored;
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
