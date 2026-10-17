// The five CodeSangam events. Copy is exactly as it has always been on the
// site; the redesign only adds a universe tint and a rune per event.
export type GlyphKind = "web" | "android" | "ml" | "java" | "opensource";

export interface EventInfo {
  tag: "webster" | "droidrush" | "logicalrhythm" | "softablitz" | "contrihub";
  name: string;
  description: string;
  teamSize: string;
  /** Problem statement PDF, or the event website for ContriHub. */
  url: string;
  /** "Website Coming Soon!" instead of a Problem Statement link. */
  comingSoon?: boolean;
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
    url: "https://drive.google.com/file/d/1P3cOWOxf1OcV-lmndjQ0TpqY7J8IF3SZ/view?usp=sharing",
    tint: "167 139 250",
    glyph: "web",
  },
  {
    tag: "droidrush",
    name: "Droidrush",
    description:
      "Droidrush is an event centered around Android development, where participants can delve into the world of Android app development. This event offers hands-on experience in building Android applications, exploring the Android ecosystem, and understanding mobile app design principles.",
    teamSize: "Team Size: (1 - 3)",
    url: "https://drive.google.com/file/d/16O2h3LMt7-w9JcROEbyH8I-wG5D_7kQK/view?usp=sharing",
    tint: "78 234 168",
    glyph: "android",
  },
  {
    tag: "logicalrhythm",
    name: "Logical Rhythm",
    description:
      "Logical Rythm is a machine learning event that empowers participants with essential knowledge and skills in data analysis, algorithm development, and model training. This event equips attendees with a strong foundation in artificial intelligence and data science, preparing them for exciting opportunities in these fields.",
    teamSize: "Team Size: (1 - 3)",
    url: "https://drive.google.com/file/d/170b4iwsQ52g6KXd1FfdVvO-eSShPuKig/view?usp=sharing",
    tint: "246 107 125",
    glyph: "ml",
  },
  {
    tag: "softablitz",
    name: "Softablitz",
    description:
      "Softablitz is a Java Desktop Development event that immerses participants in the world of desktop application creation using the Java programming language. It provides hands-on experience, helping participants refine their Java skills while designing and developing powerful desktop software.",
    teamSize: "Team Size: (1 - 3)",
    url: "https://drive.google.com/file/d/1ejg-EFY2Z_vcuYSToop8LE8EqYdPy-ET/view?usp=sharing",
    tint: "255 179 71",
    glyph: "java",
  },
  {
    tag: "contrihub",
    name: "ContriHub",
    description:
      "ContriHub is an event focused on open-source development, aligning with Hacktoberfest. It encourages participants to contribute to open-source projects, fostering collaboration within the open-source community. Participants can gain experience in coding, issue tracking, and open-source contribution during this event.",
    teamSize: "Team Size: 1",
    url: "https://computercodingclub.in/contrihub/",
    comingSoon: true,
    tint: "76 199 245",
    glyph: "opensource",
  },
];
