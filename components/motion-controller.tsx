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
  ".relatedCard",
].join(",");

const magneticSelector = [
  ".heroPrimary",
  ".primaryBtn",
  ".lightBtn",
  ".contactPrimary",
  ".premiumAddButton",
  ".sectionLink",
  ".premiumDetailButton",
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
    let scrollRaf = 0;
    let pointerRaf = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const renderScroll = () => {
      scrollRaf = 0;
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
      root.style.setProperty("--hero-parallax", `${Math.min(54, y * 0.06)}px`);
      root.style.setProperty("--hero-copy-parallax", `${Math.min(24, y * 0.025)}px`);
      root.style.setProperty("--hero-scale", String(Math.max(.965, 1 - y * .000045)));
      body.classList.toggle("siteScrolled", y > 18);
      body.classList.toggle("scrollingDown", delta > 1);
      body.classList.toggle("scrollingUp", delta < -1);
    };

    const onScroll = () => {
      if (!scrollRaf) scrollRaf = window.requestAnimationFrame(renderScroll);
    };

    const renderPointer = () => {
      pointerRaf = 0;
      const nx = pointerX / Math.max(1, window.innerWidth);
      const ny = pointerY / Math.max(1, window.innerHeight);
      root.style.setProperty("--pointer-x", nx.toFixed(4));
      root.style.setProperty("--pointer-y", ny.toFixed(4));
      root.style.setProperty("--pointer-px", `${pointerX}px`);
      root.style.setProperty("--pointer-py", `${pointerY}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!pointerRaf) pointerRaf = window.requestAnimationFrame(renderPointer);
    };

    renderScroll();
    renderPointer();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!reduced && finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });

    const registered = new Set<HTMLElement>();
    let observer: IntersectionObserver | null = null;

    const registerReveal = (element: HTMLElement, index: number) => {
      if (registered.has(element)) return;
      registered.add(element);
      element.classList.add("revealItem");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
      element.style.setProperty("--reveal-order", String(index % 7));

      if (reduced || element.getBoundingClientRect().top < window.innerHeight * 0.94) {
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
        { threshold: 0.07, rootMargin: "0px 0px -5% 0px" }
      );
    }

    const revealQuery = revealSelectors.join(",");
    const scanReveals = (rootNode: ParentNode, startIndex = 0) => {
      rootNode
        .querySelectorAll<HTMLElement>(revealQuery)
        .forEach((element, index) => registerReveal(element, startIndex + index));
    };
    scanReveals(document);

    const cleanups: Array<() => void> = [];

    if (!reduced && finePointer) {
      document.querySelectorAll<HTMLElement>(tiltSelector).forEach((element) => {
        element.classList.add("motionTilt");

        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
          const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)));
          element.style.setProperty("--tilt-x", `${((.5 - y) * 5.5).toFixed(2)}deg`);
          element.style.setProperty("--tilt-y", `${((x - .5) * 6.5).toFixed(2)}deg`);
          element.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
          element.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
        };
        const leave = () => {
          element.style.setProperty("--tilt-x", "0deg");
          element.style.setProperty("--tilt-y", "0deg");
          element.style.setProperty("--glow-x", "50%");
          element.style.setProperty("--glow-y", "50%");
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", leave);
        });
      });

      document.querySelectorAll<HTMLElement>(magneticSelector).forEach((element) => {
        element.classList.add("motionMagnetic");
        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          element.style.setProperty("--mag-x", `${(dx * .08).toFixed(2)}px`);
          element.style.setProperty("--mag-y", `${(dy * .10).toFixed(2)}px`);
        };
        const leave = () => {
          element.style.setProperty("--mag-x", "0px");
          element.style.setProperty("--mag-y", "0px");
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", leave);
        });
      });
    }

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
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (pointerRaf) cancelAnimationFrame(pointerRaf);
      observer?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      cleanups.forEach((cleanup) => cleanup());
      progress.remove();
      root.classList.remove("motionReady");
      ["--scroll-y","--scroll-progress","--scroll-velocity","--hero-parallax","--hero-copy-parallax","--hero-scale","--pointer-x","--pointer-y","--pointer-px","--pointer-py"].forEach((name) => root.style.removeProperty(name));
    };
  }, []);

  return null;
}
