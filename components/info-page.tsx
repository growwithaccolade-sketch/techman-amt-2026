import CommerceHeader from "@/components/commerce-header";
import Link from "next/link";

export type InfoSection = { title: string; body: string; points?: string[] };

export default function InfoPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: InfoSection[] }) {
  return (
    <>
      <CommerceHeader/>
      <main className="infoPage shell">
        <section className="infoHero"><span className="kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></section>
        <div className="infoLayout">
          <article className="infoContent">{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p>{section.points?.length ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}</section>)}</article>
          <aside className="infoAside"><span className="kicker">NEED A HUMAN ANSWER?</span><h3>Ask before you spend.</h3><p>For product, delivery or order questions, call 08103483669 or email techmanamt@gmail.com.</p><a className="primaryBtn" href="tel:08103483669">Call TechMan AMT</a><a className="secondaryAction" href="mailto:techmanamt@gmail.com">Send email</a><Link className="secondaryAction" href="/track-order">Track an order</Link></aside>
        </div>
      </main>
    </>
  );
}
