import { route } from "../Utils/Config";
import SlingRing from "../ui/art/SlingRing";
import Fracture from "../ui/art/Fracture";
import GlyphButton from "../ui/GlyphButton";

/** The Void: a portal that failed to hold. */
const ErrorPage = () => {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-6 text-center [--tint:148_163_184]">
      <Fracture
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        tint="139 92 246"
        seed={9}
      />

      <div className="relative w-[min(86vw,34rem)]">
        <SlingRing tint="148 163 184" broken className="w-full" />
        <div className="absolute inset-0 grid place-items-center">
          <h1 className="font-display text-[clamp(4.5rem,17vw,9rem)] font-semibold leading-none tracking-[0.06em] text-bone-50 text-glow motion-safe:animate-flicker">
            404
          </h1>
        </div>
      </div>

      <div className="relative z-10 -mt-4 flex flex-col items-center gap-9">
        <p className="max-w-md font-display text-[clamp(1.05rem,2.6vw,1.45rem)] uppercase leading-relaxed tracking-[0.16em] text-bone-200">
          The page you are looking for has been lost in space.
        </p>
        <GlyphButton to={route()} tone="tint" size="lg">
          Go Back Home
        </GlyphButton>
      </div>
    </main>
  );
};

export default ErrorPage;
