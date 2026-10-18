// The four CodeSangam events. Copy is exactly as it has always been on the
// site; the redesign only adds a universe tint and a rune per event.
export type GlyphKind = "web" | "android" | "ml" | "java";

export interface EventInfo {
  tag: "webster" | "droidrush" | "logicalrhythm" | "softablitz";
  name: string;
  description: string;
  teamSize: string;
  /** Problem statement PDF. */
  url: string;
  /** Universe colour as an "r g b" triple (used as the --tint variable). */
  tint: string;
  glyph: GlyphKind;
}

export const EVENTS: EventInfo[] = [
  {
    tag: "webster",
    name: "Webster",
    description:
      "Webster is a web development-focused event, emphasizing the enhancement of participants' skills in creating web applications. It provides opportunities for individuals to learn about web technologies, frameworks, and best practices in the field.",
    teamSize: "Team Size: (1 - 3)",
    url: "https://drive.google.com/file/d/157tZ5X-MfVmQTELCBQ77SzYvEiyATXxc/view?usp=sharing",
    tint: "167 139 250",
    glyph: "web",
  },
  {
    tag: "droidrush",
    name: "Droidrush",
    description:
      "Droidrush is an event centered around Android development, where participants can delve into the world of Android app development. This event offers hands-on experience in building Android applications, exploring the Android ecosystem, and understanding mobile app design principles.",
    teamSize: "Team Size: (1 - 3)",
    url: "https://drive.google.com/file/d/1lQYPfDyKZVteoXBPBeESm1jCIbjjc-wK/view?usp=sharing",
    tint: "78 234 168",
    glyph: "android",
  },
  {
    tag: "logicalrhythm",
    name: "Logical Rhythm",
    description:
      "Logical Rythm is a machine learning event that empowers participants with essential knowledge and skills in data analysis, algorithm development, and model training. This event equips attendees with a strong foundation in artificial intelligence and data science, preparing them for exciting opportunities in these fields.",
    teamSize: "Team Size: (1 - 3)",
    url: "https://drive.google.com/file/d/1lQCNaj1nuxRVK5tpn-yXf7shDlhGY-tS/view?usp=sharing",
    tint: "246 107 125",
    glyph: "ml",
  },
  {
    tag: "softablitz",
    name: "Softablitz",
    description:
      "Softablitz is a software development event open to every tech stack, where participants build an application in whichever language and framework suits their idea best. It offers hands-on experience in designing, developing and shipping a complete, working piece of software with the tools of their choice.",
    teamSize: "Team Size: (1 - 3)",
    url: "https://drive.google.com/file/d/1XTy5r8hh_XRLu-j64Q5jGa_sjuBCgKTS/view?usp=sharing",
    tint: "255 179 71",
    glyph: "java",
  },
];
