import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import CatalogBrowser from "@/components/catalog-browser";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <><CommerceHeader/><CatalogBrowser title={q ? `Results for “${q}”` : "Find your next device faster."} intro="Search products and brands, compare visible prices and open the product page when something fits." initialQuery={q}/></>;
}
