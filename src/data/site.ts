export const site = {
  title: "Adrian Sevitz - Director, CTO, Nerd",
  description:
    "Adrian Sevitz: founder, CTO and technology director. Building technology businesses, and the teams behind them.",

  nav: [
    { label: "CV", href: "/cv/" },
    { label: "Thoughts", href: "/thoughts-about/" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    firstName: "Adrian",
    lastName: "Sevitz",
    wordmark: "Sev",
    taglinePhrases: [
      "Technical and Product Leader",
      "I build technology businesses, and the teams behind them",
      "Once edited a script with Oliver Stone",
      "Founder turned CTO. Happiest where technology has clear business value",
    ],
    // Spare phrases, swap any of these into taglinePhrases above:
    //   "Experience from Startups to Scale-ups to Enterprises"
    //   "Using technology to solve problems that actually matter"
    taglineSeconds: 3.2,

    // Background photo(s) behind the hero. `focus` is a CSS background-position.
    // `status` (optional, defaults to "show"):
    //   "show":   in the rotation
    //   "skip":   never shown
    //   "hold":   if any photo is on hold, only held photos are shown (show is then ignored)
    //   "delete": never shown, and flagged for removal: ask Claude to remove the flagged
    //             photos (file and line) on the next hero update
    // See every photo, its crop and its status at /hero-images/ (unlinked, noindex).
    images: [
      { src: "/img/header-bg.jpg", focus: "70% 30%", status: "show" },
      { src: "/img/hero/adrian-portrait.webp", focus: "50% 38%", status: "show" },
      { src: "/img/hero/thames-sunset.webp", focus: "50% 45%", status: "show" },
      { src: "/img/hero/misty-park-morning.webp", focus: "65% 40%", status: "show" },
      { src: "/img/hero/forest-rainbow.webp", focus: "60% 54%", status: "show" },
      { src: "/img/hero/frosted-grass.webp", focus: "50% 60%", status: "show" },
      { src: "/img/hero/sunrise-above-clouds.webp", focus: "70% 42%", status: "show" },
      { src: "/img/hero/savanna-sunset.webp", focus: "50% 45%", status: "show" },
      { src: "/img/hero/sea-turtle.webp", focus: "65% 30%", status: "show" },
      { src: "/img/hero/kruger-elephant.webp", focus: "60% 35%", status: "show" },
      { src: "/img/hero/kruger-cheetah.webp", focus: "65% 55%", status: "show" },
      { src: "/img/hero/kruger-eagle.webp", focus: "40% 30%", status: "show" },
      { src: "/img/hero/kruger-roller.webp", focus: "40% 25%", status: "show" },
      { src: "/img/hero/kruger-weaver.webp", focus: "60% 55%", status: "show" },
      { src: "/img/hero/kruger-rock-trees.webp", focus: "50% 40%", status: "show" },
      { src: "/img/hero/kruger-sunset.webp", focus: "65% 50%", status: "show" },
      { src: "/img/hero/oslo-harbour-sunset.webp", focus: "50% 45%", status: "show" },
      { src: "/img/hero/oslo-fjord-sunset.webp", focus: "80% 42%", status: "show" },
      { src: "/img/hero/oslo-fjord-clouds.webp", focus: "70% 45%", status: "show" },
      { src: "/img/hero/oslo-park-river.webp", focus: "60% 45%", status: "show" },
      { src: "/img/hero/oslo-concrete-atrium.webp", focus: "50% 30%", status: "show" },
    ],
    //   single: always the first shown photo
    //   rotate: crossfade through photos every rotateSeconds
    //   random: pick one per page load
    //   off:    no photo, solid warm dark with a soft glow
    imageMode: "random",
    rotateSeconds: 7,
    // true: clicking the photo moves to the next one. Handy for checking crops.
    clickToRotate: true,
  } satisfies Hero,

  links: {
    cv: {
      eyebrow: "Curriculum vitae",
      title: "CV",
      blurb: "Founder, CTO, technology director. 25+ years from startups to enterprises.",
      href: "/cv/",
    },
    thoughts: {
      eyebrow: "Writing",
      title: "Thoughts about…",
      blurb: "Notes on technology, teams and the decisions in between",
      blurbEmpty: "Coming soon: notes on technology, teams and decisions",
      href: "/thoughts-about/",
    },
  },

  about: {
    paragraphs: [
      "Co-founded vzaar and took it from concept to profitability and acquisition by DaCast. Since then, led technology and product teams of 100+ on platforms serving 1.5m+ members, employers and advisers.",
    ],
    footnote: "Ex-Accenture and eBay. Electrical engineer by training.",
  },

  contact: {
    location: {
      label: "New Malden, London",
      href: "https://www.google.com/maps/place/New+Malden/",
    },
    phone: { label: "+44-7770-570-058", href: "tel:+44-7770-570-058" },
    linkedin: { label: "linkedin.com/in/sevitz", href: "https://www.linkedin.com/in/sevitz/" },
    email: {
      label: "adrian@sevitz.com",
      address: "adrian+website@sevitz.com",
      subject: "Connecting via your website",
    },
  },
} as const;

export type Hero = {
  firstName: string;
  lastName: string;
  wordmark: string;
  taglinePhrases: readonly string[];
  taglineSeconds: number;
  images: readonly HeroImage[];
  imageMode: "single" | "rotate" | "random" | "off";
  rotateSeconds: number;
  clickToRotate: boolean;
};

export type HeroImage = {
  readonly src: string;
  readonly focus: string;
  readonly status?: "show" | "skip" | "hold" | "delete";
};

// The photos the hero can show: never "skip" or "delete", and only "hold" when any are held.
export function shownHeroImages(images: readonly HeroImage[]): readonly HeroImage[] {
  const held = images.filter((image) => image.status === "hold");
  return held.length > 0 ? held : images.filter((image) => image.status !== "skip" && image.status !== "delete");
}
