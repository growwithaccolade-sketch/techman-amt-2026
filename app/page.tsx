import Storefront from "@/components/storefront";
import { getEditablePage } from "@/lib/site-pages";
import { getSiteMedia } from "@/lib/site-media";

const fallback = {
  slug: "home",
  eyebrow: "TECHMAN AMT",
  title: "Phones, laptops and creator gear.|Choose by what you need it to do.",
  intro: "Compare current stock, condition, price and key features for school, work, content, gaming or a simple upgrade.",
  sections: [
    { title: "Find the right product faster.", body: "Choose a category to narrow the catalogue." },
    { title: "Add the accessories you need.", body: "Choose chargers, storage, audio and other accessories that match your main device." },
    { title: "Popular products and current prices.", body: "Filter by category or search by product or brand." },
    { title: "What you can check before ordering.", body: "Product pages show price, stock, condition and key specifications before checkout." },
    { title: "For video content, start with audio, lighting and power.", body: "For a talking-head video, a clear microphone and decent light can matter more than another camera upgrade. Add storage and power based on how long and how often you record." },
    { title: "Start with what you need the device to do.", body: "These short guides answer the questions people usually ask before spending money on a phone, laptop or microphone." },
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
    stored.title === "Phones, laptops and creator gear.|Prices shown before you buy." ||
    stored.title === "Need a new phone, laptop or creator gear?|Compare the options before you pay." ||
    stored.title === "Need a new phone, laptop or creator gear?|Find the option that fits what you actually need." ||
    stored.intro.startsWith("Current phones, laptops, audio and creator tools") ||
    stored.intro.startsWith("Shop phones, laptops, audio and creator gear selected") ||
    stored.intro.startsWith("Compare current options by price, stock, condition");
  const content = isLegacyCopy ? fallback : stored;
  return <Storefront homeContent={content} siteMedia={siteMedia}/>;
}
