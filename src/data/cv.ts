// Single source of truth for the CV page (src/pages/cv/index.astro).
// Edit this file when the CV content changes - no PDF regeneration needed,
// the page renders straight from here and the "Download PDF" button just
// prints the rendered page.
export const cv = {
  name: "Adrian Sevitz",
  headline: "CTO | Technology, Product and Engineering Leader",
  updated: "2026",

  contact: {
    email: { label: "adrian@sevitz.com", href: "mailto:adrian@sevitz.com" },
    phone: { label: "+44 7770 570 058", href: "tel:+447770570058" },
    location: "London, United Kingdom",
    linkedin: { label: "linkedin.com/in/sevitz", href: "https://www.linkedin.com/in/sevitz/" },
  },

  summary: [
    "I have built technology businesses and organisations. I co-founded vzaar, raised £5m+, built the product and team from the ground up, took the business to profitability and led its sale. Since then I have taken that founder perspective into larger, regulated organisations, leading technology and product teams of 100+ people and platforms serving 1.5m+ members, employers and advisers.",
    "What still gets me excited is using technology to solve problems that actually matter, for the business and the customers it serves. I am at my best where technology decisions have clear business value: building strong teams, setting direction, designing resilient platforms, iterating and improving those platforms to scale.",
    "I stay close enough to the technology to make considered decisions. I work well where I have autonomy to solve problems and accountability for making the right decisions in solving them.",
  ],

  experience: [
    {
      company: "Barnett Waddingham / Howden",
      roles: [{ title: "Head of Future Technology", dates: "May 2024 to Present" }],
      context:
        "£200m revenue actuarial and pension administration consultancy, with 1,800 staff and 150 in technology. Remit across innovation, resilience, development and architecture. Strategic and technical leadership across the wider IT function.",
      intro:
        "Hired to lead technology transformation against a revenue diversification agenda and bring external technology experience to a partnership operating in an increasingly competitive market. Reshaped priorities around resilience and stability, then towards integration following Howden’s acquisition in April 2025.",
      bullets: [
        "Led the move of the Board Management Services risk offering from spreadsheets to the award-winning BW/Howden Core cloud platform: sourced external development, secured business sign-off and managed the delivery and partner relationship through to production. Opened a new market for the firm, growing to 400 clients and set a delivery model now reused elsewhere in the firm.",
        "Led the AI proof of concept for Subject Access Requests (SARs) and secured approval; now moving into production, enabling a 5x revenue uplift on a service previously delivered manually. Owned the build and buy decisions.",
        "Shifted build, buy and outsource decisions towards value and speed rather than default preference. Replaced unsuitable tooling with fit-for-purpose platforms, including modernising SSAS client communications, and brought in a specialist partner using AI-enabled development to replace a critical component in 20 weeks against an 18 month estimate.",
        "Built a permanent Platform Engineering and SRE capability, moving off contractors and retaining the critical people through the transition, and modernised observability and incident management with Datadog and incident.io, improving resilience and contributing to a major SIPP client removing technology from its risk register, working directly with the client on monthly calls and incident management.",
        "Key contributor to the Howden integration, covering technology, branding and the consolidation of client portal platforms.",
      ],
    },
    {
      company: "Smart Pension",
      roles: [{ title: "Director: Technology, Infrastructure and Data", dates: "May 2021 to Jan 2024" }],
      note: "Joined as Platform Architect in Jul 2020; promoted to Director within 10 months.",
      context:
        "15 engineering squads, 100+ engineering and product staff in a matrix structure. Platform serving 1.4m+ members and 70,000+ employers, with AUM approaching £5bn (2024).",
      intro:
        "Reported to the Chief Revenue and Platform Officer, owning technology, infrastructure and data for a multi-client, international workplace pensions PaaS.",
      bullets: [
        "Removed a product and market constraint on launching new platforms, directing a new architecture and delivery approach that made launches 12x faster.",
        "Rebuilt a data proposition that had failed to gain traction, combining a new analytics product with a data warehouse migration; improved client satisfaction and unlocked further demand and revenue.",
        "Modernised 3 client platforms, migrating from Heroku to Kubernetes on AWS and moving front ends to React, improving resilience, security and cost efficiency across services supporting 1.5m+ members, employers and advisers. Built the roadmap, secured sign-off from senior client stakeholders and executives.",
        "Reversed in-flight technology decisions where the original approach did not stand up commercially or technically: replacing a CMS with a TMS to accelerate multilingual delivery, including Arabic portals in the UAE, and moving payroll for a retirement platform from a costly third-party build to a faster, lower-cost SaaS solution.",
        "Resolved a major GDPR compliance issue under tight timeframes, proposing and securing sign-off for a new solution that unblocked contractual commitments.",
      ],
    },
    {
      company: "Vzaar Limited (acquired by DaCast)",
      roles: [
        { title: "Co-founder and Chief Executive Officer", dates: "2017 to 2019" },
        { title: "Chief Technology and Product Officer", dates: "2007 to 2017" },
      ],
      context:
        "Co-founded 2007, acquired by DaCast 2019. $2.5m P&L, 30 staff across 3 countries. Video platform hosting millions of videos and serving billions of views.",
      intro:
        "Built a SaaS/PaaS video business, leading it from concept through scale, first as CTPO and then as CEO through the final growth phase and exit.",
      bullets: [
        "Raised £5m+ across multiple funding rounds, leading investor pitches and managing board and shareholder relationships.",
        "Recruited, hired and led the technology, product, design and operations organisation, building the team and engineering practices from nothing.",
        "Designed the platform architecture from 0 to 1 and scaled usage 10x while holding infrastructure costs flat.",
        "Pivoted the business from B2C to B2B based on market evidence, resetting product, platform and commercial direction and establishing a clear path to growth.",
        "Directed the entire P&L across 30 staff in 3 countries and established operations in Beijing, expanding the addressable market and contributing significantly to the eventual acquisition.",
        "Led the exit end to end: appointed the broker, prepared the business for sale, met prospective buyers, sourced the eventual acquirer directly, secured board and shareholder support, negotiated final terms and led financial, legal and technical due diligence.",
      ],
    },
  ],

  earlierCareer: [
    "Senior Manager, Site Experience at eBay (2006 to 2007), including the UK homepage relaunch.",
    "Analyst to Manager at Accenture (1997 to 2006), leading product and technology programmes for Sainsbury’s, Chellomedia and the businesses that became Virgin Media.",
  ],

  education: ["BSc (Hons) (Eng), Electrical Engineering, University of the Witwatersrand, South Africa"],
} as const;
