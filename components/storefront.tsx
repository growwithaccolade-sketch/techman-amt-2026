"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Headphones,
  Heart,
  Home,
  Laptop,
  Gamepad2,
  Menu,
  Mic2,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Smartphone,
  Tablet,
  Truck,
  UserRound,
  Watch,
  X,
  Zap,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money, type Product } from "@/lib/products";
import { makeWhatsappUrl } from "@/lib/site";
import NewsletterForm from "@/components/newsletter-form";
import ProductImage from "@/components/product-image";
import BrandLogo from "@/components/brand-logo";
import type { EditablePage } from "@/lib/site-pages";
import type { SiteMedia } from "@/lib/site-media";
import { productBadgeLabel, productSavings } from "@/lib/product-display";

const categoryMeta = [
  { name: "Phones", copy: "Smartphones from Apple, Samsung and other major brands.", icon: Smartphone, mediaKey: "categoryPhones" as const, fallbackImage: "/products/iphone-16-pro-max-256gb.webp" },
  { name: "Laptops", copy: "Laptops for work, school, gaming and creative software.", icon: Laptop, mediaKey: "categoryLaptops" as const, fallbackImage: "/products/macbook-air-m4-13-inch.webp" },
  { name: "Tablets", copy: "Tablets for study, work, drawing, reading and entertainment.", icon: Tablet, mediaKey: null, fallbackImage: "/products/ipad-air-m3-11.webp" },
  { name: "Watches", copy: "Smartwatches for fitness, notifications and everyday use.", icon: Watch, mediaKey: null, fallbackImage: "/products/apple-watch-ultra-4.webp" },
  { name: "Creator Tools", copy: "Microphones, cameras, lighting and production accessories.", icon: Mic2, mediaKey: "categoryCreatorTools" as const, fallbackImage: "/products/dji-mic-3.webp" },
  { name: "Audio", copy: "Headphones, earbuds and speakers for work and everyday use.", icon: Headphones, mediaKey: "categoryAudio" as const, fallbackImage: "/products/sony-wh-1000xm6.webp" },
  { name: "Accessories", copy: "Chargers, storage, power banks and device accessories.", icon: Zap, mediaKey: "categoryAccessories" as const, fallbackImage: "/products/anker-737-power-bank.webp" },
  { name: "Gaming", copy: "Consoles and gaming devices for home and portable play.", icon: Gamepad2, mediaKey: null, fallbackImage: "/products/nintendo-switch-2.webp" },
];

const filters = ["All", "Phones", "Laptops", "Tablets", "Watches", "Audio", "Creator Tools", "Accessories", "Gaming"];

const heroSlugs = [
  "iphone-18-pro-max-256gb",
  "galaxy-s26-ultra-512gb",
  "airpods-5",
];

const featuredSlugs = [
  "apple-watch-ultra-4",
  "iphone-16-pro-max-256gb",
  "samsung-galaxy-s25-ultra-256gb",
  "macbook-air-m4-13-inch",
  "sony-wh-1000xm5",
  "anker-737-power-bank",
  "hollyland-lark-m2-wireless-mic",
  "logitech-mx-master-3s",
  "jbl-charge-5",
];

const priceLabel = (product: Product) => money(product.price);

export default function Storefront({ homeContent, siteMedia }: { homeContent?: EditablePage; siteMedia?: SiteMedia }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { catalog, settings, lines, wishlist, totalItems, addItem, toggleWishlist } = useCart();

  const supportLink = makeWhatsappUrl(
    settings.whatsappNumber,
    "Hello TechMan AMT, I need help with a product."
  );

  const visibleProducts = useMemo(() => {
    const filtered = catalog.filter((product) => {
      const inCategory = category === "All" || product.category === category;
      const q = query.toLowerCase().trim();
      const matches =
        !q ||
        `${product.name} ${product.brand} ${product.category} ${product.blurb}`
          .toLowerCase()
          .includes(q);
      return inCategory && matches;
    });

    return [...filtered].sort((a, b) => {
      const ai = featuredSlugs.indexOf(a.slug);
      const bi = featuredSlugs.indexOf(b.slug);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return b.id - a.id;
    });
  }, [catalog, query, category]);

  const getBySlug = (slug: string) => catalog.find((product) => product.slug === slug);
  const curatedHero = heroSlugs.map(getBySlug).filter(Boolean) as typeof catalog;
  const heroProducts = curatedHero.length >= 3 ? curatedHero.slice(0, 3) : catalog.slice(0, 3);
  const primaryHero = heroProducts[0];
  const secondaryHero = heroProducts[1];
  const tertiaryHero = heroProducts[2];

  const heroIds = new Set(heroProducts.map((product) => product.id));
  const curatedFeatured = featuredSlugs.map(getBySlug).filter(Boolean) as typeof catalog;
  const defaultFeatured = [
    ...curatedFeatured,
    ...catalog.filter((product) =>
      Boolean(product.image) &&
      !heroIds.has(product.id) &&
      !curatedFeatured.some((item) => item.id === product.id)
    ),
  ].filter((product, index, list) => list.findIndex((item) => item.id === product.id) === index).slice(0, 9);

  const defaultMode = category === "All" && !query.trim();
  const displayProducts = defaultMode
    ? defaultFeatured
    : visibleProducts.filter((product) => !heroIds.has(product.id)).slice(0, 9);
  const heroTitle = (homeContent?.title || "Need a new phone, laptop or creator gear?|Find the option that fits what you actually need.").split("|");
  const homeSections = homeContent?.sections || [];
  const editableSections = homeSections.length >= 8 ? homeSections : [];
  const categorySection = editableSections[0];
  const setupSection = editableSections[1];
  const trendingSection = editableSections[2];
  const trustSection = editableSections[3];
  const creatorSection = editableSections[4];
  const guidesSection = editableSections[5];
  const contactSection = editableSections[6] || homeSections[0];
  const newsletterSection = editableSections[7] || homeSections[1];

  return (
    <main className="siteFrame">
      <div className="announcement premiumAnnouncement">
        <span>{settings.announcementText || "Prices, stock and product details are shown on the site."}</span>
        <span className="announcementDesktop">Delivery across Nigeria · Help when you need it</span>
      </div>

      <header className="nav shell premiumNav">
        <BrandLogo/>

        <nav className="desktopNav premiumDesktopNav">
          <Link className="current" aria-current="page" href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <a href="#collections">Collections</a>
          <Link href="/blog">Guides</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="navActions premiumNavActions">
          <button
            className="iconBtn navSearchButton"
            aria-label="Search products"
            onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Search size={18}/>
          </button>
          <Link className="iconBtn" aria-label="Account" href="/account"><UserRound size={18}/></Link>
          <Link className="iconBtn badgeWrap" aria-label="Wishlist" href="/wishlist">
            <Heart size={18}/>
            {wishlist.length > 0 && <span className="count">{wishlist.length}</span>}
          </Link>
          <Link className="cartBtn premiumCartBtn" href="/cart">
            <ShoppingBag size={17}/>
            <span className="cartLabel">Cart</span>
            <em>{totalItems}</em>
          </Link>
          <button className="menuBtn" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu/></button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobileMenu premiumMobileMenu">
          <div className="mobileMenuTop">
            <BrandLogo/>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X/></button>
          </div>
          <nav>
            <Link href="/" onClick={() => setMobileOpen(false)}>Home <ArrowUpRight/></Link>
            <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop <ArrowUpRight/></Link>
            <a href="#collections" onClick={() => setMobileOpen(false)}>Collections <ArrowUpRight/></a>
            <Link href="/blog" onClick={() => setMobileOpen(false)}>Guides <ArrowUpRight/></Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact <ArrowUpRight/></Link>
          </nav>
          <div className="mobileMenuUtilities">
            <Link href="/account" onClick={() => setMobileOpen(false)}>Account</Link>
            <Link href="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist ({wishlist.length})</Link>
            <Link href="/track-order" onClick={() => setMobileOpen(false)}>Track Order</Link>
          </div>
        </div>
      )}

      <section className="premiumHero shell">
        <div className="premiumHeroCopy">
          <div className="heroOverline">{homeContent?.eyebrow || "TECHMAN AMT"}</div><h1>{heroTitle[0]}{heroTitle[1] && <><br/><span>{heroTitle[1]}</span></>}</h1><p>{homeContent?.intro || "Compare current options by price, stock, condition and the features that matter for your everyday use. Whether it is school, work, content, gaming or a simple upgrade, start with what you need it to do."}</p>
          <div className="premiumHeroCtas">
            <Link className="primaryBtn heroPrimary" href="/shop">Shop all products <ArrowRight size={17}/></Link>
            <Link className="textCta" href="/device-request">Tell us what you need <ArrowUpRight size={16}/></Link>
          </div>
          <div className="heroProof">
            <span><BadgeCheck size={16}/> Prices shown</span>
            <span><Truck size={16}/> Delivery across Nigeria</span>
            <span><ShieldCheck size={16}/> Help choosing the right option</span>
          </div>
          <div className="heroIntentRow" aria-label="Common shopping needs">
            <Link href="/shop?category=Phones">I need a phone</Link>
            <Link href="/shop?category=Laptops">I need a laptop</Link>
            <Link href="/shop?category=Creator%20Tools">I make content</Link>
          </div>
        </div>

        <div className="heroStage">
          {primaryHero && (
            <Link
              href={`/product/${primaryHero.slug}`}
              className="heroStageMain"
            >
              <div className="heroStageBadge">New</div>
              <ProductImage src={primaryHero.image} alt={primaryHero.name} brand={primaryHero.brand} sizes="(max-width: 900px) 92vw, 46vw" priority/>
              <div className="heroStageOverlay">
                <span>{primaryHero.brand}</span>
                <strong>{primaryHero.name}</strong>
                <b>{priceLabel(primaryHero)}</b>
              </div>
            </Link>
          )}

          <div className="heroStageRail">
            {secondaryHero && (
              <Link
                href={`/product/${secondaryHero.slug}`}
                className="heroMiniCard"
              >
                <ProductImage src={secondaryHero.image} alt={secondaryHero.name} brand={secondaryHero.brand} sizes="220px" priority/>
                <div><span>{secondaryHero.category}</span><strong>{secondaryHero.name}</strong></div>
              </Link>
            )}
            {tertiaryHero && (
              <Link
                href={`/product/${tertiaryHero.slug}`}
                className="heroMiniCard"
              >
                <ProductImage src={tertiaryHero.image} alt={tertiaryHero.name} brand={tertiaryHero.brand} sizes="220px" priority/>
                <div><span>{tertiaryHero.category}</span><strong>{tertiaryHero.name}</strong></div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="brandRail shell" aria-label="Popular brands">
        <span>APPLE</span><span>SAMSUNG</span><span>GOOGLE</span><span>SONY</span><span>DJI</span><span>NINTENDO</span><span>ANKER</span>
      </section>

      <div className="homeQuickFilterWrap">
        <div className="shell homeQuickFilter">
          <span>Shop by category</span>
          <div className="filterRow premiumFilterRow" role="tablist" aria-label="Filter products by category">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={category === item}
                aria-controls="trending-products"
                onClick={() => {
                  setCategory(item);
                  window.requestAnimationFrame(() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth", block: "start" }));
                }}
                className={category === item ? "active" : ""}
              >
                <span>{item}</span>
                <em>{item === "All" ? catalog.length : catalog.filter((product) => product.category === item).length}</em>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section id="collections" className="collectionSection shell">
        <div className="premiumSectionHead">
          <div><span className="kicker">SHOP BY NEED</span><h2>{categorySection?.title || "Find the right product faster."}</h2>{categorySection?.body && <p className="sectionLead">{categorySection.body}</p>}</div>
          <Link href="/shop" className="sectionLink">Browse the full store <ArrowUpRight size={16}/></Link>
        </div>

        <div className="collectionBento">
          {categoryMeta.map((item, index) => {
            const Icon = item.icon;
            const tileImage = item.mediaKey ? siteMedia?.[item.mediaKey] || item.fallbackImage : item.fallbackImage;
            return (
              <Link
                key={item.name}
                href={`/shop?category=${encodeURIComponent(item.name)}`}
                className={`collectionTile collectionTile${index + 1} ${index % 2 === 0 ? "categoryAlignStart" : "categoryAlignEnd"}`}
              >
                {tileImage && <img className="collectionTileCmsImage" src={tileImage} alt="" loading="lazy" decoding="async"/>}
                <div className="collectionTileTop"><Icon size={18}/></div>
                <div className="collectionTileCopy">
                  <h3>{item.name}</h3>
                  <p>{item.copy}</p>
                </div>
                <div className="categoryVisual" aria-hidden="true"><Icon size={74}/></div>
                <ArrowUpRight className="collectionArrow" size={20}/>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="premiumDeal">
        <div className="shell premiumDealInner">
          <div className="premiumDealCopy">
            <span className="dealLabel">ACCESSORIES AND ADD-ONS</span>
            <h2>{setupSection?.title || "Add the accessories you need."}</h2>
            <p>{setupSection?.body || "Choose chargers, storage, audio and other accessories that match your main device."}</p>
            <Link href="/shop" className="lightBtn">Shop accessories <ArrowRight size={17}/></Link>
          </div>
          <div className="dealFeatureStack">
            {[
              ["01", "Power", "Chargers and power banks", Zap],
              ["02", "Audio", "Headphones, earbuds and speakers", Headphones],
              ["03", "Work", "Storage and computer accessories", Laptop],
            ].map(([index, label, title, FeatureIcon]) => {
              const Icon = FeatureIcon as typeof Zap;
              return (
                <Link href="/shop?category=Accessories" className="dealFeatureItem dealEditorialItem" key={String(index)}>
                  <span>{String(index)}</span>
                  <div className="dealEditorialIcon"><Icon size={22}/></div>
                  <div><small>{String(label)}</small><strong>{String(title)}</strong><b>View products</b></div>
                  <ArrowUpRight size={18}/>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="featured" className="featuredSection shell">
        <div className="premiumSectionHead featuredHead">
          <div><span className="kicker">PRODUCTS</span><h2>{trendingSection?.title || "Popular products and current prices."}</h2>{trendingSection?.body && <p className="sectionLead">{trendingSection.body}</p>}</div>
          <div className="featuredSearch">
            <Search size={17}/>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search iPhone, Samsung, MacBook, audio..."/>
          </div>
        </div>

        <div className="filterToolbar featuredResultBar">
          <p className="filterResult" aria-live="polite">{displayProducts.length} {displayProducts.length === 1 ? "product" : "products"} shown{category !== "All" ? ` in ${category}` : ""}</p>
        </div>

        <div id="trending-products" className="premiumProductGrid">
          {displayProducts.map((product) => {
            const inCart = lines.some((line) => line.id === product.id);
            const badge = productBadgeLabel(product);
            const savings = productSavings(product);
            return (
              <article className="premiumProductCard" key={product.id}>
                <div className="premiumProductMedia">
                  {badge && <span className={`productBadge productBadge--${badge.toLowerCase()}`}>{badge}</span>}
                  <button
                    className={`wishBtn ${wishlist.includes(product.id) ? "on" : ""}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Save product"
                  >
                    <Heart size={17} fill={wishlist.includes(product.id) ? "currentColor" : "none"}/>
                  </button>
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 31vw"/>
                  </Link>
                </div>

                <div className="premiumProductBody">
                  <div className="productMetaLine"><span>{product.brand}</span><span>{product.category}</span></div>
                  <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
                  <p>{product.blurb}</p>
                  <div className="premiumPriceLine">
                    <strong>{priceLabel(product)}</strong>
                    {product.oldPrice && product.oldPrice > product.price && <del>{money(product.oldPrice)}</del>}
                    {savings && <span className="priceSaving">Save {savings.percent}%</span>}
                  </div>
                  <div className="productTrustRow">
                    {product.rating > 0 && product.reviews > 0
                      ? <span><Star size={13} fill="currentColor"/> {product.rating.toFixed(1)} <small>({product.reviews})</small></span>
                      : <span><ShieldCheck size={13}/> {product.condition}</span>}
                    <span className={product.stock > 0 ? "" : "isOut"}>{product.stock > 0 ? "In stock" : "Stock check required"}</span>
                  </div>
                  <div className="premiumCardActions">
                    <button
                      className={`premiumAddButton ${inCart ? "added" : ""}`}
                      onClick={() => addItem(product.id)}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingBag size={16}/>
                      {product.stock <= 0 ? "Out of stock" : inCart ? "Add another" : "Add to cart"}
                    </button>
                    <Link className="premiumDetailButton" href={`/product/${product.slug}`} aria-label={`View ${product.name}`}><ArrowUpRight size={18}/></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {displayProducts.length === 0 && (
          <div className="emptyState premiumEmptyState">
            <Search size={34}/><h3>No products found.</h3><p>Change the search or category filter.</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button>
          </div>
        )}
      </section>

      <section className="whySection shell">
        <div className="whyLead">
          <span className="kicker">STORE INFORMATION</span>
          <h2>{trustSection?.title || "What you can check before ordering."}</h2>
          <p>{trustSection?.body || "Product pages show price, stock, condition and key specifications before checkout."}</p>
        </div>
        <div className="whyGrid">
          <article><span>01</span><ShieldCheck/><h3>Price</h3><p>Every product has a visible price.</p></article>
          <article><span>02</span><Truck/><h3>Details before payment</h3><p>Check condition, warranty, important specs and stock information before you commit your money.</p></article>
          <article><span>03</span><BadgeCheck/><h3>Contact</h3><p>Call {settings.whatsappNumber} or email {settings.supportEmail} for product and order questions.</p></article>
        </div>
      </section>

      <section id="creator" className="editorialSection shell">
        <div className="editorialMedia creatorEditorialVisual">
          {siteMedia?.creatorImage && <img className="creatorCmsImage" src={siteMedia.creatorImage} alt="Creator setup" loading="lazy" decoding="async"/>}
          <div className="creatorVisualCore"><Mic2 size={64}/></div>
          <div className="creatorVisualChip creatorChipOne"><Headphones size={22}/> Wireless mic</div>
          <div className="creatorVisualChip creatorChipTwo"><Zap size={22}/> Power bank</div>
          <div className="creatorVisualChip creatorChipThree"><Laptop size={22}/> Laptop editing</div>
          <span className="editorialTag">CREATOR TOOLS</span>
        </div>
        <div className="editorialCopy">
          <span className="kicker">CREATOR EQUIPMENT</span>
          <h2>{creatorSection?.title || "For video content, start with audio, lighting and power."}</h2>
          <p>{creatorSection?.body || "For a talking-head video, a clear microphone and decent light can matter more than another camera upgrade. Add storage and power based on how long and how often you record."}</p>
          <div className="editorialChecklist">
            <span><Check/> Wireless microphones</span>
            <span><Check/> Tripods & phone rigs</span>
            <span><Check/> Lighting & streaming gear</span>
            <span><Check/> Storage & power</span>
          </div>
          <Link href="/shop?category=Creator%20Tools" className="primaryBtn">Shop creator equipment <ArrowRight size={17}/></Link>
        </div>
      </section>

      <section className="insights premiumInsights shell">
        <div className="premiumSectionHead guideSectionHead">
          <div>
            <span className="kicker">NOT SURE WHAT TO BUY?</span>
            <h2>{guidesSection?.title || "Start with what you need the device to do."}</h2>
            <p className="sectionLead">{guidesSection?.body || "These short guides answer the questions people usually ask before spending money on a phone, laptop or microphone."}</p>
          </div>
          <Link href="/blog" className="sectionLink">See all buying guides <ArrowUpRight size={16}/></Link>
        </div>

        <div className="insightGrid guideGrid">
          {[
            {
              number: "01",
              image: "/products/iphone-16-pro-max-256gb.webp",
              label: "PHONE GUIDE",
              title: "Which phone should you buy for TikTok, Reels or YouTube?",
              copy: "If you record often, camera stabilization, storage and battery life can matter more than a long spec list. See what to check before paying.",
              examples: "TikTok · Reels · YouTube",
              href: "/blog/how-to-choose-a-phone-for-content-creation",
            },
            {
              number: "02",
              image: "/products/macbook-air-m4-13-inch.webp",
              label: "LAPTOP GUIDE",
              title: "What laptop specs do you need for school, work, editing or coding?",
              copy: "Google Docs and Zoom do not need the same hardware as Premiere Pro, AutoCAD, large code projects or gaming. Match the laptop to the apps you actually use.",
              examples: "School · Office · Editing · Coding",
              href: "/blog/laptop-buying-guide-for-work-school-and-creative-use",
            },
            {
              number: "03",
              image: "/products/dji-mic-3.webp",
              label: "AUDIO GUIDE",
              title: "What microphone should you use for videos, interviews or podcasts?",
              copy: "A wireless clip-on mic works well for walking videos and interviews. A desk podcast or streaming setup may need something different.",
              examples: "Vlogs · Interviews · Podcasts",
              href: "/blog/creator-audio-starter-guide",
            },
          ].map((guide) => (
            <Link href={guide.href} className="insightCard guideCard" key={guide.title}>
              <div className="guideCardMedia">
                <img src={guide.image} alt="" loading="lazy" decoding="async"/>
                <span>{guide.number}</span>
              </div>
              <div className="guideCardBody">
                <small>{guide.label}</small>
                <h3>{guide.title}</h3>
                <p>{guide.copy}</p>
                <em>{guide.examples}</em>
                <b>Read this guide <ArrowUpRight size={15}/></b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="homeContactBand shell">
        <div className="homeContactCopy">
          <span className="kicker">CONTACT</span>
          <h2>{contactSection?.title || "Need help choosing a product?"}</h2><p>{contactSection?.body || `Call ${settings.whatsappNumber} or email ${settings.supportEmail} for a quick product recommendation, compatibility check, delivery question or order update.`}</p>
        </div>
        <div className="homeContactActions">
          <Link className="contactPrimary" href="/contact">Contact TechMan AMT <ArrowRight size={17}/></Link>
          {supportLink && <a className="contactSecondary" href={supportLink} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp</a>}
          <Link className="contactSecondary" href="/track-order">Track order</Link>
        </div>
      </section>

      <section className="newsletter premiumNewsletter">
        <div className="shell premiumNewsletterInner">
          <div>
            <span className="kicker">UPDATES</span>
            <h2>{newsletterSection?.title || "Get stock and price updates."}</h2><p>{newsletterSection?.body || "Receive new product, stock and price updates by email."}</p>
          </div>
          <NewsletterForm/>
        </div>
      </section>

      <nav className="mobileDock" aria-label="Mobile navigation">
        <Link href="/"><span className="dockIcon"><Home size={18}/></span><small>Home</small></Link>
        <Link href="/shop"><span className="dockIcon"><Search size={18}/></span><small>Shop</small></Link>
        <Link href="/contact"><span className="dockIcon"><MessageCircle size={18}/></span><small>Contact</small></Link>
        <Link href="/cart" className="dockBadge"><span className="dockIcon"><ShoppingBag size={18}/></span><small>Cart</small>{totalItems > 0 && <em>{totalItems}</em>}</Link>
      </nav>

      {supportLink && (
        <a className="floatingWhatsApp premiumWhatsapp" href={supportLink} target="_blank" rel="noreferrer" aria-label="Chat with TechMan AMT on WhatsApp">
          <MessageCircle size={22} strokeWidth={2.5}/>
          <span>WhatsApp</span>
        </a>
      )}
      <button
        type="button"
        className="scrollTopButton"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUpRight size={18}/>
        <span>Top</span>
      </button>
    </main>
  );
}
