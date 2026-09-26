import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = { title: "Corporate & Bulk Orders", description: "Request a practical TechMan AMT quote for team, school, agency or business technology purchases." };

export default function CorporatePage() {
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">BULK & CORPORATE</span><h1>Buying for a team? Make one request instead of twenty.</h1><p>Share the products, quantity, budget and deadline once. TechMan AMT can use those details to prepare options around the actual purchase you need to make.</p></section><div className="leadLayout"><div className="leadPitch"><h2>Give procurement the information it needs.</h2><p>For companies, schools, agencies, creator teams and organisations buying multiple devices, accessories or complete setups.</p></div><LeadForm type="corporate_quote" submitLabel="Request my bulk quote" fields={[
    { name: "organization", label: "Organisation name", required: true },
    { name: "products", label: "Products required", type: "textarea", required: true, placeholder: "e.g. 20 laptops, 20 mice, 10 power banks" },
    { name: "quantity", label: "Estimated total quantity", type: "number", required: true },
    { name: "budget", label: "Budget in ₦", type: "number" },
    { name: "timeline", label: "Required timeline", placeholder: "e.g. within 2 weeks" },
    { name: "notes", label: "Other requirements", type: "textarea", placeholder: "Delivery location, preferred brands, warranty needs..." }
  ]}/></div></main></>;
}
