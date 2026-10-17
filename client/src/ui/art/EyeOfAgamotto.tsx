import { useId } from "react";

interface Props {
  className?: string;
}

const C = 200;
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};

/**
 * The Eye of Agamotto. The two eyelids carry `data-lid="top|bottom"` and the
 * iris group `data-iris`, so a scroll timeline can open the eye; with no
 * animation attached the eye is simply open.
 */
export default function EyeOfAgamotto({ className = "" }: Props) {
  const uid = useId().replace(/:/g, "");
  const almond = "M52 200Q200 70 348 200Q200 330 52 200Z";

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={`${uid}-clip`}>
          <path d={almond} />
        </clipPath>
        <radialGradient id={`${uid}-iris`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#05030a" />
          <stop offset="0.3" stopColor="#0b4f3a" />
          <stop offset="0.62" stopColor="#25cf8f" />
          <stop offset="0.9" stopColor="#8ff5c9" />
          <stop offset="1" stopColor="#25cf8f" />
        </radialGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#4eeaa8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#4eeaa8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe3b8" />
          <stop offset="0.5" stopColor="#ffb347" />
          <stop offset="1" stopColor="#a84d05" />
        </linearGradient>
      </defs>

      {/* Amulet frame */}
      <circle cx={C} cy={C} r="196" stroke={`url(#${uid}-gold)`} strokeWidth="3" />
      <circle cx={C} cy={C} r="186" stroke="#ffb347" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="1 5" />
      <circle cx={C} cy={C} r="170" stroke={`url(#${uid}-gold)`} strokeWidth="1.4" />
      {Array.from({ length: 48 }, (_, i) => {
        const [x1, y1] = polar(172, i * 7.5);
        const [x2, y2] = polar(i % 4 === 0 ? 184 : 178, i * 7.5);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffb347" strokeOpacity={i % 4 === 0 ? 0.9 : 0.45} strokeWidth="1.4" />;
      })}
      {/* Radiating points of the amulet */}
      {Array.from({ length: 8 }, (_, i) => {
        const [x1, y1] = polar(150, i * 45 - 8);
        const [x2, y2] = polar(150, i * 45 + 8);
        const [tx, ty] = polar(110, i * 45);
        return <polygon key={i} points={`${x1},${y1} ${tx},${ty} ${x2},${y2}`} stroke="#ffb347" strokeOpacity="0.5" strokeWidth="1" />;
      })}

      {/* Light behind the eye */}
      <circle cx={C} cy={C} r="150" fill={`url(#${uid}-glow)`} />

      {/* The eye */}
      <path d={almond} fill="#05030a" stroke={`url(#${uid}-gold)`} strokeWidth="3" />
      <g clipPath={`url(#${uid}-clip)`}>
        <g data-iris style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx={C} cy={C} r="66" fill={`url(#${uid}-iris)`} />
          <circle cx={C} cy={C} r="66" stroke="#8ff5c9" strokeOpacity="0.7" strokeWidth="1.4" />
          <circle cx={C} cy={C} r="54" stroke="#05030a" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 4" />
          {Array.from({ length: 24 }, (_, i) => {
            const [x1, y1] = polar(30, i * 15);
            const [x2, y2] = polar(62, i * 15);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8ff5c9" strokeOpacity="0.28" strokeWidth="1" />;
          })}
          <circle cx={C} cy={C} r="22" fill="#05030a" />
          <circle cx="188" cy="188" r="6" fill="#fff" fillOpacity="0.85" />
        </g>
        {/* Eyelids: open by default, closed by translating toward the middle */}
        <path data-lid="top" transform="translate(0 -150)" d="M0 -80H400V196Q200 262 0 196Z" fill="#0a0612" />
        <path data-lid="bottom" transform="translate(0 150)" d="M0 480H400V204Q200 138 0 204Z" fill="#0a0612" />
      </g>
      {/* Lid lines that stay on the almond */}
      <path d="M52 200Q200 70 348 200" stroke="#ffb347" strokeOpacity="0.4" strokeWidth="1" transform="translate(0 -9)" />
      <path d="M52 200Q200 330 348 200" stroke="#ffb347" strokeOpacity="0.4" strokeWidth="1" transform="translate(0 9)" />
    </svg>
  );
}
