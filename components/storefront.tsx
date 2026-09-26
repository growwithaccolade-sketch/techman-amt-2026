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
  Menu,
  Mic2,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  UserRound,
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

const categoryMeta = [
  { name: "Phones", copy: "Flagships and everyday phones worth carrying.", icon: Smartphone, mediaKey: "categoryPhones" as const },
  { name: "Laptops", copy: "Reliable machines for work, school and serious projects.", icon: Laptop, mediaKey: "categoryLaptops" as const },
  { name: "Creator Tools", copy: "Audio, lighting and gear that make your content better.", icon: Mic2, mediaKey: "categoryCreatorTools" as const },
  { name: "Audio", copy: "Hear more clearly at home, at work and on the move.", icon: Headphones, mediaKey: "categoryAudio" as const },
  { name: "Accessories", copy: "The chargers, storage and extras that complete the setup.", icon: Zap, mediaKey: "categoryAccessories" as const },
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
    "Hello TechMan AMT, I’m ready to buy but want help choosing the right option."
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
  const heroTitle = (homeContent?.title || "The right tech.|The right price. No chasing.").split("|");
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
        <span>{settings.announcementText || "Real prices. Clear product details. Direct support when you need it."}</span>
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
          <div className="heroOverline">{homeContent?.eyebrow || "BUY WITH CLARITY"}</div><h1>{heroTitle[0]}{heroTitle[1] && <><br/><span>{heroTitle[1]}</span></>}</h1><p>{homeContent?.intro || "Stop wasting time asking for prices or guessing which model fits. Compare trusted phones, laptops, audio and creator gear with visible pricing, key details and direct buying support."}</p>
          <div className="premiumHeroCtas">
            <Link className="primaryBtn heroPrimary" href="/shop">Shop products with prices <ArrowRight size={17}/></Link>
            <Link className="textCta" href="/device-request">Get a buying recommendation <ArrowUpRight size={16}/></Link>
          </div>
          <div className="heroProof">
            <span><BadgeCheck size={16}/> A visible price on every product</span>
            <span><Truck size={16}/> Delivery across Nigeria</span>
            <span><ShieldCheck size={16}/> Call or email before you pay</span>
          </div>
        </div>

        <div className="heroStage">
          {primaryHero && (
            <Link
              href={`/product/${primaryHero.slug}`}
              className="heroStageMain"
            >
              <div className="heroStageBadge">NEW 2026</div>
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
                <ProductImage src={secondaryHero.image} alt={secondaryHero.name} brand={secondaryHero.brand} sizes="220px"/>
                <div><span>{secondaryHero.category}</span><strong>{secondaryHero.name}</strong></div>
              </Link>
            )}
            {tertiaryHero && (
              <Link
                href={`/product/${tertiaryHero.slug}`}
                className="heroMiniCard"
              >
                <ProductImage src={tertiaryHero.image} alt={tertiaryHero.name} brand={tertiaryHero.brand} sizes="220px"/>
                <div><span>{tertiaryHero.category}</span><strong>{tertiaryHero.name}</strong></div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="brandRail shell" aria-label="Popular brands">
        <span>APPLE</span><span>SAMSUNG</span><span>GOOGLE</span><span>SONY</span><span>DJI</span><span>NINTENDO</span><span>ANKER</span>
      </section>

      <section id="collections" className="collectionSection shell">
        <div className="premiumSectionHead">
          <div><span className="kicker">SHOP BY NEED</span><h2>{categorySection?.title || "Find the right product faster."}</h2>{categorySection?.body && <p className="sectionLead">{categorySection.body}</p>}</div>
          <Link href="/shop" className="sectionLink">Browse the full store <ArrowUpRight size={16}/></Link>
        </div>

        <div className="collectionBento">
          {categoryMeta.map((item, index) => {
            const Icon = item.icon;
            const tileImage = siteMedia?.[item.mediaKey];
            return (
              <Link
                key={item.name}
                href={`/shop?category=${encodeURIComponent(item.name)}`}
                className={`collectionTile collectionTile${index + 1} ${index % 2 === 0 ? "categoryAlignStart" : "categoryAlignEnd"}`}
              >
                {tileImage && <img className="collectionTileCmsImage" src={tileImage} alt="" loading="lazy" decoding="async"/>}
                <div className="collectionTileTop"><Icon size={18}/><span>{index === 0 ? "Featured" : index === 1 ? "Portable" : item.name === "Creator Tools" ? "Studio" : "Explore"}</span></div>
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
            <span className="dealLabel">MAKE THE PURCHASE COUNT</span>
            <h2>{setupSection?.title || "Do not stop at the main device."}</h2>
            <p>{setupSection?.body || "Add the charger, audio, storage and creator gear that makes your new device more useful from day one."}</p>
            <Link href="/shop" className="lightBtn">Build the complete setup <ArrowRight size={17}/></Link>
          </div>
          <div className="dealFeatureStack">
            {[
              ["01", "Power", "Fast charging and dependable battery backup", Zap],
              ["02", "Audio", "Clear sound for calls, travel and content", Headphones],
              ["03", "Work", "Input and storage that match the main device", Laptop],
            ].map(([index, label, title, FeatureIcon]) => {
              const Icon = FeatureIcon as typeof Zap;
              return (
                <Link href="/shop?category=Accessories" className="dealFeatureItem dealEditorialItem" key={String(index)}>
                  <span>{String(index)}</span>
                  <div className="dealEditorialIcon"><Icon size={22}/></div>
                  <div><small>{String(label)}</small><strong>{String(title)}</strong><b>Browse matched gear</b></div>
                  <ArrowUpRight size={18}/>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="featured" className="featuredSection shell">
        <div className="premiumSectionHead featuredHead">
          <div><span className="kicker">READY TO BUY</span><h2>{trendingSection?.title || "Compare what is worth your money."}</h2>{trendingSection?.body && <p className="sectionLead">{trendingSection.body}</p>}</div>
          <div className="featuredSearch">
            <Search size={17}/>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search iPhone, Samsung, MacBook, audio..."/>
          </div>
        </div>

        <div className="filterToolbar">
          <div className="filterRow premiumFilterRow" role="tablist" aria-label="Filter trending products by category">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              aria-controls="trending-products"
              onClick={() => setCategory(item)}
              className={category === item ? "active" : ""}
            >
              <span>{item}</span>
              <em>{item === "All" ? catalog.length : catalog.filter((product) => product.category === item).length}</em>
            </button>
          ))}
          </div>
          <p className="filterResult" aria-live="polite">{displayProducts.length} {displayProducts.length === 1 ? "product" : "products"} shown{category !== "All" ? ` in ${category}` : ""}</p>
        </div>

        <div id="trending-products" className="premiumProductGrid">
          {displayProducts.map((product) => {
            const inCart = lines.some((line) => line.id === product.id);
            return (
              <article className="premiumProductCard" key={product.id}>
                <div className="premiumProductMedia">
                  {product.badge && <span className="productBadge">{product.badge}</span>}
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
                  </div>
                  <div className={product.stock > 0 ? "premiumStock" : "premiumStock out"}>
                    {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
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
            <Search size={34}/><h3>No match yet.</h3><p>Try another product, brand or category.</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button>
          </div>
        )}
      </section>

      <section className="whySection shell">
        <div className="whyLead">
          <span className="kicker">WHY BUY HERE</span>
          <h2>{trustSection?.title || "Less back-and-forth. More certainty."}</h2>
          <p>{trustSection?.body || "You should not have to message three times just to know the price, condition or next step. The important buying details stay visible."}</p>
        </div>
        <div className="whyGrid">
          <article><span>01</span><ShieldCheck/><h3>Prices you can see</h3><p>Every product displays a price, making it easier to compare options and decide what fits your budget.</p></article>
          <article><span>02</span><Truck/><h3>Details before payment</h3><p>Check condition, warranty, important specs and stock information before you commit your money.</p></article>
          <article><span>03</span><BadgeCheck/><h3>Talk to a real person</h3><p>Call 08103483669 or email techmanamt@gmail.com when you need buying, delivery or order support.</p></article>
        </div>
      </section>

      <section id="creator" className="editorialSection shell">
        <div className="editorialMedia creatorEditorialVisual">
          {siteMedia?.creatorImage && <img className="creatorCmsImage" src={siteMedia.creatorImage} alt="Creator setup" loading="lazy" decoding="async"/>}
          <div className="creatorVisualCore"><Mic2 size={64}/></div>
          <div className="creatorVisualChip creatorChipOne"><Headphones size={22}/> Clean audio</div>
          <div className="creatorVisualChip creatorChipTwo"><Zap size={22}/> Reliable power</div>
          <div className="creatorVisualChip creatorChipThree"><Laptop size={22}/> Edit anywhere</div>
          <span className="editorialTag">CREATOR TOOLS</span>
        </div>
        <div className="editorialCopy">
          <span className="kicker">CREATOR TOOLS</span>
          <h2>{creatorSection?.title || "Make your content sound and look more expensive."}</h2>
          <p>{creatorSection?.body || "Upgrade the problems viewers notice immediately: weak audio, poor lighting, shaky shots, low storage and unreliable power."}</p>
          <div className="editorialChecklist">
            <span><Check/> Wireless microphones</span>
            <span><Check/> Tripods & phone rigs</span>
            <span><Check/> Lighting & streaming gear</span>
            <span><Check/> Storage & power</span>
          </div>
          <Link href="/shop?category=Creator%20Tools" className="primaryBtn">Shop creator upgrades <ArrowRight size={17}/></Link>
        </div>
      </section>

      <section className="insights premiumInsights shell">
        <div className="premiumSectionHead">
          <div><span className="kicker">BEFORE YOU BUY</span><h2>{guidesSection?.title || "Spend with a reason, not just hype."}</h2>{guidesSection?.body && <p className="sectionLead">{guidesSection.body}</p>}</div>
          <Link href="/blog" className="sectionLink">Use the buying guides <ArrowUpRight size={16}/></Link>
        </div>

        <div className="insightGrid">
          {[
            ["01", "Buying Guide", "How to choose a phone for content creation", "Camera, storage, battery and creator workflow.", "/blog/how-to-choose-a-phone-for-content-creation"],
            ["02", "Buying Guide", "Laptop buying guide for work and school", "Choose specs around the work you actually do.", "/blog/laptop-buying-guide-for-work-school-and-creative-use"],
            ["03", "Creator Tips", "A creator’s starter guide to better audio", "Improve clarity before buying more camera gear.", "/blog/creator-audio-starter-guide"],
          ].map(([index, type, title, copy, href]) => (
            <Link href={href} className="insightCard" key={title}>
              <div><span>{index}</span><small>{type}</small></div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <b>Read guide <ArrowUpRight size={15}/></b>
            </Link>
          ))}
        </div>
      </section>

      <section className="homeContactBand shell">
        <div className="homeContactCopy">
          <span className="kicker">NEED A SECOND OPINION?</span>
          <h2>{contactSection?.title || "Before you pay, make sure it is the right device."}</h2><p>{contactSection?.body || "Call 08103483669 or email techmanamt@gmail.com for a quick product recommendation, compatibility check, delivery question or order update."}</p>
        </div>
        <div className="homeContactActions">
          <Link className="contactPrimary" href="/contact">Talk to TechMan AMT <ArrowRight size={17}/></Link>
          {supportLink && <a className="contactSecondary" href={supportLink} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp</a>}
          <Link className="contactSecondary" href="/track-order">Track order</Link>
        </div>
      </section>

      <section className="newsletter premiumNewsletter">
        <div className="shell premiumNewsletterInner">
          <div>
            <span className="kicker">STOCK + PRICE UPDATES</span>
            <h2>{newsletterSection?.title || "Know what just landed before everyone else does."}</h2><p>{newsletterSection?.body || "Get new arrivals, useful price updates, selected offers and buying guides without daily spam."}</p>
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

      {supportLink && <a className="floatingWhatsApp premiumWhatsapp" href={supportLink} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">WA</a>}
    </main>
  );
}
