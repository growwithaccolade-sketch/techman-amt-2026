import type { Metadata } from "next";
import Link from "next/link";
import CommerceHeader from "@/components/commerce-header";
import { articles } from "@/lib/articles";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Buying Guides", description: "Clear guides for choosing phones, laptops, microphones and other tech based on what you actually use them for." };

const fallback = {
  slug: "blog",
  eyebrow: "BUYING GUIDES",
  title: "Not sure which one to buy?",
  intro: "Start with what you want to do. These guides explain what matters for common needs like school, office work, editing, coding, TikTok, YouTube, interviews and podcasts.",
  sections: [],
};

export default async function BlogPage() {
  const page = await getEditablePage("blog", fallback);
  return <><CommerceHeader/><main className="blogPage shell"><section className="catalogHero"><span className="kicker">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></section><div className="blogGrid">{articles.map((article, index) => <Link className="blogCard" href={`/blog/${article.slug}`} key={article.slug}><span>0{index + 1} · {article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p><b>{article.readTime}</b></Link>)}</div></main></>;
}
