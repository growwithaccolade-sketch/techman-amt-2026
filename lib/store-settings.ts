import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { fallbackStoreSettings, PRIMARY_SUPPORT_EMAIL, PRIMARY_SUPPORT_PHONE, type StoreSettings } from "@/lib/site";

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!commerceBackendConfigured()) return fallbackStoreSettings;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return fallbackStoreSettings;

    return {
      storeName: data.store_name || fallbackStoreSettings.storeName,
      supportEmail: PRIMARY_SUPPORT_EMAIL,
      whatsappNumber: PRIMARY_SUPPORT_PHONE,
      announcementText: data.announcement_text || fallbackStoreSettings.announcementText,
      freeDeliveryThreshold: data.free_delivery_threshold_ngn == null ? null : Number(data.free_delivery_threshold_ngn),
      locationLabel: data.location_label && data.location_label !== "Lagos, Nigeria" ? data.location_label : fallbackStoreSettings.locationLabel,
      footerCreditLabel: data.footer_credit_label || fallbackStoreSettings.footerCreditLabel,
      footerCreditUrl: data.footer_credit_url || fallbackStoreSettings.footerCreditUrl,
    };
  } catch {
    return fallbackStoreSettings;
  }
}
