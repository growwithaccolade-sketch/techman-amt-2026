import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { type Product, products as demoProducts } from "@/lib/products";

const localCatalogImage = (slug: string) =>
  demoProducts.find((product) => product.slug === slug)?.image || `/products/${slug}.webp`;

function placeholderPrice(id: number, category: string) {
  const base: Record<string, number> = {
    Phones: 850000,
    Laptops: 1450000,
    Tablets: 880000,
    Watches: 380000,
    Audio: 180000,
    "Creator Tools": 220000,
    Accessories: 95000,
    Gaming: 650000,
  };
  const step: Record<string, number> = {
    Phones: 135000,
    Laptops: 175000,
    Tablets: 145000,
    Watches: 95000,
    Audio: 70000,
    "Creator Tools": 85000,
    Accessories: 35000,
    Gaming: 75000,
  };
  const raw = (base[category] ?? 300000) + ((id * 7) % 12) * (step[category] ?? 50000);
  return Math.round(raw / 5000) * 5000;
}

function resolveImage(row: Record<string, unknown>) {
  const slug = String(row.slug);
  const stored = row.image_url ? String(row.image_url) : "";
  const local = localCatalogImage(slug);

  // Admin-uploaded Supabase Storage images remain authoritative.
  const isManagedUpload =
    stored.includes("/storage/v1/object/public/product-images/") ||
    stored.includes(".supabase.co/storage/");

  if (isManagedUpload) return stored;
  return local || stored || `/product-art/${slug}.svg`;
}

function mapRow(row: Record<string, unknown>): Product {
  const condition = row.condition === "UK Used" ? "UK Used" : "New";
  const id = Number(row.external_id);
  const category = String(row.category);
  const rawPrice = Number(row.price_ngn);
  return {
    id,
    slug: String(row.slug),
    name: String(row.name),
    brand: String(row.brand),
    category,
    price: rawPrice > 0 ? rawPrice : placeholderPrice(id, category),
    oldPrice: row.old_price_ngn == null ? undefined : Number(row.old_price_ngn),
    badge: row.badge ? String(row.badge) : undefined,
    rating: 0,
    reviews: 0,
    image: resolveImage(row),
    blurb: row.blurb ? String(row.blurb) : "Selected technology from TechMan AMT.",
    stock: Number(row.stock || 0),
    warranty: row.warranty ? String(row.warranty) : "Warranty details available before payment",
    condition,
    highlights: Array.isArray(row.highlights) ? row.highlights.map(String) : [],
    specs: row.specs && typeof row.specs === "object" && !Array.isArray(row.specs)
      ? Object.fromEntries(Object.entries(row.specs as Record<string, unknown>).map(([key, value]) => [key, String(value)]))
      : {},
  };
}

export async function getStoreCatalog(): Promise<Product[]> {
  if (!commerceBackendConfigured()) return demoProducts;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("products").select("*").eq("active", true).order("updated_at", { ascending: false });
    if (error || !data?.length) return demoProducts;
    return data.map((row) => mapRow(row as Record<string, unknown>));
  } catch {
    return demoProducts;
  }
}

export async function getStoreProduct(slug: string): Promise<Product | undefined> {
  if (!commerceBackendConfigured()) return demoProducts.find((product) => product.slug === slug);

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
    if (error || !data) return demoProducts.find((product) => product.slug === slug);
    return mapRow(data as Record<string, unknown>);
  } catch {
    return demoProducts.find((product) => product.slug === slug);
  }
}

export async function getStoreProductsByIds(ids: number[]): Promise<Product[]> {
  if (!ids.length) return [];
  if (!commerceBackendConfigured()) return demoProducts.filter((product) => ids.includes(product.id));

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("products").select("*").in("external_id", ids).eq("active", true);
    if (error) return [];
    return (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  } catch {
    return [];
  }
}
