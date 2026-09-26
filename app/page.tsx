import Storefront from "@/components/storefront";
import { getEditablePage } from "@/lib/site-pages";
import { getSiteMedia } from "@/lib/site-media";

const fallback = {
  slug: "home",
  eyebrow: "TECHMAN AMT",
  title: "Phones, laptops and creator gear.|Prices shown before you buy.",
  intro: "Compare prices, stock, condition and key specifications for phones, laptops, audio and creator equipment. Order online or contact us if you need help choosing.",
  sections: [
    { title: "Find the right product faster.", body: "Choose a category to narrow the catalogue." },
    { title: "Add the accessories you need.", body: "Choose chargers, storage, audio and other accessories that match your main device." },
    { title: "Popular products and current prices.", body: "Filter by category or search by product or brand." },
    { title: "What you can check before ordering.", body: "Product pages show price, stock, condition and key specifications before checkout." },
    { title: "Microphones, lighting, storage and camera accessories.", body: "Browse equipment for recording, streaming, video calls and mobile content production." },
    { title: "Product guides for common buying questions.", body: "Read guides about specifications, compatibility and product categories." },
    { title: "Need help choosing a product?", body: "Call 08103483669 or email techmanamt@gmail.com for product, compatibility, delivery and order questions." },
    { title: "Get stock and price updates.", body: "Receive new product, stock and price updates by email." }
  ]
};

export default async function Home() {
  const [stored, siteMedia] = await Promise.all([getEditablePage("home", fallback), getSiteMedia()]);
  const isLegacyCopy =
    stored.title === "Technology,|properly selected." ||
    stored.title === "Buy better tech.|Without the guesswork." ||
    stored.title === "The right tech.|The right price. No chasing." ||
    stored.intro.startsWith("Current phones, laptops, audio and creator tools") ||
    stored.intro.startsWith("Shop phones, laptops, audio and creator gear selected");
  const content = isLegacyCopy ? fallback : stored;
  return <Storefront homeContent={content} siteMedia={siteMedia}/>;
}
