import type { Metadata } from "next";
import Link from "next/link";
import CommerceHeader from "@/components/commerce-header";
import { articles } from "@/lib/articles";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Tech Insights", description: "Practical technology buying guides and creator tips from TechMan AMT." };

const fallback = {
  slug: "blog",
  eyebrow: "TECHMAN INSIGHTS",
  title: "Buy with more context.",
  intro: "Guides focused on the decisions behind the purchase: use case, compatibility, workflow and total setup cost.",
  sections: [],
};

export default async function BlogPage() {
  const page = await getEditablePage("blog", fallback);
  return <><CommerceHeader/><main className="blogPage shell"><section className="catalogHero"><span className="kicker">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p></section><div className="blogGrid">{articles.map((article, index) => <Link className="blogCard" href={`/blog/${article.slug}`} key={article.slug}><span>0{index + 1} · {article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p><b>{article.readTime}</b></Link>)}</div></main></>;
}
