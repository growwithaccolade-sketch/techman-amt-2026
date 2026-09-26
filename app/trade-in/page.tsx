import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Trade In Your Device", description: "Tell TechMan AMT about your current device and request a trade-in assessment." };

const fallback = {
  slug: "trade-in",
  eyebrow: "TRADE IN",
  title: "Turn the device you have into value toward what comes next.",
  intro: "Share the exact model, storage and condition. The team can then assess the device with fewer follow-up questions. Final value may still require inspection.",
  sections: [{ title: "Give us the details that affect the value.", body: "Battery health, screen condition, repairs, storage and cosmetic wear can all matter. Accurate details make the first assessment more useful." }],
};

export default async function TradeInPage() {
  const page = await getEditablePage("trade-in", fallback);
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></section><div className="leadLayout"><div className="leadPitch"><h2>{page.sections[0]?.title || fallback.sections[0].title}</h2><p>{page.sections[0]?.body || fallback.sections[0].body}</p></div><LeadForm type="trade_in" submitLabel="Request my trade-in assessment" fields={[
    { name: "brand", label: "Brand", required: true, placeholder: "Apple, Samsung, Tecno..." },
    { name: "model", label: "Model", required: true, placeholder: "iPhone 14 Pro" },
    { name: "storage", label: "Storage", placeholder: "256GB" },
    { name: "condition", label: "Overall condition", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Damaged"] },
    { name: "screen", label: "Screen condition", type: "select", options: ["Clean", "Minor scratches", "Cracked", "Not working"] },
    { name: "battery", label: "Battery / performance notes", type: "textarea", placeholder: "Battery health, charging issues, repairs..." },
    { name: "expected_price", label: "Expected price in ₦", type: "number", placeholder: "Optional" }
  ]}/></div></main></>;
}
