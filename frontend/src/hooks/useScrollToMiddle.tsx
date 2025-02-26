"use client";
import { useEffect } from "react";

const useScrollToMiddle = (
  leftPercent: number = 50,
  topPercent: number = 50
) => {
  useEffect(() => {
    const scrollToMiddle = () => {
      const middleY =
        document.documentElement.scrollHeight * (topPercent / 100) -
        window.innerHeight * (topPercent / 100);
      const middleX =
        document.documentElement.scrollWidth * (leftPercent / 100) -
        window.innerWidth * (leftPercent / 100);

      window.scrollTo({ top: middleY, left: middleX, behavior: "smooth" });
    };

    const handleLoad = () => setTimeout(scrollToMiddle, 500);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [leftPercent, topPercent]);
};

export default useScrollToMiddle;
