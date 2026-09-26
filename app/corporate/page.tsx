import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Corporate & Bulk Orders", description: "Request a practical TechMan AMT quote for team, school, agency or business technology purchases." };

const fallback = {
  slug: "corporate",
  eyebrow: "BULK & CORPORATE",
  title: "Buying for a team? Make one request instead of twenty.",
  intro: "Share the products, quantity, budget and deadline once. TechMan AMT can use those details to prepare options around the actual purchase you need to make.",
  sections: [{ title: "Give procurement the information it needs.", body: "For companies, schools, agencies, creator teams and organisations buying multiple devices, accessories or complete setups." }],
};

export default async function CorporatePage() {
  const page = await getEditablePage("corporate", fallback);
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></section><div className="leadLayout"><div className="leadPitch"><h2>{page.sections[0]?.title || fallback.sections[0].title}</h2><p>{page.sections[0]?.body || fallback.sections[0].body}</p></div><LeadForm type="corporate_quote" submitLabel="Request my bulk quote" fields={[
    { name: "organization", label: "Organisation name", required: true },
    { name: "products", label: "Products required", type: "textarea", required: true, placeholder: "e.g. 20 laptops, 20 mice, 10 power banks" },
    { name: "quantity", label: "Estimated total quantity", type: "number", required: true },
    { name: "budget", label: "Budget in ₦", type: "number" },
    { name: "timeline", label: "Required timeline", placeholder: "e.g. within 2 weeks" },
    { name: "notes", label: "Other requirements", type: "textarea", placeholder: "Delivery location, preferred brands, warranty needs..." }
  ]}/></div></main></>;
}
