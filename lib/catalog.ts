import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { type Product, products as demoProducts } from "@/lib/products";

const localCatalogImage = (slug: string) =>
  demoProducts.find((product) => product.slug === slug)?.image || `/product-art/${slug}.svg`;

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
  return {
    id: Number(row.external_id),
    slug: String(row.slug),
    name: String(row.name),
    brand: String(row.brand),
    category: String(row.category),
    price: Number(row.price_ngn),
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
