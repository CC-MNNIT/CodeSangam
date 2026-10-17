import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

interface Spark {
  x: number;
  y: number;
  z: number; // depth 0.25 (far) … 1 (near)
  vx: number;
  vy: number;
  r: number;
  phase: number;
  violet: boolean;
}

/** Pre-render one soft glow so each spark is a single drawImage call. */
function glowSprite(rgb: string) {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(0.18, `rgba(${rgb},0.85)`);
  grad.addColorStop(0.5, `rgba(${rgb},0.18)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return c;
}

/**
 * Rising embers from the sling ring. A small, depth-sorted particle field on
 * one canvas: capped DPR, sprite-based, paused when the tab is hidden, and a
 * single still frame under `prefers-reduced-motion`.
 */
export default function SparkField({ className = "" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gold = glowSprite("255,176,70");
    const violet = glowSprite("176,140,255");
    let w = 0;
    let h = 0;
    let sparks: Spark[] = [];
    let raf = 0;
    let last = performance.now();

    const seed = () => {
      const count = w < 768 ? 24 : 46;
      sparks = Array.from({ length: count }, () => {
        const z = 0.25 + Math.random() * 0.75;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 6 * z,
          vy: -(6 + Math.random() * 22) * z,
          r: (2.4 + Math.random() * 7) * z,
          phase: Math.random() * Math.PI * 2,
          violet: Math.random() > 0.82,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const scroll = window.scrollY;
      for (const s of sparks) {
        s.x += s.vx * dt + Math.sin(s.phase) * 4 * dt;
        s.y += s.vy * dt;
        s.phase += dt * (0.6 + s.z);
        if (s.y < -20) {
          s.y = h + 20;
          s.x = Math.random() * w;
        }
        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;
        // Near sparks slide faster than far ones as the page scrolls.
        const py = (((s.y - scroll * 0.22 * s.z) % (h + 40)) + (h + 40)) % (h + 40) - 20;
        const twinkle = 0.55 + 0.45 * Math.sin(s.phase * 2.3);
        ctx.globalAlpha = Math.min(1, 0.2 + 0.6 * s.z) * twinkle;
        const size = s.r * 2;
        ctx.drawImage(s.violet ? violet : gold, s.x - size / 2, py - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce.matches || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotion = () => {
      stop();
      if (reduce.matches) draw(0);
      else start();
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", onMotion);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onMotion);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
