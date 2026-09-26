import Storefront from "@/components/storefront";
import { getEditablePage } from "@/lib/site-pages";

const fallback = {
  slug: "home",
  eyebrow: "BUY WITH CLARITY",
  title: "The right tech.|The right price. No chasing.",
  intro: "Stop wasting time asking for prices or guessing which model fits. Compare trusted phones, laptops, audio and creator gear with visible pricing, key details and direct buying support.",
  sections: [
    { title: "Before you pay, make sure it is the right device.", body: "Call 08103483669 or email techmanamt@gmail.com for a quick product recommendation, compatibility check, delivery question or order update." },
    { title: "Know what just landed before everyone else does.", body: "Get new arrivals, useful price updates, selected offers and buying guides without daily spam." }
  ]
};

export default async function Home() {
  const stored = await getEditablePage("home", fallback);
  const isLegacyCopy =
    stored.title === "Technology,|properly selected." ||
    stored.title === "Buy better tech.|Without the guesswork." ||
    stored.intro.startsWith("Current phones, laptops, audio and creator tools") ||
    stored.intro.startsWith("Shop phones, laptops, audio and creator gear selected");
  const content = isLegacyCopy ? fallback : stored;
  return <Storefront homeContent={content}/>;
}
