export const site = {
  title: "Adrian Sevitz - Director, CTO, Nerd",

  nav: [
    { label: "Home", href: "#home", icon: "fa-home" },
    { label: "About", href: "#about", icon: "fa-quote-left" },
    { label: "CV", href: "/CV/Adrian_Sevitz_CV_2023.pdf", icon: "fa-file-pdf-o" },
    { label: "Contact", href: "#contact", icon: "fa-envelope-o" },
  ],

  hero: {
    firstName: "Adrian",
    lastName: "Sevitz",
    taglinePhrases: [
      "Technical and Product Leader",
      "Once edited a script with Oliver Stone",
      "Experience from Startups to Scale-ups to Enterprises",
    ],
  },

  about: {
    paragraphs: [
      "Co-founded vzaar limited, took the company from initial concept and inception through to acquisition by DaCast Inc. Grew from zero staff and pre-revenue to 20 people and profitability. Led and executed exit process.",
      "Ex ‘big 4’ management consultant with experience across all business and technology lifecycles.",
    ],
  },

  contact: {
    location: {
      label: "New Malden, London",
      flag: "\u{1F1EC}\u{1F1E7}",
      href: "https://www.google.com/maps/place/New+Malden/",
    },
    // Stubbed placeholders: real phone/email are intentionally kept out of the
    // shipped page so they aren't scrapable. Pending a click-to-reveal build
    // (see the plan doc) that serves the real values only on a real click.
    phone: { label: "09990 999 999", href: "tel:09990999999" },
    linkedin: { label: "linkedin.com/in/sevitz", href: "https://www.linkedin.com/in/sevitz/" },
    email: {
      label: "xxxx@yyy.com",
      address: "xxxx@yyy.com",
      subject: "Connecting via your website",
    },
    cv: { label: "Curriculum vitae", href: "/CV/Adrian_Sevitz_CV_2023.pdf" },
  },
} as const;
