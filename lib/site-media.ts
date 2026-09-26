import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export type SiteMedia = {
  categoryPhones?: string;
  categoryLaptops?: string;
  categoryCreatorTools?: string;
  categoryAudio?: string;
  categoryAccessories?: string;
  creatorImage?: string;
};

export const mediaFields: Array<{ key: keyof SiteMedia; label: string }> = [
  { key: "categoryPhones", label: "Phones category image" },
  { key: "categoryLaptops", label: "Laptops category image" },
  { key: "categoryCreatorTools", label: "Creator Tools category image" },
  { key: "categoryAudio", label: "Audio category image" },
  { key: "categoryAccessories", label: "Accessories category image" },
  { key: "creatorImage", label: "Creator section image" },
];

export async function getSiteMedia(): Promise<SiteMedia> {
  if (!commerceBackendConfigured()) return {};
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_pages")
      .select("sections,active")
      .eq("slug", "media-config")
      .maybeSingle();

    if (error || !data || data.active === false || !Array.isArray(data.sections)) return {};

    const media: SiteMedia = {};
    for (const section of data.sections as Array<{ title?: string; body?: string }>) {
      const key = String(section.title || "") as keyof SiteMedia;
      if (mediaFields.some((field) => field.key === key) && section.body) media[key] = String(section.body);
    }
    return media;
  } catch {
    return {};
  }
}
