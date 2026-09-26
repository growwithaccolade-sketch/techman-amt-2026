import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "FAQ", description: "Quick answers about TechMan AMT products, delivery, condition, support and bulk orders." };

const fallback = {
  slug: "faq",
  eyebrow: "QUICK ANSWERS",
  title: "Get the important answers before checkout.",
  intro: "Prices are shown on products. Condition and key details are stated where available. If your decision still needs a human answer, call 08103483669 or email techmanamt@gmail.com.",
  sections: [
    {
      title: "Do you deliver across Nigeria?",
      body: "Yes. The exact courier, fee and delivery window depend on the destination and product, and are confirmed for the order."
    },
    {
      title: "Can I ask before I buy?",
      body: "Yes. Call or WhatsApp 08103483669 for product, compatibility and order questions, or email techmanamt@gmail.com."
    },
    {
      title: "How do I track an order?",
      body: "Open the Track Order page and enter the order reference together with the same email address used at checkout."
    },
    {
      title: "Are products new or UK used?",
      body: "Condition is shown per product. Check the product detail before checkout instead of judging condition from price."
    },
    {
      title: "Can a business order in bulk?",
      body: "Yes. Use the Bulk & Corporate form with the products, quantity, budget, delivery location and required timeline so the team can prepare a useful quote."
    }
  ]
};

export default async function Page() {
  const stored = await getEditablePage("faq", fallback);
  const page = stored.title === "Answers before you spend." ? fallback : stored;
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
