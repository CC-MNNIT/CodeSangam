import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "../lib/gsap";
import { scrollToTarget } from "../lib/scrollTargets";
import Hero from "./landing/Hero";
import Rift from "./landing/Rift";
import Multiverse from "./landing/Multiverse";
import Finale from "./landing/Finale";

/**
 * The home page is one scroll story: Prologue → Fracture → Multiverse
 * (the five events) → Eye of Agamotto. Each chapter owns its own motion.
 */
export default function LandingPage() {
  const location = useLocation();

  // Layout depends on web fonts and images; re-measure the scroll stages once
  // they have loaded so pin distances are exact.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  // Arriving from another page via the EVENTS link: travel to the events.
  useEffect(() => {
    const target = location.state?.scrollTo as string | undefined;
    if (!target) return;
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToTarget(target, false);
    }, 120);
    return () => window.clearTimeout(id);
  }, [location.state]);

  return (
    <main>
      <Hero />
      <Rift />
      <Multiverse />
      <Finale />
    </main>
  );
}
