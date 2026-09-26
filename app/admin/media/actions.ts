"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { uploadProductImage } from "@/lib/product-images";
import { getSiteMedia, mediaFields, type SiteMedia } from "@/lib/site-media";

export async function saveSiteMedia(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/media?error=backend");

  const current = await getSiteMedia();
  const next: SiteMedia = { ...current };

  for (const field of mediaFields) {
    const url = String(formData.get(String(field.key)) || "").trim();
    const file = formData.get(`${String(field.key)}File`);
    if (file instanceof File && file.size > 0) {
      try {
        next[field.key] = await uploadProductImage(file);
      } catch (error) {
        redirect(`/admin/media?error=${encodeURIComponent(error instanceof Error ? error.message : "Image upload failed")}`);
      }
    } else if (url) {
      next[field.key] = url;
    } else if (formData.get(`${String(field.key)}Clear`) === "on") {
      delete next[field.key];
    }
  }

  const sections = mediaFields
    .filter((field) => next[field.key])
    .map((field) => ({ title: field.key, body: next[field.key] as string }));

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("site_pages").upsert({
    slug: "media-config",
    eyebrow: "MEDIA",
    title: "Store media",
    intro: "Editable storefront visual assets.",
    sections,
    active: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: "slug" });

  if (error) redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  revalidatePath("/admin/media");
  redirect("/admin/media?success=1");
}
