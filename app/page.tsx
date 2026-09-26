import Storefront from "@/components/storefront";
import { getEditablePage } from "@/lib/site-pages";

const fallback = {
  slug: "home",
  eyebrow: "TECH THAT EARNS ITS PLACE",
  title: "Buy better tech.|Without the guesswork.",
  intro: "Shop phones, laptops, audio and creator gear selected for performance, value and everyday use. See the price, condition and key details before you commit.",
  sections: [
    { title: "Not sure what to buy? Ask before you spend.", body: "Call 08103483669 or email techmanamt@gmail.com for product, compatibility, delivery and order help." },
    { title: "Get the good stuff before it disappears.", body: "New arrivals, useful buying guides and selected offers, sent without the noise." }
  ]
};

export default async function Home() {
  const stored = await getEditablePage("home", fallback);
  const isLegacyCopy =
    stored.title === "Technology,|properly selected." ||
    stored.intro.startsWith("Current phones, laptops, audio and creator tools");
  const content = isLegacyCopy ? fallback : stored;
  return <Storefront homeContent={content}/>;
}
