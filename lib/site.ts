export type StoreSettings = {
  storeName: string;
  supportEmail: string;
  whatsappNumber: string;
  announcementText: string;
  freeDeliveryThreshold: number | null;
  locationLabel: string;
  footerCreditLabel: string;
  footerCreditUrl: string;
};

export const PRIMARY_SUPPORT_EMAIL = "techmanamt@gmail.com";
export const PRIMARY_SUPPORT_PHONE = "08103483669";

export const fallbackStoreSettings: StoreSettings = {
  storeName: "TechMan AMT",
  supportEmail: PRIMARY_SUPPORT_EMAIL,
  whatsappNumber: PRIMARY_SUPPORT_PHONE,
  announcementText: "See the price. Know the condition. Buy with confidence.",
  freeDeliveryThreshold: null,
  locationLabel: "12 Techman Close, Lekki Phase 1, Lagos, Nigeria",
  footerCreditLabel: "Built by Mike Accolade",
  footerCreditUrl: "https://mikeaccolade.xyz",
};

export function makeWhatsappUrl(number: string, message: string) {
  let cleaned = number.replace(/\D/g, "");
  if (!cleaned) return "";
  if (/^0\d{10}$/.test(cleaned)) cleaned = `234${cleaned.slice(1)}`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
