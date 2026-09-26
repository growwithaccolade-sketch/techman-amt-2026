import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = { title: "Request a Device", description: "Tell TechMan AMT what device or setup you need and share the details that matter." };

export default function DeviceRequestPage() {
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">NEED SOMETHING SPECIFIC?</span><h1>Tell us exactly what you want.</h1><p>Share the model, specification, budget and timing. That gives the team enough information to check the right option instead of sending you a generic answer.</p></section><div className="leadLayout"><div className="leadPitch"><h2>The more specific you are, the more useful the answer.</h2><p>Include storage, colour, condition preference, budget and deadline where they matter.</p></div><LeadForm type="device_request" submitLabel="Send my request" fields={[
    { name: "product", label: "Product or device name", required: true, placeholder: "Samsung Galaxy..." },
    { name: "specification", label: "Preferred specification", type: "textarea", placeholder: "Storage, RAM, colour, new or UK used..." },
    { name: "budget", label: "Budget in ₦", type: "number", placeholder: "Optional" },
    { name: "timeline", label: "When do you need it?", placeholder: "This week, this month..." }
  ]}/></div></main></>;
}
