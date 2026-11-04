import { useEffect, useState } from "react";

// Hides the sticky header while scrolling down and brings it back as soon as
// the user scrolls up, giving small screens more room for content. The header
// always stays visible near the top of the page and while it contains focus.
const useHideOnScroll = (ref, { offset = 120, tolerance = 6 } = {}) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      const header = ref.current;
      const hasFocus = header?.contains(document.activeElement);
      const scrollLocked = document.body.style.overflow === "hidden";

      if (y < offset || hasFocus || scrollLocked) setHidden(false);
      else if (delta > tolerance) setHidden(true);
      else if (delta < -tolerance) setHidden(false);

      if (Math.abs(delta) > tolerance) lastY = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    // Keyboard users tabbing into the header should always see it
    const onFocusIn = (e) => {
      if (ref.current?.contains(e.target)) setHidden(false);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocusIn);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [ref, offset, tolerance]);

  return hidden;
};

export default useHideOnScroll;
