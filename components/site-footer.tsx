"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import { useCart } from "@/components/cart-provider";
import { makeWhatsappUrl } from "@/lib/site";

export default function SiteFooter() {
  const pathname = usePathname();
  const { settings } = useCart();
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const supportLink = makeWhatsappUrl(settings.whatsappNumber, "Hello TechMan AMT, I need help choosing or ordering a product.");

  return <footer className="footer premiumFooter">
    <div className="shell premiumFooterTop">
      <div className="footerBrandBlock">
        <BrandLogo light/>
        <p>Better tech choices, clear prices and direct support when you need a second opinion.</p>
        <div className="footerContactLines">
          <a href="tel:08103483669">08103483669</a>
          <a href="mailto:techmanamt@gmail.com">techmanamt@gmail.com</a>
        </div>
        <small>{settings.locationLabel}</small>
      </div>
      <div><b>Shop</b><Link href="/shop?category=Phones">Phones</Link><Link href="/shop?category=Laptops">Laptops</Link><Link href="/shop?category=Creator%20Tools">Creator Tools</Link><Link href="/shop">All Products</Link></div>
      <div><b>Help</b><Link href="/track-order">Track order</Link><Link href="/delivery">Delivery</Link><Link href="/returns">Returns</Link><Link href="/warranty">Warranty</Link></div>
      <div><b>Company</b><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/trade-in">Trade In</Link><Link href="/corporate">Bulk Orders</Link></div>
      <div><b>Support</b><a href="tel:08103483669">Call 08103483669</a><a href="mailto:techmanamt@gmail.com">Email support</a>{supportLink && <a href={supportLink} target="_blank" rel="noreferrer">WhatsApp support</a>}<Link href="/faq">FAQs</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
    </div>
    <div className="shell copyright premiumCopyright"><span>© 2026 TechMan AMT</span><a href={settings.footerCreditUrl} target="_blank" rel="noreferrer">{settings.footerCreditLabel}</a></div>
  </footer>;
}
