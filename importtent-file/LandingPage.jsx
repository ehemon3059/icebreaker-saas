
Action: file_editor create /app/frontend/src/pages/LandingPage.jsx --file-text "import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { 
  Sparkles, 
  Clock, 
  Mail, 
  Zap, 
  Upload, 
  Search, 
  Download,
  Brain,
  Globe,
  Plug,
  Settings,
  Star,
  Check,
  ArrowRight,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import {
  heroData,
  problemSolutionData,
  howItWorksData,
  featuresData,
  pricingData,
  testimonialsData,
  faqData,
  statsData,
  footerData
} from '../mockData';
import { toast } from 'sonner';

const iconMap = {
  brain: Brain,
  zap: Zap,
  globe: Globe,
  plug: Plug,
  settings: Settings,
  download: Download,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github
};

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Success! Check your email to get started.', {
        description: 'We\'ve sent you a link to create your first 10 icebreakers.'
      });
      setEmail('');
    } else {
      toast.error('Please enter a valid email address');
    }
  };

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast.success('You\'re subscribed!', {
        description: 'We\'ll keep you updated on new features and tips.'
      });
      setNewsletterEmail('');
    }
  };

  return (
    <div className=\"landing-page\">
      {/* Header/Navigation */}
      <header className=\"header-nav\">
        <div className=\"container-custom\">
          <div className=\"nav-content\">
            <div className=\"logo-section\">
              <Sparkles className=\"logo-icon\" />
              <div>
                <div className=\"logo-text\">IcebreakerAI</div>
                <div className=\"logo-tagline\">by papatiger.tech</div>
              </div>
            </div>
            <nav className=\"nav-links\">
              <a href=\"#features\">Features</a>
              <a href=\"#pricing\">Pricing</a>
              <a href=\"#faq\">FAQ</a>
              <Button variant=\"default\" className=\"btn-primary\">Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className=\"hero-section\">
        <div className=\"hero-bg-gradient\"></div>
        <div className=\"container-custom\">
          <div className=\"hero-content\">
            <Badge className=\"hero-badge\">
              <Sparkles className=\"h-3 w-3\" />
              AI-Powered Personalization
            </Badge>
            <h1 className=\"hero-headline\">
              {heroData.headline}
              <br />
              <span className=\"gradient-text\">{heroData.subheadline}</span>
            </h1>
            <p className=\"hero-description\">{heroData.description}</p>
            
            <form onSubmit={handleGetStarted} className=\"hero-form\">
              <div className=\"input-group\">
                <Input
                  type=\"email\"
                  placeholder=\"Enter your work email\"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className=\"hero-input\"
                />
                <Button type=\"submit\" className=\"btn-primary btn-large\">
                  {heroData.ctaText}
                  <ArrowRight className=\"ml-2 h-5 w-5\" />
                </Button>
              </div>
              <p className=\"micro-copy\">
                <Check className=\"h-4 w-4\" />
                {heroData.microCopy}
              </p>
            </form>

            {/* Stats */}
            <div className=\"stats-grid\">
              {statsData.stats.map((stat) => (
                <div key={stat.id} className=\"stat-item\">
                  <div className=\"stat-value\">{stat.value}</div>
                  <div className=\"stat-label\">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className=\"problem-section\">
        <div className=\"container-custom\">
          <h2 className=\"section-headline\">{problemSolutionData.headline}</h2>
          <div className=\"problem-grid\">
            {problemSolutionData.cards.map((card) => (
              <Card key={card.id} className={`problem-card problem-card-${card.type}`}>
                <CardHeader>
                  <CardTitle className=\"problem-card-title\">
                    {card.type === 'old' && <Clock className=\"card-icon\" />}
                    {card.type === 'bad' && <Mail className=\"card-icon\" />}
                    {card.type === 'ai' && <Zap className=\"card-icon\" />}
                    <div>
                      {card.title}
                      {card.subtitle && <span className=\"card-subtitle\">{card.subtitle}</span>}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className=\"card-description\">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className=\"how-it-works-section\" id=\"how-it-works\">
        <div className=\"container-custom\">
          <h2 className=\"section-headline\">{howItWorksData.headline}</h2>
          <div className=\"steps-grid\">
            {howItWorksData.steps.map((step) => (
              <div key={step.id} className=\"step-card\">
                <div className=\"step-number-badge\">{step.step}</div>
                <div className=\"step-icon\">
                  {step.step === '1' && <Upload className=\"h-8 w-8\" />}
                  {step.step === '2' && <Search className=\"h-8 w-8\" />}
                  {step.step === '3' && <Download className=\"h-8 w-8\" />}
                </div>
                <h3 className=\"step-title\">{step.title}</h3>
                <p className=\"step-description\">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className=\"features-section\" id=\"features\">
        <div className=\"container-custom\">
          <h2 className=\"section-headline\">{featuresData.headline}</h2>
          <div className=\"features-grid\">
            {featuresData.features.map((feature) => {
              const IconComponent = iconMap[feature.icon];
              return (
                <Card key={feature.id} className=\"feature-card glass-card\">
                  <CardHeader>
                    <div className=\"feature-icon\">
                      <IconComponent className=\"h-6 w-6\" />
                    </div>
                    <CardTitle className=\"feature-title\">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className=\"feature-description\">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className=\"roi-section\">
        <div className=\"container-custom\">
          <div className=\"roi-content\">
            <h2 className=\"section-headline-light\">Scale Your Sales Pipeline, Not Your Payroll.</h2>
            <p className=\"roi-description\">
              Generic emails land in the spam folder. Hyper-personalized emails book sales meetings. 
              IcebreakerAI gives you the high reply rates of a carefully crafted, one-on-one email, 
              but with the speed of an automated campaign.
            </p>
            <div className=\"roi-highlight\">
              <p className=\"roi-highlight-text\">
                Do the outreach of an entire team of SDRs for <span className=\"highlight-price\">just $29 a month</span>.
              </p>
              <p className=\"roi-highlight-subtext\">
                Increase your booked meetings, close more deals, and lower your overhead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className=\"pricing-section\" id=\"pricing\">
        <div className=\"container-custom\">
          <h2 className=\"section-headline\">{pricingData.headline}</h2>
          <p className=\"section-subheadline\">{pricingData.subheadline}</p>
          
          <div className=\"pricing-grid\">
            {pricingData.plans.map((plan) => (
              <Card key={plan.id} className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}>
                {plan.popular && <div className=\"popular-badge\">Most Popular</div>}
                <CardHeader>
                  <CardTitle className=\"pricing-plan-name\">{plan.name}</CardTitle>
                  <div className=\"pricing-amount\">
                    <span className=\"price\">${plan.price}</span>
                    <span className=\"period\">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className=\"pricing-features\">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <Check className=\"h-5 w-5\" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={plan.ctaVariant} 
                    className={`w-full ${plan.popular ? 'btn-primary' : ''}`}
                  >
                    {plan.ctaText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <p className=\"pricing-footnote\">
            <Globe className=\"h-4 w-4\" />
            {pricingData.footnote}
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className=\"testimonials-section\">
        <div className=\"container-custom\">
          <h2 className=\"section-headline\">{testimonialsData.headline}</h2>
          <div className=\"testimonials-grid\">
            {testimonialsData.testimonials.map((testimonial) => (
              <Card key={testimonial.id} className=\"testimonial-card glass-card\">
                <CardContent className=\"testimonial-content\">
                  <div className=\"testimonial-stars\">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className=\"star-icon\" fill=\"currentColor\" />
                    ))}
                  </div>
                  <p className=\"testimonial-text\">\"{testimonial.content}\"</p>
                  <div className=\"testimonial-author\">
                    <img src={testimonial.image} alt={testimonial.name} className=\"author-image\" />
                    <div>
                      <div className=\"author-name\">{testimonial.name}</div>
                      <div className=\"author-role\">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className=\"faq-section\" id=\"faq\">
        <div className=\"container-custom\">
          <h2 className=\"section-headline\">{faqData.headline}</h2>
          <Accordion type=\"single\" collapsible className=\"faq-accordion\">
            {faqData.faqs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger className=\"faq-question\">{faq.question}</AccordionTrigger>
                <AccordionContent className=\"faq-answer\">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className=\"cta-section\">
        <div className=\"container-custom\">
          <div className=\"cta-content\">
            <h2 className=\"cta-headline\">Ready to turn leads into replies?</h2>
            <p className=\"cta-description\">Join thousands of sales professionals who are closing more deals with AI-powered personalization.</p>
            <Button className=\"btn-primary btn-large\">
              Generate Your First 10 Icebreakers for Free
              <ArrowRight className=\"ml-2 h-5 w-5\" />
            </Button>
            <p className=\"micro-copy\">
              <Check className=\"h-4 w-4\" />
              No credit card required. Works globally.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=\"footer\">
        <div className=\"container-custom\">
          <div className=\"footer-grid\">
            {/* Company Info */}
            <div className=\"footer-company\">
              <div className=\"footer-logo\">
                <Sparkles className=\"logo-icon\" />
                <div>
                  <div className=\"logo-text\">{footerData.company.name}</div>
                  <div className=\"logo-tagline\">{footerData.company.tagline}</div>
                </div>
              </div>
              <p className=\"footer-description\">{footerData.company.description}</p>
              
              {/* Newsletter Signup */}
              <form onSubmit={handleNewsletterSignup} className=\"newsletter-form\">
                <Input
                  type=\"email\"
                  placeholder=\"Your email\"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className=\"newsletter-input\"
                />
                <Button type=\"submit\" variant=\"default\" className=\"btn-primary\">
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Product Links */}
            <div className=\"footer-links-section\">
              <h4 className=\"footer-links-title\">Product</h4>
              <ul className=\"footer-links\">
                {footerData.links.product.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className=\"footer-links-section\">
              <h4 className=\"footer-links-title\">Company</h4>
              <ul className=\"footer-links\">
                {footerData.links.company.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className=\"footer-links-section\">
              <h4 className=\"footer-links-title\">Legal</h4>
              <ul className=\"footer-links\">
                {footerData.links.legal.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className=\"footer-bottom\">
            <p className=\"footer-copyright\">
              © 2025 IcebreakerAI by papatiger.tech. All rights reserved.
            </p>
            <div className=\"footer-social\">
              {footerData.links.social.map((social, idx) => {
                const SocialIcon = iconMap[social.icon];
                return (
                  <a key={idx} href={social.href} className=\"social-link\" aria-label={social.label}>
                    <SocialIcon className=\"h-5 w-5\" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
"
Observation: connection failed: calling "initialize": rejected by transport: sending "initialize": Bad Gateway