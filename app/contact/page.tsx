import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import { getStoreSettings } from "@/lib/store-settings";
import { makeWhatsappUrl } from "@/lib/site";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Contact", description: "Talk to TechMan AMT before or after your tech purchase." };

const fallback = {
  slug: "contact",
  eyebrow: "BUY WITH A SECOND OPINION",
  title: "One quick question can save you from the wrong purchase.",
  intro: "Comparing two devices? Unsure about compatibility, delivery or an order? Call, WhatsApp or email TechMan AMT before you commit.",
  sections: [
    { title: "Call or WhatsApp 08103483669", body: "Get fast help choosing a product, checking compatibility, confirming delivery or asking about an order." },
    { title: "Email techmanamt@gmail.com", body: "Send product, order, bulk purchase or business enquiries and keep the details in one thread." },
    { title: "Already ordered?", body: "Use your order reference and checkout email to check the latest recorded status." }
  ]
};

export default async function ContactPage() {
  const [settings, stored] = await Promise.all([getStoreSettings(), getEditablePage("contact", fallback)]);
  const isLegacyCopy = stored.title === "Talk to us." || stored.intro.startsWith("Questions about stock, compatibility");
  const page = isLegacyCopy ? fallback : stored;
  const wa = makeWhatsappUrl(settings.whatsappNumber, "Hello TechMan AMT, I need help choosing or ordering a product.");
  const whatsapp = page.sections[0] || fallback.sections[0];
  const email = page.sections[1] || fallback.sections[1];
  const tracking = page.sections[2] || fallback.sections[2];

  return <><CommerceHeader/><main className="infoPage shell contactPage">
    <section className="infoHero contactHero"><span className="kicker">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p><small className="contactLocation">{settings.locationLabel}</small></section>
    <div className="contactCards">
      <article><span className="kicker">PHONE + WHATSAPP</span><h2>{whatsapp.title}</h2><p>{settings.whatsappNumber}</p><div className="contactCardActions"><a className="primaryBtn" href={`tel:${settings.whatsappNumber}`}>Call now</a>{wa && <a className="secondaryAction" href={wa} target="_blank" rel="noreferrer">Open WhatsApp</a>}</div></article>
      <article><span className="kicker">EMAIL</span><h2>{email.title}</h2><p>{settings.supportEmail}</p><a className="secondaryAction" href={`mailto:${settings.supportEmail}`}>Send email</a></article>
      <article><span className="kicker">ORDER HELP</span><h2>{tracking.title}</h2><p>{tracking.body}</p><a className="secondaryAction" href="/track-order">Track order</a></article>
    </div>
  </main></>;
}
