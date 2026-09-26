export const site = {
  title: "Adrian Sevitz - Director, CTO, Nerd",

  nav: [
    { label: "Home", href: "#home", icon: "fa-home" },
    { label: "About", href: "#about", icon: "fa-quote-left" },
    { label: "CV", href: "/cv/", icon: "fa-file-pdf-o" },
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
    phone: { label: "+44-7770-570-058", href: "tel:+44-7770-570-058" },
    linkedin: { label: "linkedin.com/in/sevitz", href: "https://www.linkedin.com/in/sevitz/" },
    email: {
      label: "adrian@sevitz.com",
      address: "adrian+website@sevitz.com",
      subject: "Connecting via your website",
    },
    cv: { label: "Curriculum vitae", href: "/cv/" },
  },
} as const;
