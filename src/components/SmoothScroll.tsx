"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lenisInstance: any = null;
    let tickerHandler: ((time: number) => void) | null = null;

    const initLenis = async () => {
      try {
        const LenisModule = await import("@studio-freight/lenis");
        const Lenis = LenisModule.default || LenisModule;

        lenisInstance = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.4,
        });

        gsap.registerPlugin(ScrollTrigger);

        lenisInstance.on("scroll", ScrollTrigger.update);

        tickerHandler = (time: number) => {
          lenisInstance?.raf(time * 1000);
        };
        gsap.ticker.add(tickerHandler);
        gsap.ticker.lagSmoothing(0);
      } catch (err) {
        console.warn("Smooth scroll initialization:", err);
      }
    };

    initLenis();

    return () => {
      if (tickerHandler) gsap.ticker.remove(tickerHandler);
      if (lenisInstance) lenisInstance.destroy?.();
    };
  }, []);

  return null;
}
