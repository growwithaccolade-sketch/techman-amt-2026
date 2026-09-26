import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import CatalogBrowser from "@/components/catalog-browser";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Shop Tech With Visible Prices", description: "Compare phones, laptops, audio, creator tools and accessories with visible prices and clear buying details from TechMan AMT." };

const fallback = {
  slug: "shop",
  eyebrow: "SHOP",
  title: "Find the tech that fits. Buy it with confidence.",
  intro: "Compare clear prices, useful specs and current availability across phones, laptops, audio, creator gear and accessories.",
  sections: [],
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; brand?: string }> }) {
  const [params, page] = await Promise.all([searchParams, getEditablePage("shop", fallback)]);
  return <><CommerceHeader/><CatalogBrowser title={page.title} intro={page.intro} initialQuery={params.q || ""} initialCategory={params.category || "All"} initialBrand={params.brand || "All"}/></>;
}
