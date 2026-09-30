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
    //   single: always images[0]
    //   rotate: crossfade through images every rotateSeconds
    //   random: pick one per page load
    //   off:    no photo, solid warm dark with a soft glow
    images: [
      { src: "/img/header-bg.jpg", focus: "70% 30%" },
      { src: "/img/hero/adrian-portrait.webp", focus: "50% 38%" },
      { src: "/img/hero/thames-sunset.webp", focus: "50% 45%" },
      { src: "/img/hero/misty-park-morning.webp", focus: "65% 40%" },
      { src: "/img/hero/forest-rainbow.webp", focus: "60% 54%" },
      { src: "/img/hero/frosted-grass.webp", focus: "50% 60%" },
      { src: "/img/hero/sunrise-above-clouds.webp", focus: "70% 42%" },
      { src: "/img/hero/savanna-sunset.webp", focus: "50% 45%" },
      { src: "/img/hero/sea-turtle.webp", focus: "65% 30%" },
    ],
    imageMode: "random",
    rotateSeconds: 7,
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
  images: readonly { readonly src: string; readonly focus: string }[];
  imageMode: "single" | "rotate" | "random" | "off";
  rotateSeconds: number;
};
