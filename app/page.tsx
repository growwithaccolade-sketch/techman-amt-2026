import Storefront from "@/components/storefront";
import { getEditablePage } from "@/lib/site-pages";
import { getSiteMedia } from "@/lib/site-media";

const fallback = {
  slug: "home",
  eyebrow: "BUY WITH CLARITY",
  title: "The right tech.|The right price. No chasing.",
  intro: "Stop wasting time asking for prices or guessing which model fits. Compare trusted phones, laptops, audio and creator gear with visible pricing, key details and direct buying support.",
  sections: [
    { title: "Find the right product faster.", body: "Shop by the job the device needs to do, then compare the products that actually fit." },
    { title: "Do not stop at the main device.", body: "Add the charger, audio, storage and creator gear that makes your new device more useful from day one." },
    { title: "Compare what is worth your money.", body: "Use category filters and visible prices to narrow the choice without leaving the page." },
    { title: "Less back-and-forth. More certainty.", body: "You should not have to message three times just to know the price, condition or next step." },
    { title: "Make your content sound and look more expensive.", body: "Upgrade weak audio, poor lighting, shaky shots, low storage and unreliable power." },
    { title: "Spend with a reason, not just hype.", body: "Use practical buying guides before you commit to the next device or setup." },
    { title: "Before you pay, make sure it is the right device.", body: "Call 08103483669 or email techmanamt@gmail.com for a quick product recommendation, compatibility check, delivery question or order update." },
    { title: "Know what just landed before everyone else does.", body: "Get new arrivals, useful price updates, selected offers and buying guides without daily spam." }
  ]
};

export default async function Home() {
  const [stored, siteMedia] = await Promise.all([getEditablePage("home", fallback), getSiteMedia()]);
  const isLegacyCopy =
    stored.title === "Technology,|properly selected." ||
    stored.title === "Buy better tech.|Without the guesswork." ||
    stored.intro.startsWith("Current phones, laptops, audio and creator tools") ||
    stored.intro.startsWith("Shop phones, laptops, audio and creator gear selected");
  const content = isLegacyCopy ? fallback : stored;
  return <Storefront homeContent={content} siteMedia={siteMedia}/>;
}
