import type { Product } from "@/lib/products";

export function productBadgeLabel(product: Product) {
  if (product.oldPrice && product.oldPrice > product.price) return "Offer";
  const badge = (product.badge || "").toLowerCase();
  if (badge.includes("new")) return "New";
  if (badge.includes("bestseller") || badge.includes("popular") || badge.includes("featured")) return "Popular";
  if (badge.includes("pro") || badge.includes("premium") || badge.includes("business")) return "Premium";
  return null;
}

export function productSavings(product: Product) {
  if (!product.oldPrice || product.oldPrice <= product.price) return null;
  const amount = product.oldPrice - product.price;
  const percent = Math.round((amount / product.oldPrice) * 100);
  return { amount, percent };
}
