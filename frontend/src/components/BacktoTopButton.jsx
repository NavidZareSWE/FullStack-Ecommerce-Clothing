import { useEffect, useState } from "react";
import style from "./BacktoTopButton.module.css";
import { prefersReducedMotion } from "../utils/motion";

const BacktoTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > 300) {
          setShowButton(true);
        } else {
          setShowButton(false);
        }
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const scrollToTop = (e) => {
    e.preventDefault();
    const reduceMotion = prefersReducedMotion();
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    // Keep keyboard focus at the top of the page as well
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`${style.ScrollToTop} ${showButton ? style.show : ""}`}
      aria-label="Back to top"
      tabIndex={showButton ? 0 : -1}
      aria-hidden={!showButton}
    >
      <img src="/Arrow_Up.svg" alt="" width="28" height="28" />
    </button>
  );
};

export default BacktoTopButton;
