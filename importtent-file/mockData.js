Let me retry creating the files:
Action: file_editor create /app/frontend/src/mockData.js --file-text "// Mock data for IcebreakerAI Landing Page

export const heroData = {
  headline: \"Stop Sending Boring Cold Emails.\",
  subheadline: \"Start Getting Replies.\",
  description: \"Turn a simple spreadsheet of leads into hundreds of highly personalized, AI-crafted icebreakers in minutes. No more manual research. No more generic spam.\",
  ctaText: \"Generate Your First 10 Icebreakers for Free\",
  microCopy: \"No credit card required. Works globally.\"
};

export const problemSolutionData = {
  headline: \"Get 40 Hours of Your Week Back.\",
  cards: [
    {
      id: 1,
      title: \"The Old Way\",
      subtitle: \"(manual grind)\",
      description: \"Manually opening 500 company websites, reading their 'About Us' pages, and typing out custom opening lines takes a fast salesperson 25 to 40 hours. It's exhausting, mind-numbing work.\",
      type: \"old\"
    },
    {
      id: 2,
      title: \"The Bad Way\",
      subtitle: \"(spray & pray)\",
      description: \"Sending the exact same generic email to 1,000 people. Your open rates tank, prospects get annoyed, and your email domain gets blacklisted for spam.\",
      type: \"bad\"
    },
    {
      id: 3,
      title: \"The IcebreakerAI Way\",
      subtitle: \"\",
      description: \"You drag and drop a CSV. Our engine visits every website on your list, understands what the company does, and writes a natural, highly relevant opening sentence for each prospect. You do a week's worth of personalization while grabbing a cup of coffee.\",
      type: \"ai\"
    }
  ]
};

export const howItWorksData = {
  headline: \"Personalization at Scale in 3 Steps\",
  steps: [
    {
      id: 1,
      step: \"1\",
      title: \"Upload Your List\",
      description: \"Drop in a CSV with just three columns: Name, Job Title, and Company Website.\"
    },
    {
      id: 2,
      step: \"2\",
      title: \"AI Does the Research\",
      description: \"Our system visits their websites, bypasses the fluff, and figures out exactly what they do.\"
    },
    {
      id: 3,
      step: \"3\",
      title: \"Export & Send\",
      description: \"Download a fresh CSV packed with hyper-personalized opening lines. Plug it directly into your cold email software and watch the replies roll in.\"
    }
  ]
};

export const featuresData = {
  headline: \"Everything You Need to Scale Outreach\",
  features: [
    {
      id: 1,
      title: \"AI-Powered Research\",
      description: \"Our AI visits and analyzes company websites to understand their business context.\",
      icon: \"brain\"
    },
    {
      id: 2,
      title: \"Bulk Processing\",
      description: \"Process hundreds of leads in minutes, not days. Upload CSV, get personalized icebreakers.\",
      icon: \"zap\"
    },
    {
      id: 3,
      title: \"Global Coverage\",
      description: \"Works with companies worldwide. No geographic limitations or restrictions.\",
      icon: \"globe\"
    },
    {
      id: 4,
      title: \"CRM Integration\",
      description: \"Seamlessly integrate with HubSpot, Salesforce, and other major CRM platforms.\",
      icon: \"plug\"
    },
    {
      id: 5,
      title: \"Custom Tone\",
      description: \"Adjust the AI's writing style to match your brand voice and communication preferences.\",
      icon: \"settings\"
    },
    {
      id: 6,
      title: \"Export Ready\",
      description: \"Download ready-to-use CSV files that plug directly into your email automation tools.\",
      icon: \"download\"
    }
  ]
};

export const pricingData = {
  headline: \"Pricing That Makes ROI Impossible to Ignore.\",
  subheadline: \"Stop paying for expensive 'unlimited' tools that overcharge you. Pick a plan that fits your market and your volume.\",
  plans: [
    {
      id: 1,
      name: \"Free\",
      price: 0,
      period: \"month\",
      popular: false,
      features: [
        \"10 icebreakers per month\",
        \"CSV export\",
        \"Basic website scanning\",
        \"Email support (48h)\"
      ],
      ctaText: \"Start Free\",
      ctaVariant: \"outline\"
    },
    {
      id: 2,
      name: \"Pro\",
      price: 29,
      period: \"month\",
      popular: true,
      features: [
        \"500 icebreakers per month\",
        \"Bulk company & contact enrichment\",
        \"Priority website crawl\",
        \"Priority support (chat)\"
      ],
      ctaText: \"Get Started\",
      ctaVariant: \"default\"
    },
    {
      id: 3,
      name: \"Scale\",
      price: 99,
      period: \"month\",
      popular: false,
      features: [
        \"2500 icebreakers per month\",
        \"Advanced AI tone customization\",
        \"CRM integration (HubSpot/Salesforce)\",
        \"Dedicated account manager\"
      ],
      ctaText: \"Contact Sales\",
      ctaVariant: \"outline\"
    }
  ],
  footnote: \"All plans include global company scanning · No hidden fees\"
};

export const testimonialsData = {
  headline: \"Trusted by Sales Teams Worldwide\",
  testimonials: [
    {
      id: 1,
      name: \"Sarah Mitchell\",
      role: \"Sales Director\",
      company: \"TechGrowth Inc\",
      image: \"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop\",
      content: \"IcebreakerAI increased our reply rates by 340%. What used to take our team 2 full days now takes 15 minutes. Absolute game-changer.\",
      rating: 5
    },
    {
      id: 2,
      name: \"Marcus Chen\",
      role: \"Founder\",
      company: \"OutreachPro\",
      image: \"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop\",
      content: \"Finally, a tool that actually delivers on personalization at scale. Our booking rate went from 2% to 8% in the first month.\",
      rating: 5
    },
    {
      id: 3,
      name: \"Emily Rodriguez\",
      role: \"Head of Growth\",
      company: \"ScaleUp Solutions\",
      image: \"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop\",
      content: \"The ROI is insane. We're closing 3x more deals with the same team size. IcebreakerAI is now essential to our sales stack.\",
      rating: 5
    }
  ]
};

export const faqData = {
  headline: \"Frequently Asked Questions\",
  faqs: [
    {
      id: 1,
      question: \"How does IcebreakerAI personalize emails?\",
      answer: \"IcebreakerAI uses advanced AI to visit company websites, analyze their business context, and generate highly relevant opening lines. The AI understands what the company does and crafts natural, personalized icebreakers that feel human-written.\"
    },
    {
      id: 2,
      question: \"Is this legal? Are you scraping LinkedIn profiles?\",
      answer: \"Yes, it's completely legal. We only scrape publicly available company websites that you provide. We explicitly avoid risky practices like automated LinkedIn scraping. Everything we do is safe, ethical, and compliant.\"
    },
    {
      id: 3,
      question: \"How long does it take to process my list?\",
      answer: \"Processing time depends on your list size. Typically, 100 leads take about 5-10 minutes, and 500 leads take around 20-30 minutes. You'll receive email notification when your icebreakers are ready.\"
    },
    {
      id: 4,
      question: \"Can I customize the AI's writing tone?\",
      answer: \"Yes! Pro and Scale plans include tone customization. You can adjust the AI's style to be more formal, casual, humorous, or match your specific brand voice.\"
    },
    {
      id: 5,
      question: \"What file format do I need to upload?\",
      answer: \"Upload a simple CSV file with three columns: Name, Job Title, and Company Website. That's all we need. We'll handle the rest and return an enriched CSV with personalized icebreakers.\"
    },
    {
      id: 6,
      question: \"Do you integrate with my email tools?\",
      answer: \"Yes! You can export your icebreakers as CSV and import directly into tools like Lemlist, Instantly, Smartlead, or any cold email platform. Scale plan users get native CRM integrations with HubSpot and Salesforce.\"
    }
  ]
};

export const statsData = {
  stats: [
    {
      id: 1,
      value: \"340%\",
      label: \"Average Reply Rate Increase\"
    },
    {
      id: 2,
      value: \"40hrs\",
      label: \"Saved Per Week\"
    },
    {
      id: 3,
      value: \"10k+\",
      label: \"Active Users\"
    },
    {
      id: 4,
      value: \"2M+\",
      label: \"Icebreakers Generated\"
    }
  ]
};

export const footerData = {
  company: {
    name: \"IcebreakerAI\",
    tagline: \"by papatiger.tech\",
    description: \"Hyper-personalized cold emails at scale. Turn prospects into replies with AI-powered icebreakers.\"
  },
  links: {
    product: [
      { label: \"Features\", href: \"#features\" },
      { label: \"Pricing\", href: \"#pricing\" },
      { label: \"How it Works\", href: \"#how-it-works\" },
      { label: \"FAQ\", href: \"#faq\" }
    ],
    company: [
      { label: \"About Us\", href: \"#about\" },
      { label: \"Blog\", href: \"#blog\" },
      { label: \"Careers\", href: \"#careers\" },
      { label: \"Contact\", href: \"#contact\" }
    ],
    legal: [
      { label: \"Privacy Policy\", href: \"#privacy\" },
      { label: \"Terms of Service\", href: \"#terms\" },
      { label: \"Cookie Policy\", href: \"#cookies\" }
    ],
    social: [
      { label: \"Twitter\", href: \"#twitter\", icon: \"twitter\" },
      { label: \"LinkedIn\", href: \"#linkedin\", icon: \"linkedin\" },
      { label: \"GitHub\", href: \"#github\", icon: \"github\" }
    ]
  }
};
"
Observation: connection failed: calling "initialize": rejected by transport: sending "initialize": Bad Gateway