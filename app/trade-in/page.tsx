import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = { title: "Trade In Your Device", description: "Tell TechMan AMT about your current device and request a trade-in assessment." };

export default function TradeInPage() {
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">TRADE IN</span><h1>Turn the device you have into value toward what comes next.</h1><p>Share the exact model, storage and condition. The team can then assess the device with fewer follow-up questions. Final value may still require inspection.</p></section><div className="leadLayout"><div className="leadPitch"><h2>Give us the details that affect the value.</h2><p>Battery health, screen condition, repairs, storage and cosmetic wear can all matter. Accurate details make the first assessment more useful.</p></div><LeadForm type="trade_in" submitLabel="Request my trade-in assessment" fields={[
    { name: "brand", label: "Brand", required: true, placeholder: "Apple, Samsung, Tecno..." },
    { name: "model", label: "Model", required: true, placeholder: "iPhone 14 Pro" },
    { name: "storage", label: "Storage", placeholder: "256GB" },
    { name: "condition", label: "Overall condition", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Damaged"] },
    { name: "screen", label: "Screen condition", type: "select", options: ["Clean", "Minor scratches", "Cracked", "Not working"] },
    { name: "battery", label: "Battery / performance notes", type: "textarea", placeholder: "Battery health, charging issues, repairs..." },
    { name: "expected_price", label: "Expected price in ₦", type: "number", placeholder: "Optional" }
  ]}/></div></main></>;
}
