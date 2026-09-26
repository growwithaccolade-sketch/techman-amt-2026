import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Request a Device", description: "Tell TechMan AMT what device or setup you need and share the details that matter." };

const fallback = {
  slug: "device-request",
  eyebrow: "NEED SOMETHING SPECIFIC?",
  title: "Tell us exactly what you want.",
  intro: "Share the model, specification, budget and timing. That gives the team enough information to check the right option instead of sending you a generic answer.",
  sections: [{ title: "The more specific you are, the more useful the answer.", body: "Include storage, colour, condition preference, budget and deadline where they matter." }],
};

export default async function DeviceRequestPage() {
  const page = await getEditablePage("device-request", fallback);
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></section><div className="leadLayout"><div className="leadPitch"><h2>{page.sections[0]?.title || fallback.sections[0].title}</h2><p>{page.sections[0]?.body || fallback.sections[0].body}</p></div><LeadForm type="device_request" submitLabel="Send my request" fields={[
    { name: "product", label: "Product or device name", required: true, placeholder: "Samsung Galaxy..." },
    { name: "specification", label: "Preferred specification", type: "textarea", placeholder: "Storage, RAM, colour, new or UK used..." },
    { name: "budget", label: "Budget in ₦", type: "number", placeholder: "Optional" },
    { name: "timeline", label: "When do you need it?", placeholder: "This week, this month..." }
  ]}/></div></main></>;
}
