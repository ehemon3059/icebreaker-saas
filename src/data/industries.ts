export interface IndustryExample {
  name: string
  title: string
  company: string
  icebreaker: string
}

export interface Industry {
  slug: string
  name: string
  title: string
  description: string
  examples: IndustryExample[]
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'saas',
    name: 'SaaS',
    title: 'Cold Email Icebreakers for SaaS Companies',
    description:
      'AI-generated opening lines tailored for SaaS sales teams targeting software buyers.',
    examples: [
      {
        name: 'Sarah Chen',
        title: 'Head of Product',
        company: 'DataFlow',
        icebreaker:
          'Your approach to real-time data pipelines caught my eye — curious how you handle schema changes at scale.',
      },
      {
        name: 'Mike Torres',
        title: 'VP Engineering',
        company: 'CloudSync',
        icebreaker:
          'Noticed your team shipped 3 major integrations last quarter — your API docs are surprisingly developer-friendly.',
      },
      {
        name: 'Priya Nair',
        title: 'Director of Growth',
        company: 'Funnelbase',
        icebreaker:
          'Your recent case study on reducing churn with onboarding flows was a genuinely useful read.',
      },
      {
        name: 'James Kim',
        title: 'CTO',
        company: 'Stackwise',
        icebreaker:
          "Stackwise's open-source contributions to the observability space have been referenced in a few architecture discussions I've been part of.",
      },
      {
        name: 'Leila Ahmad',
        title: 'Head of Customer Success',
        company: 'Retainly',
        icebreaker:
          "Your team's focus on proactive health scoring before a customer even flags an issue is a rare approach in CS.",
      },
    ],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    title: 'Cold Email Icebreakers for Real Estate Professionals',
    description:
      'Personalized opening lines for reaching out to realtors, brokers, and property managers.',
    examples: [
      {
        name: 'Greg Hoffman',
        title: 'Broker Owner',
        company: 'Hoffman Realty',
        icebreaker:
          "Your team's volume in the downtown corridor this quarter suggests you're ahead of the market shift most brokers are still catching up to.",
      },
      {
        name: 'Maria Santos',
        title: 'Property Manager',
        company: 'Apex Living',
        icebreaker:
          "The tenant retention programs highlighted on Apex Living's site are notably more systematic than what most mid-size operators put in place.",
      },
      {
        name: 'Tom Wallace',
        title: 'Commercial Realtor',
        company: 'Wallace CRE',
        icebreaker:
          'Your focus on mixed-use redevelopment in secondary markets is exactly where the interesting deals seem to be happening right now.',
      },
      {
        name: 'Diane Park',
        title: 'VP of Acquisitions',
        company: 'Cornerstone Capital',
        icebreaker:
          "Cornerstone's recent multifamily acquisitions in the Sun Belt suggest a conviction in the demographic shift that not many funds have acted on yet.",
      },
      {
        name: 'Carlos Rivera',
        title: 'Residential Team Lead',
        company: 'Rivera Group',
        icebreaker:
          'Your video walkthroughs are among the more thoughtfully produced in the market — makes the listing feel like a story rather than a spec sheet.',
      },
    ],
  },
  {
    slug: 'agencies',
    name: 'Marketing Agencies',
    title: 'Cold Email Icebreakers for Marketing Agencies',
    description:
      'Custom openers for connecting with agency owners, account managers, and creative directors.',
    examples: [
      {
        name: 'Rachel Moore',
        title: 'Founder & Creative Director',
        company: 'Ember Studio',
        icebreaker:
          "Ember Studio's rebrand work for Northline Foods is the kind of identity system that actually holds up at every touchpoint.",
      },
      {
        name: 'Dan Okafor',
        title: 'Head of Performance',
        company: 'Scalepath Agency',
        icebreaker:
          "Your team's approach to incrementality testing on paid social is more rigorous than most agencies bother with.",
      },
      {
        name: 'Julia Weiss',
        title: 'Account Director',
        company: 'Pulse Creative',
        icebreaker:
          'The case study on how you doubled organic traffic for a B2B SaaS client in 90 days was worth a second read.',
      },
      {
        name: 'Sam Patel',
        title: 'CEO',
        company: 'Reach Digital',
        icebreaker:
          "Reach Digital's positioning around retention-first growth is a differentiator most agencies are still figuring out how to pitch.",
      },
      {
        name: 'Nina Larsson',
        title: 'Strategy Lead',
        company: 'Forma Agency',
        icebreaker:
          'Your newsletter on brand positioning in commoditized markets is one of the few agency publications worth subscribing to.',
      },
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-Commerce',
    title: 'Cold Email Icebreakers for E-Commerce Brands',
    description:
      'Tailored opening lines for reaching DTC brands, Shopify stores, and e-commerce managers.',
    examples: [
      {
        name: 'Ashley Turner',
        title: 'Head of E-Commerce',
        company: 'Brightleaf Goods',
        icebreaker:
          "Brightleaf's unboxing experience has become a reference point in DTC communities — the packaging-to-retention angle is a smart play.",
      },
      {
        name: 'Kevin Zhao',
        title: 'Director of Growth',
        company: 'Nomad Supply Co',
        icebreaker:
          "Your SMS retention flow is one of the more tastefully executed I've seen — no panic discounts, just well-timed product education.",
      },
      {
        name: 'Fiona Walsh',
        title: 'VP of Marketing',
        company: 'Heirloom Botanics',
        icebreaker:
          'The subscription model you layered onto a one-time product line was a gutsy move — curious how LTV trended in year one.',
      },
      {
        name: 'Omar Diaz',
        title: 'Founder',
        company: 'Terra Athletics',
        icebreaker:
          "Terra Athletics' community-first launch strategy on Reddit before opening Shopify is something a lot of brands try to copy and get wrong.",
      },
      {
        name: 'Tanya Brooks',
        title: 'E-Commerce Operations Lead',
        company: 'Luma Home',
        icebreaker:
          "Your 3PL setup for same-day fulfillment in three metro areas is operationally impressive for a brand at Luma's stage.",
      },
    ],
  },
  {
    slug: 'fintech',
    name: 'Fintech',
    title: 'Cold Email Icebreakers for Fintech Companies',
    description:
      'Personalized openers for connecting with fintech founders, product leads, and compliance teams.',
    examples: [
      {
        name: 'David Lin',
        title: 'Co-Founder & CPO',
        company: 'Vaultr',
        icebreaker:
          "Vaultr's embedded banking approach for gig workers is solving a real friction point that most neobanks have treated as a niche afterthought.",
      },
      {
        name: 'Amara Osei',
        title: 'Head of Compliance',
        company: 'ClearLedger',
        icebreaker:
          "Your writing on evolving AML requirements in cross-border payments is some of the clearest compliance commentary I've come across.",
      },
      {
        name: 'Rosa Fleming',
        title: 'VP Product',
        company: 'Cardex',
        icebreaker:
          "Cardex's spend analytics UI is genuinely intuitive — the category-level forecasting feature in particular seems underrated.",
      },
      {
        name: 'Nathan Burke',
        title: 'Head of Partnerships',
        company: 'Finlink',
        icebreaker:
          "Your bank API aggregation layer is quietly becoming infrastructure for a lot of the startups I've spoken with in the lending space.",
      },
      {
        name: 'Sophie Grant',
        title: 'CEO',
        company: 'Payloom',
        icebreaker:
          "Payloom's approach to FX hedging for SMBs — without requiring a treasury team — is a gap that's been obvious for years and surprisingly unaddressed.",
      },
    ],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    title: 'Cold Email Icebreakers for Healthcare & Healthtech',
    description:
      'HIPAA-aware opening lines for reaching healthcare administrators and healthtech builders.',
    examples: [
      {
        name: 'Dr. Erica Marsh',
        title: 'Chief Medical Officer',
        company: 'Verdant Health',
        icebreaker:
          "Verdant's care coordination model for complex chronic conditions is structured in a way that actually reduces handoff errors rather than just documenting them.",
      },
      {
        name: 'Luke Ferreira',
        title: 'VP of Product',
        company: 'MedTrack',
        icebreaker:
          "MedTrack's ambient clinical documentation approach is one of the more thoughtful implementations I've seen — keeping the physician in control of the summary is the right call.",
      },
      {
        name: 'Priya Kapoor',
        title: 'Director of Operations',
        company: 'Sunrise Behavioral',
        icebreaker:
          "Your outpatient scheduling model's ability to reduce no-show rates without aggressive reminder cadences is worth studying for any behavioral health operator.",
      },
      {
        name: 'James Holloway',
        title: 'Head of Engineering',
        company: 'Pathways Health',
        icebreaker:
          "Pathways' FHIR-native architecture is still rare enough that your engineering team's approach to longitudinal patient records is a genuine differentiator.",
      },
      {
        name: 'Angela Yu',
        title: 'SVP of Growth',
        company: 'CareLoop',
        icebreaker:
          "CareLoop's remote patient monitoring retention numbers are notably higher than the category average — the family engagement layer seems to be doing more work than most realize.",
      },
    ],
  },
  {
    slug: 'consulting',
    name: 'Consulting',
    title: 'Cold Email Icebreakers for Consulting Firms',
    description:
      'Smart openers for reaching partners, associates, and business development leads at consulting firms.',
    examples: [
      {
        name: 'Robert Chen',
        title: 'Managing Partner',
        company: 'Meridian Advisory',
        icebreaker:
          "Meridian's supply chain practice has been ahead of the reshoring conversation for a while — the white paper on nearshoring risk is still one of the more cited pieces in the space.",
      },
      {
        name: 'Claire Dubois',
        title: 'Principal',
        company: 'Apex Strategy Group',
        icebreaker:
          "Your org design work for post-merger integrations is the kind of specialization that's hard to commoditize — most generalist firms get that phase badly wrong.",
      },
      {
        name: 'Marcus Webb',
        title: 'Director of Business Development',
        company: 'Northpoint Consulting',
        icebreaker:
          "Northpoint's focus on mid-market private equity portfolio work is a smart positioning move — the operational value-add angle differentiates from the pure strategy shops.",
      },
      {
        name: 'Sonia Alvarez',
        title: 'Senior Associate',
        company: 'Clarity Partners',
        icebreaker:
          "Your team's go-to-market playbooks for regulated industry launches are more pragmatic than the frameworks most strategy firms publish.",
      },
      {
        name: 'Patrick Nwosu',
        title: 'Partner',
        company: 'Beacon Consulting',
        icebreaker:
          "Beacon's digital transformation practice for government clients is a legitimately underserved space — the procurement complexity alone keeps most firms away.",
      },
    ],
  },
  {
    slug: 'recruiting',
    name: 'Recruiting & Staffing',
    title: 'Cold Email Icebreakers for Recruiters',
    description:
      'Personalized opening lines for connecting with hiring managers and talent acquisition teams.',
    examples: [
      {
        name: 'Jennifer Holt',
        title: 'Head of Talent Acquisition',
        company: 'Vertex Systems',
        icebreaker:
          "Vertex's structured hiring process for senior engineers — with the take-home replaced by a paid design session — is a candidate experience benchmark worth more attention.",
      },
      {
        name: 'Andre Mensah',
        title: 'VP of People',
        company: 'GrowthOS',
        icebreaker:
          "Your internal mobility program's promotion rate is notably higher than the industry average — curious whether that comes from structured career ladders or something more informal.",
      },
      {
        name: 'Tasha Kim',
        title: 'Technical Recruiter',
        company: 'TalentBridge',
        icebreaker:
          "TalentBridge's niche focus on ML infrastructure roles is smart — the candidate pool is thin and the hiring managers are technical enough that generic outreach gets filtered immediately.",
      },
      {
        name: 'Brian Cole',
        title: 'Director of HR',
        company: 'Fieldstone Group',
        icebreaker:
          "Fieldstone's retention rate across the first 18 months of hire is one of the stronger numbers I've seen for a company growing at your pace.",
      },
      {
        name: 'Maya Okonkwo',
        title: 'Recruiting Lead',
        company: 'Propel Staffing',
        icebreaker:
          "Your sourcing approach for passive candidates in niche technical disciplines — particularly the community-building angle — is more sustainable than most agencies bother building.",
      },
    ],
  },
]
