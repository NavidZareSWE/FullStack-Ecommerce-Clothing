import { useEffect } from "react";

// Watches every element with a `data-reveal` attribute (including ones added
// later by React) and adds `is-revealed` the first time it scrolls into view.
// The hiding CSS only applies under `.js-reveal`, so content stays visible if
// IntersectionObserver is unavailable.
const useRevealOnScroll = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window))
      return;
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 },
    );

    const observeAll = (node) => {
      if (!(node instanceof Element)) return;
      if (node.matches("[data-reveal]:not(.is-revealed)")) io.observe(node);
      node
        .querySelectorAll("[data-reveal]:not(.is-revealed)")
        .forEach((el) => io.observe(el));
    };
    observeAll(document.body);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) m.addedNodes.forEach(observeAll);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);
};

export default useRevealOnScroll;
