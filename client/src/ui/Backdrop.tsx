import Mandala from "./art/Mandala";
import SparkField from "./SparkField";

/**
 * The fixed world behind every page: void gradient, tinted nebula, a vast
 * faint mandala, embers, vignette and film grain. Everything here is static
 * except the ember canvas, so it costs nothing while scrolling.
 * `--tint` (set by the route) colours the nebula.
 */
export default function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void-950"
    >
      <div className="absolute inset-0 bg-void-wash" />

      <div className="absolute -left-[12vmax] -top-[18vmax] h-[62vmax] w-[62vmax] rounded-full bg-[radial-gradient(closest-side,rgb(var(--tint)/0.16),transparent)]" />
      <div className="absolute -bottom-[22vmax] -right-[14vmax] h-[66vmax] w-[66vmax] rounded-full bg-[radial-gradient(closest-side,rgb(91_39_194/0.3),transparent)]" />

      <div className="absolute left-1/2 top-1/2 w-[150vmin] -translate-x-1/2 -translate-y-1/2 text-arcane-300 opacity-[0.07]">
        <Mandala spin={false} />
      </div>

      <SparkField className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_45%,#05030a_100%)]" />
      <div className="absolute inset-0 bg-grain opacity-[0.035]" />
    </div>
  );
}
