export const DEMO_AUDIT = {
  brand_name: 'Vrewkriya Client Brand',
  website_url: 'www.vrewkriya.com',
  growth_score: 68,
  missed_revenue_monthly: '$45,000',
  findings: [
    {
      id: 1,
      title: 'Google My Business & Map Indexing Gap',
      category: 'SEO',
      impact: 'High',
      status: 'Poor',
      description: 'Local search listings lack optimized category tagging and structured schema markup.',
      recommendation: 'Claim and optimize Google Business Profile with structured geo-schema tags.'
    },
    {
      id: 2,
      title: 'Mobile Page Speed & Asset Rendering Bottleneck',
      category: 'Performance',
      impact: 'High',
      status: 'Needs Improvement',
      description: 'Main storefront experience experiences rendering delays over 3.8s on mobile devices.',
      recommendation: 'Implement WEBP image compression and edge CDN caching.'
    },
    {
      id: 3,
      title: 'Instagram Bio & Conversion Funnel Leak',
      category: 'Social',
      impact: 'Medium',
      status: 'Average',
      description: 'Social profiles direct visitor traffic to unoptimized destination links without UTM tracking.',
      recommendation: 'Deploy high-converting mobile Link-in-Bio portal.'
    },
    {
      id: 4,
      title: 'Missing Customer Trust Badges & Local Review Schema',
      category: 'Trust',
      impact: 'High',
      status: 'Poor',
      description: 'High mobile bounce rates due to missing verified customer trust badges.',
      recommendation: 'Integrate trust verification seals and aggregated review stars.'
    }
  ]
};
