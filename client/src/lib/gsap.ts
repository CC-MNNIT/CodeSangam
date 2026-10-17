import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The single place GSAP plugins are registered. Import from here, never from
// "gsap" directly, so ScrollTrigger is always available.
gsap.registerPlugin(ScrollTrigger);

// Keep scroll-linked layout stable on mobile browsers whose toolbars resize
// the viewport while scrolling.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
