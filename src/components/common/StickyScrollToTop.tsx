import React, { useState, useEffect } from "react";
import { ICONS } from "@agensy/constants";

export const StickyScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrollContainer = document.querySelector(
        ".overflow-y-auto.h-\\[100dvh\\].max-h-\\[calc\\(100dvh-50px\\)\\].md\\:max-h-\\[calc\\(100dvh\\)\\].w-full.px-4.py-6"
      ) as HTMLElement;

      if (scrollContainer) {
        const scrolled = scrollContainer.scrollTop;
        setVisible(scrolled > 300);
      } else {
        const scrolled = document.documentElement.scrollTop;
        setVisible(scrolled > 300);
      }
    };

    const scrollContainer = document.querySelector(
      ".overflow-y-auto.h-\\[100dvh\\].max-h-\\[calc\\(100dvh-50px\\)\\].md\\:max-h-\\[calc\\(100dvh\\)\\].w-full.px-4.py-6"
    ) as HTMLElement;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", toggleVisible);
      toggleVisible();

      return () => {
        scrollContainer.removeEventListener("scroll", toggleVisible);
      };
    } else {
      window.addEventListener("scroll", toggleVisible);
      toggleVisible();

      return () => {
        window.removeEventListener("scroll", toggleVisible);
      };
    }
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(
      ".overflow-y-auto.h-\\[100dvh\\].max-h-\\[calc\\(100dvh-50px\\)\\].md\\:max-h-\\[calc\\(100dvh\\)\\].w-full.px-4.py-6"
    ) as HTMLElement;

    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!visible) return null;

  return (
    <div
      onClick={scrollToTop}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] bg-primaryColor hover:bg-primaryColor/90 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center cursor-pointer"
      style={{ zIndex: 9999 }}
      title="Back to top"
    >
      <ICONS.rightArrow className="w-4 h-4 sm:w-5 sm:h-5 rotate-[-90deg]" />
    </div>
  );
};
