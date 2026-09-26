// Single source of truth for the CV page (src/pages/cv/index.astro).
// Edit this file when the CV content changes - no PDF regeneration needed,
// the page renders straight from here and the "Download PDF" button just
// prints the rendered page.
//
// `cv` is the header block (name, headline, contact) shared by both
// versions. `standardCv` is the 2-page condensed version and `detailedCv`
// the 4-page long form; the toggle on the page swaps between them. The two
// aren't word-for-word aligned yet (detailedCv comes from a separate,
// longer source doc) - a future pass will bring the copy closer together.
export const cv = {
  name: "Adrian Sevitz",
  headline: "CTO | Technology, Product and Engineering Leader",
  updated: "2026",

  // Phone and email are obscured on screen (click-to-reveal, mirroring
  // Contact.astro) and only shown in the clear when the page is printed
  // (see the beforeprint/afterprint handling in cv/index.astro).
  contact: {
    email: { label: "adrian@sevitz.com", address: "adrian@sevitz.com", subject: "Re: your CV" },
    phone: { label: "+44 7770 570 058" },
    location: "London, United Kingdom",
    linkedin: { label: "linkedin.com/in/sevitz", href: "https://www.linkedin.com/in/sevitz/" },
  },
} as const;

interface StandardJob {
  company: string;
  roles: { title: string; dates: string }[];
  note?: string;
  context: string;
  intro: string;
  bullets: string[];
}

export const standardCv: {
  summary: string[];
  experience: StandardJob[];
  earlierCareer: string[];
  education: string[];
} = {
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
};

export type Bullet = string | { text: string; subBullets: string[] };

interface Achievements {
  heading: string;
  items: Bullet[];
}

interface DetailedRole {
  title: string;
  dates: string;
  context?: string;
  paragraphs?: string[];
  bullets?: Bullet[];
  achievements?: Achievements;
}

interface DetailedJob {
  company: string;
  context?: string;
  roles: DetailedRole[];
}

interface EarlierCareerJob {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
}

interface EducationEntry {
  dates: string;
  institution: string;
  detail: string;
}

export const detailedCv: {
  summary: string[];
  highlights: string[];
  coreSkills: string[];
  experience: DetailedJob[];
  earlierCareer: EarlierCareerJob[];
  education: EducationEntry[];
} = {
  summary: [
    "Over 25 years of expertise shaping business & technology strategies, leading engineering and building technology platforms.",
    "Proven across the full development lifecycle, from early-stage discovery to delivery and scaling, keeping technology and product development aligned to commercial goals. Adept at cutting through complex challenges, balancing trade-offs and making the decisions necessary to deliver successful outcomes.",
    "Co-founded vzaar and developed the business from initial concept through to acquisition (by DaCast Inc). Raised mid seven figures and grew from zero staff and pre-revenue to profitability. Planned, led and executed the exit strategy, including board and shareholder management.",
    "Technology Director at Smart Pension, managing technology transformation, large-scale migration and delivery. Strong focus on client value and revenue growth while improving system reliability and security and reducing platform costs.",
    "Head of Future Technology at Barnett Waddingham (Howden), modernising processes and technology while developing new capabilities. Introducing fresh approaches and tooling, supporting growth, strengthening resilience and creating value in a traditionally conservative industry.",
  ],

  highlights: [
    "Co-founded and exited vzaar: built from initial concept to acquisition by DaCast, raising over £5m and reaching profitability.",
    "Scaled a SaaS/PaaS video platform to host millions of videos and serve billions of views, growing usage 10x while holding infrastructure costs flat.",
    "Migrated 1.5m+ members to a modern React platform and re-architected system to launch new platforms an order of magnitude faster.",
    "Led technology transformation at Smart Pension, including a full Heroku to Kubernetes migration on AWS improving resilience, security and cost.",
    "Introduced Platform Engineering function at Barnett, introduced new incident management and observability tooling. Modernised the BW Core risk platform migrating it from spreadsheets to the cloud.",
  ],

  coreSkills: [
    "Technology Strategy",
    "Platform & Cloud Engineering",
    "SaaS / PaaS",
    "Product & Delivery",
    "Team Building & Scaling",
    "M&A & Exits",
    "Stakeholder & Board Management",
  ],

  experience: [
    {
      company: "Barnett Waddingham / Howden",
      context:
        "Barnett Waddingham provides independent pensions risk, insurance and investment consultancy, supported by in-house technology platforms across the business. Barnett Waddingham was acquired by Howden Insurance Health & Employee Benefits in April 2025.",
      roles: [
        {
          title: "Head of Future Technology",
          dates: "May 2024 to Present",
          paragraphs: [
            "As Head of Future Technology, I support the strategic direction of technology and software development across the business. I work closely with senior partners, product teams and client stakeholders to shape our technology roadmap, strengthen operational resilience and drive innovation in a traditionally conservative industry, while ensuring technology investment is commercially viable and value-led.",
            "I have brought in an outside perspective to help the firm make more balanced build, buy and outsource decisions, challenging the historic bias toward building in-house. I have evolved our platform engineering function and been integral to the plan to integrate our platforms into the Howden Group.",
          ],
          achievements: {
            heading: "Significant Achievements",
            items: [
              "Introduced SRE at Barnett Waddingham and evolved it into a broader Platform Engineering capability, transitioning from external contractors to a permanent internal team, retaining critical staff while modernising observability and incident management.",
              "Established strategic roadmaps across IT functions, improving delivery visibility, alignment & planning.",
              "Strengthened operational resilience through observability, incident management and change governance improvements; recruited new leadership for Disaster Recovery and ITSM.",
              "Key contributor to the Howden integration programme, covering branding, systems and the merger of two portal platforms.",
              "IT representative on the SIPP Management Committee: supported a key client resilience review and led efforts to embed observability and major incident improvements.",
              "Led an AI proof of concept for SARS requests, identifying a potential 3–5x revenue uplift opportunity.",
              "Enabled the Board Management Services team to modernise their risk offering from spreadsheets into an award-winning cloud platform (BW Core®️), opening new market opportunities.",
              "Modernised the SSAS team’s client interactions, replacing unsuitable legacy tooling with a customer-centric service platform that improved efficiency, productivity and customer satisfaction.",
              "Advisor on AI direction and adoption, shaping realistic, value-led use cases aligned with the firm’s maturity and infrastructure.",
            ],
          },
        },
      ],
    },
    {
      company: "Smart Pensions Limited",
      context:
        "Smart Pension is a workplace software pension platform that leverages a modern technology stack to deliver a cost-competitive, multi-client, international PaaS offering. Smart streamlines enrolment and pension management for employers & advisers with a modern pension portal for employees.",
      roles: [
        {
          title: "Director: Technology, Infrastructure and Data",
          dates: "May 2021 to Jan 2024",
          paragraphs: [
            "Reporting to the Chief Revenue and Platform Officer, the role included strategic planning, technical and product discovery, managing 15 engineering squads, setting objectives to align with business and growth goals.",
          ],
          bullets: [
            "Presented the domain’s quarterly plan for approval by the Chief Revenue and Chief Delivery Officers.",
            "Managed all product and engineering activity in the domain to ensure delivery against the roadmap.",
            "Managed stakeholders across the business, including risk, legal, security and procurement teams.",
            "Worked with client directors to ensure Smart delivered to client and market needs.",
            "Presented to senior client stakeholders to secure agreement for complex technical changes.",
          ],
          achievements: {
            heading: "Significant Achievements",
            items: [
              "Migrated the platform from Heroku to Kubernetes on AWS across three client platforms: developed the migration plan, aligned clients on the roadmap and secured executive sign-off, improving resilience and security while reducing cost.",
              {
                text: "Transitioned front-end client applications across all clients to a new technology framework (React) and design library, supporting over 1.5m members, employers and advisers.",
                subBullets: [
                  "Reversed the decision to implement a CMS, pivoting to a TMS to reduce development time and meet multilingual client requirements; delivered Arabic portals in the UAE.",
                  "Built a new system to fill the gaps left by the absence of a CMS, meeting market and client requirements at materially lower cost while creating a framework for future customisation.",
                ],
              },
              "Evaluated data offering that had failed to gain traction. Architected and delivered a new analytics product framework, including a full data warehouse migration reducing development time. New capability materially improved client satisfaction unlocking further demand and revenue.",
              "Identified a product/market gap in our ability to launch new platforms; architected and delivered a new approach that made platform launches 12x faster.",
              "Resolved a major GDPR compliance issue by proposing and securing sign-off for a new solution under tight timeframes, unblocking contractual commitments.",
            ],
          },
        },
        {
          title: "Platform Architect",
          dates: "Jul 2020 to May 2021",
          context: "Provided programme and technical guidance across the platform, offering strategic and tactical input.",
          bullets: [
            "Ran technical discovery with current and prospective clients.",
            "Evaluated platform architecture, security and technology decisions.",
            "Changed payroll solution for retirement platform, reduced vendor and build costs.",
            "Introduced TechOps approach within IT to increase engineering and business efficiency.",
          ],
        },
      ],
    },
    {
      company: "vzaar Limited / DaCast Limited",
      context:
        "Founded and scaled a modern SaaS/PaaS video platform, taking the business from concept to profitability. Led the 0→1 phase: securing funding, assembling the team, and delivering the initial product. Pivoted the business from a B2C to a B2B model based on market direction, setting a clear path to growth. Designed the platform architecture for scale and resilience, enabling the hosting of millions of videos and delivery to billions of viewers, at a time when cloud infrastructure choices were limited and inventive solutions were needed to deliver performance, scalability and uptime.",
      roles: [
        {
          title: "Chief Executive Officer, vzaar Limited",
          dates: "2017 to 2019",
          bullets: [
            "Directed all activities for a $2.5m P&L, 30 employees, and 3 countries including forecasting, budgeting, finances, legal, human resources, recruitment and facilities.",
            "Established operations in Beijing, China, enhancing the platform and product offering, resulting in increased revenue as well as playing a key part in acquisition by DaCast.",
            "Planned and delivered the search for exit opportunity, engaged broker, prepared all pitch & sale assets.",
            "Met with potential buyers, sold deal to board and shareholders, negotiated final outcome.",
            "Executed sale process and acquisition by DaCast, including financial, legal & technical due diligence.",
            "Led the operation integration of DaCast with vzaar and initiated future strategic and business plans.",
          ],
        },
        {
          title: "Chief Technology & Product Officer, vzaar Limited",
          dates: "2007 to 2017",
          bullets: [
            "Responsible for technical and architectural design, building the team and SaaS/PaaS platform.",
            "Execution of the entire development plan & product roadmap as well as the long-term strategic vision.",
            "Recruited, hired and managed all technology, design, product and operations staff.",
            "Managed day-to-day operations across the business and all vendor relationships.",
            "Maintained controlled low infrastructure costs whilst increasing usage by 10x multiples.",
            "Drove fundraising activities with the board and led investor pitches, raising over £5m.",
          ],
        },
      ],
    },
  ],

  earlierCareer: [
    {
      company: "eBay Inc",
      role: "Senior Manager",
      dates: "2006 to 2007",
      bullets: [
        "Improved experience across a range of underperforming areas achieving improved user satisfaction.",
        "Relaunched UK home page with new design paradigm following a customer-centric approach.",
      ],
    },
    {
      company: "Accenture",
      role: "Manager",
      dates: "1997 to 2006",
      bullets: [
        "Sainsbury’s-to-You: Lead on functional & UX improvements; managed scope & roadmap.",
        "Chellomedia: Developed application architecture for a video on demand platform in NL.",
        "Virgin Media: Led and delivered on engineering projects for NTL, C&W and Telewest, helping to create and deploy their digital television platforms (this work enabled the merger into a single entity in 2006).",
      ],
    },
  ],

  education: [
    {
      dates: "1993 to 1996",
      institution: "University of the Witwatersrand, South Africa",
      detail: "B.Sc (Hons) (Eng), Electrical Engineering",
    },
    {
      dates: "1988 to 1992",
      institution: "Wendywood High School, South Africa",
      detail: "Distinctions in Maths, Science, Accountancy",
    },
  ],
};
