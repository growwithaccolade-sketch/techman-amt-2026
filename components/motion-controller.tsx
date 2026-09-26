"use client";

import { useEffect } from "react";

const revealSelectors = [
  "main > section",
  "main > div",
  ".premiumHeroCopy > *",
  ".heroStage",
  ".brandRail > span",
  ".premiumSectionHead",
  ".collectionTile",
  ".premiumDealCopy > *",
  ".dealFeatureItem",
  ".premiumProductCard",
  ".whyLead",
  ".whyGrid article",
  ".editorialMedia",
  ".editorialCopy > *",
  ".insightCard",
  ".homeContactBand > *",
  ".premiumNewsletterInner > *",
  ".contactHero > *",
  ".contactCards article",
  ".catalogHero > *",
  ".catalogControls",
  ".catalogPremiumGrid .premiumProductCard",
  ".productHero > *",
  ".specSection > *",
  ".reviewsSection > *",
  ".relatedCard",
  ".pageIntro > *",
  ".cartLine",
  ".orderSummary",
  ".formSection",
  ".couponBox",
  ".secureNote",
  ".accountCard",
  ".accountOrder",
  ".infoHero > *",
  ".infoContent > section",
  ".infoAside",
  ".leadHero > *",
  ".leadLayout > *",
  ".catalogMeta",
  ".reviewsLayout > *",
  ".relatedSection .sectionHead",
  ".premiumFooterTop > div",
  ".premiumCopyright > *",
];

const tiltSelector = [
  ".heroStageMain",
  ".heroMiniCard",
  ".premiumProductCard",
  ".collectionTile",
  ".insightCard",
  ".contactCards article",
  ".creatorEditorialVisual",
].join(",");

const magneticSelector = [
  ".heroPrimary",
  ".premiumAddButton",
  ".premiumDetailButton",
  ".contactPrimary",
  ".contactSecondary",
  ".lightBtn",
  ".primaryBtn",
  ".buyNowAction",
].join(",");

export default function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    root.classList.add("motionReady");

    const progress = document.createElement("div");
    progress.className = "scrollProgress";
    body.appendChild(progress);

    let lastScrollY = window.scrollY;
    let velocity = 0;
    let raf = 0;

    const renderScroll = () => {
      raf = 0;
      const y = window.scrollY;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, y / max));
      const delta = y - lastScrollY;
      velocity = velocity * 0.72 + delta * 0.28;
      lastScrollY = y;

      progress.style.transform = `scaleX(${ratio})`;
      root.style.setProperty("--scroll-y", `${y}px`);
      root.style.setProperty("--scroll-progress", ratio.toFixed(4));
      root.style.setProperty("--scroll-velocity", Math.max(-36, Math.min(36, velocity)).toFixed(2));
      root.style.setProperty("--hero-parallax", `${Math.min(34, y * 0.045)}px`);
      body.classList.toggle("siteScrolled", y > 18);
      body.classList.toggle("scrollingDown", delta > 1);
      body.classList.toggle("scrollingUp", delta < -1);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(renderScroll);
    };

    renderScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const registered = new Set<HTMLElement>();
    let observer: IntersectionObserver | null = null;

    const registerReveal = (element: HTMLElement, index: number) => {
      if (registered.has(element)) return;
      registered.add(element);
      element.classList.add("revealItem");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 45}ms`);
      element.style.setProperty("--reveal-order", String(index % 6));

      if (reduced || element.getBoundingClientRect().top < window.innerHeight * 0.92) {
        element.classList.add("isRevealed");
      } else {
        observer?.observe(element);
      }
    };

    if (!reduced) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            element.classList.add("isRevealed");
            observer?.unobserve(element);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
      );
    }

    const revealQuery = revealSelectors.join(",");
    const scanReveals = (rootNode: ParentNode, startIndex = 0) => {
      rootNode
        .querySelectorAll<HTMLElement>(revealQuery)
        .forEach((element, index) => registerReveal(element, startIndex + index));
    };
    scanReveals(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(revealQuery)) registerReveal(node, registered.size);
          scanReveals(node, registered.size);
        });
      });
    });
    mutationObserver.observe(body, { childList: true, subtree: true });

    const cleanups: Array<() => void> = [];

    if (!reduced && finePointer) {
      const onGlobalPointer = (event: PointerEvent) => {
        const nx = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
        const ny = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
        root.style.setProperty("--cursor-nx", nx.toFixed(4));
        root.style.setProperty("--cursor-ny", ny.toFixed(4));
      };
      window.addEventListener("pointermove", onGlobalPointer, { passive: true });
      cleanups.push(() => window.removeEventListener("pointermove", onGlobalPointer));

      document.querySelectorAll<HTMLElement>(tiltSelector).forEach((target) => {
        const move = (event: PointerEvent) => {
          const rect = target.getBoundingClientRect();
          const px = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
          const py = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
          target.style.setProperty("--mx", `${event.clientX - rect.left}px`);
          target.style.setProperty("--my", `${event.clientY - rect.top}px`);
          target.style.setProperty("--tilt-x", `${((0.5 - py) * 1.6).toFixed(2)}deg`);
          target.style.setProperty("--tilt-y", `${((px - 0.5) * 2).toFixed(2)}deg`);
          target.style.setProperty("--pointer-px", px.toFixed(3));
          target.style.setProperty("--pointer-py", py.toFixed(3));
        };
        const leave = () => {
          target.style.setProperty("--tilt-x", "0deg");
          target.style.setProperty("--tilt-y", "0deg");
          target.style.setProperty("--pointer-px", ".5");
          target.style.setProperty("--pointer-py", ".5");
        };
        target.addEventListener("pointermove", move);
        target.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          target.removeEventListener("pointermove", move);
          target.removeEventListener("pointerleave", leave);
        });
      });

      document.querySelectorAll<HTMLElement>(magneticSelector).forEach((target) => {
        const move = (event: PointerEvent) => {
          const rect = target.getBoundingClientRect();
          const x = (event.clientX - rect.left - rect.width / 2) * 0.035;
          const y = (event.clientY - rect.top - rect.height / 2) * 0.04;
          target.style.setProperty("--mag-x", `${x.toFixed(2)}px`);
          target.style.setProperty("--mag-y", `${y.toFixed(2)}px`);
        };
        const leave = () => {
          target.style.setProperty("--mag-x", "0px");
          target.style.setProperty("--mag-y", "0px");
        };
        target.addEventListener("pointermove", move);
        target.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          target.removeEventListener("pointermove", move);
          target.removeEventListener("pointerleave", leave);
        });
      });
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("a,button");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--press-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--press-y", `${event.clientY - rect.top}px`);
      target.classList.remove("motionPressed");
      requestAnimationFrame(() => target.classList.add("motionPressed"));
      window.setTimeout(() => target.classList.remove("motionPressed"), 420);
    };
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onPointerDown);
      cleanups.forEach((cleanup) => cleanup());
      progress.remove();
      root.classList.remove("motionReady");
      root.style.removeProperty("--scroll-y");
      root.style.removeProperty("--scroll-progress");
      root.style.removeProperty("--scroll-velocity");
      root.style.removeProperty("--hero-parallax");
      root.style.removeProperty("--cursor-nx");
      root.style.removeProperty("--cursor-ny");
    };
  }, []);

  return null;
}
