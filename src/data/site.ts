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
      "Once edited a script with Oliver Stone",
      "Technical and Product Leadership",
      "Building technology, building technology teams",
      "Once edited a script with Oliver Stone",
      "Ex-Big 4 Consulting, Startup, Scaleup, Enterprise",
    ],
    // Spare phrases, swap any of these into taglinePhrases above:
    //   "Experience from Startups to Scale-ups to Enterprises"
    //   "Using technology to solve problems that actually matter"
    taglineSeconds: 5.2,

    // Background photo(s) behind the hero. `focus` is a CSS background-position.
    // `caption` (optional): "Place, Year", shown small at the bottom right of the hero.
    // `status` (optional, defaults to "show"):
    //   "show":   in the rotation
    //   "skip":   never shown
    //   "hold":   if any photo is on hold, only held photos are shown (show is then ignored)
    //   "delete": never shown, and flagged for removal: ask Claude to remove the flagged
    //             photos (file and line) on the next hero update
    // See every photo, its crop and its status at /hero-images/ (unlinked, noindex).
    images: [
      { src: "/img/header-bg.jpg", focus: "70% 30%", status: "skip" },
      { src: "/img/hero/adrian-portrait.webp", focus: "50% 38%", status: "show", caption: "New Malden, 2024" },
      { src: "/img/hero/thames-sunset.webp", focus: "50% 45%", status: "show", caption: "Waterloo Bridge, 2016" },
      { src: "/img/hero/misty-park-morning.webp", focus: "65% 40%", status: "show", caption: "Cambridge, 2016" },
      { src: "/img/hero/forest-rainbow.webp", focus: "60% 54%", status: "show", caption: "New Forest, 2019" },
      { src: "/img/hero/frosted-grass.webp", focus: "50% 60%", status: "show", caption: "Wimbeldon, 2022" },
      { src: "/img/hero/sunrise-above-clouds.webp", focus: "70% 42%", status: "show", caption: "Haleakalā, 2022" },
      { src: "/img/hero/savanna-sunset.webp", focus: "50% 45%", status: "show", caption: "Kruger National Park, 2010" },
      { src: "/img/hero/sea-turtle.webp", focus: "65% 30%", status: "show", caption: "Maui, 2022" },
      { src: "/img/hero/kruger-elephant.webp", focus: "40% 35%", status: "show", caption: "Kruger National Park, 2010" },
      { src: "/img/hero/kruger-cheetah.webp", focus: "65% 55%", status: "show", caption: "Kruger National Park, 2010" },
      { src: "/img/hero/kruger-weaver.webp", focus: "60% 55%", status: "show", caption: "Kruger National Park, 2025" },
      { src: "/img/hero/kruger-rock-trees.webp", focus: "50% 40%", status: "show", caption: "Kruger National Park, 2025" },
      { src: "/img/hero/kruger-sunset.webp", focus: "65% 50%", status: "show", caption: "Kruger National Park, 2025" },
      { src: "/img/hero/oslo-harbour-sunset.webp", focus: "50% 45%", status: "show", caption: "Oslo, 2024" },
      { src: "/img/hero/oslo-fjord-sunset.webp", focus: "80% 42%", status: "show", caption: "Oslo, 2024" },
      { src: "/img/hero/oslo-fjord-clouds.webp", focus: "70% 45%", status: "show", caption: "Oslo, 2024" },
      { src: "/img/hero/alps-ski-slope.webp", focus: "50% 55%", status: "show", caption: "Tignes, 2023" },
      { src: "/img/hero/alps-cloud-ridge.webp", focus: "50% 55%", status: "show", caption: "Val Thorens, 2026" },
      { src: "/img/hero/maui-palm-ocean.webp", focus: "60% 50%", status: "show", caption: "Maui, 2022" },
      { src: "/img/hero/maui-palm-dusk.webp", focus: "50% 45%", status: "show", caption: "Maui, 2022" },
      { src: "/img/hero/oakland-redwoods.webp", focus: "50% 45%", status: "show", caption: "Oakland, 2022" },
      { src: "/img/hero/austria-misty-forest.webp", focus: "50% 50%", status: "show", caption: "Eisriesenwelt, 2025" },
      { src: "/img/hero/western-cape-orchard.webp", focus: "50% 55%", status: "show", caption: "Babylonstoren, 2025" },
      { src: "/img/hero/wandsworth-common-pond.webp", focus: "50% 50%", status: "show", caption: "Wandsworth Common, 2024" },
      { src: "/img/hero/hampshire-rapeseed.webp", focus: "50% 70%", status: "show", caption: "Hayling Island, 2024" },
      { src: "/img/hero/hollyhock.webp", focus: "50% 47%", status: "show", caption: "Petersham, 2020" },
      { src: "/img/hero/hampton-court-meadow.webp", focus: "50% 40%", status: "show", caption: "Hampton Court, 2024" },
      { src: "/img/hero/daylily.webp", focus: "40% 40%", status: "show", caption: "New Malden, 2022" },
      { src: "/img/hero/cherry-blossom.webp", focus: "60% 50%", status: "show", caption: "New Malden, 2021" },
      { src: "/img/hero/kew-tulips.webp", focus: "50% 55%", status: "show", caption: "Kew Gardens, 2021" },
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

  /** Open Tabs posts (tagged `open-tabs`): the label shown before each editor note (a blockquote in the post). */
  openTabs: { editorLabel: "Sev: " },

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
    footnote: "Electrical Engineer. Big 4 Consulting, Startup, Scale-up and Enterprise",
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
  readonly caption?: string;
  readonly status?: "show" | "skip" | "hold" | "delete";
};

// The photos the hero can show: never "skip" or "delete", and only "hold" when any are held.
export function shownHeroImages(images: readonly HeroImage[]): readonly HeroImage[] {
  const held = images.filter((image) => image.status === "hold");
  return held.length > 0 ? held : images.filter((image) => image.status !== "skip" && image.status !== "delete");
}
