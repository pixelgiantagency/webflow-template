import type { gsap as gsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type { ScrollSmoother as ScrollSmootherType } from "gsap/ScrollSmoother";
import type { SplitText as SplitTextType } from "gsap/SplitText";
import type { Observer as ObserverType } from "gsap/Observer";
import type { CustomEase as CustomEaseType } from "gsap/CustomEase";

declare global {
  const gsap: typeof gsapType;
  const ScrollTrigger: typeof ScrollTriggerType;
  const ScrollSmoother: typeof ScrollSmootherType;
  const SplitText: typeof SplitTextType;
  const Observer: typeof ObserverType;
  const CustomEase: typeof CustomEaseType;

  interface Window {
    fsAttributes: unknown[];
  }
}

export {};
