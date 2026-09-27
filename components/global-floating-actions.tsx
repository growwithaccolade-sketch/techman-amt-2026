"use client";

import { ArrowUp, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { makeWhatsappUrl } from "@/lib/site";

export default function GlobalFloatingActions() {
  const pathname = usePathname();
  const { settings } = useCart();

  if (pathname.startsWith("/admin")) return null;

  const supportLink = makeWhatsappUrl(
    settings.whatsappNumber,
    "Hello TechMan AMT, I need help with a product."
  );

  return (
    <div className="globalFloatingActions" aria-label="Quick actions">
      <button
        type="button"
        className="globalScrollTop"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={19} strokeWidth={2.4}/>
        <span>Top</span>
      </button>
      {supportLink && (
        <a
          className="globalWhatsApp"
          href={supportLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with TechMan AMT on WhatsApp"
        >
          <MessageCircle size={22} strokeWidth={2.5}/>
          <span>WhatsApp</span>
        </a>
      )}
    </div>
  );
}
