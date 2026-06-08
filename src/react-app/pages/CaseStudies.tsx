import { useState } from 'react';
import { TrendingUp, Clock, Users, Shield, Download, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router';

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  logo: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  quote: {
    text: string;
    author: string;
    position: string;
  };
  tags: string[];
  readTime: string;
  downloadUrl: string;
  featured: boolean;
}

export default function CaseStudiesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const industries = [
    { id: 'all', name: 'All Industries', count: 12 },
    { id: 'fintech', name: 'FinTech', count: 4 },
    { id: 'healthcare', name: 'Healthcare', count: 3 },
    { id: 'ecommerce', name: 'E-commerce', count: 3 },
    { id: 'saas', name: 'SaaS', count: 2 }
  ];

  const tags = [
    { id: 'all', name: 'All Solutions' },
    { id: 'gdpr-compliance', name: 'GDPR Compliance' },
    { id: 'ai-automation', name: 'AI Automation' },
    { id: 'dsar-management', name: 'DSAR Management' },
    { id: 'risk-assessment', name: 'Risk Assessment' },
    { id: 'policy-generation', name: 'Policy Generation' }
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: 'fintech-unicorn',
      title: 'FinTech Unicorn Achieves 99% GDPR Compliance Automation',
      company: 'Nexus Financial',
      industry: 'fintech',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
      challenge: 'Nexus Financial, a leading FinTech unicorn processing millions of transactions daily, struggled with manual GDPR compliance processes that took 40+ hours per week. With rapid international expansion, they needed an automated solution to handle increasing volumes of data subject requests and regulatory requirements across multiple jurisdictions.',
      solution: 'PrivacyGuard\'s AI-powered platform automated their entire compliance workflow. Our intelligent agents Clara and Sophia now handle 95% of DSAR processing automatically, while Victor monitors for data breaches in real-time. The AI policy generator created jurisdiction-specific privacy policies for 12 countries within hours.',
      results: [
        { metric: 'Compliance Automation', value: '99%', improvement: '+89%' },
        { metric: 'DSAR Response Time', value: '4 hours', improvement: '-85%' },
        { metric: 'Compliance Team Hours', value: '2 hours/week', improvement: '-95%' },
        { metric: 'Regulatory Risk Score', value: '2/100', improvement: '-82%' }
      ],
      quote: {
        text: 'PrivacyGuard transformed our compliance operations from a manual nightmare into a seamless automated process. We\'ve gone from constant firefighting to proactive privacy leadership.',
        author: 'Sarah Chen',
        position: 'Chief Privacy Officer, Nexus Financial'
      },
      tags: ['gdpr-compliance', 'ai-automation', 'dsar-management'],
      readTime: '8 min read',
      downloadUrl: '/case-studies/nexus-financial.pdf',
      featured: true
    },
    {
      id: 'healthcare-provider',
      title: 'Healthcare Provider Secures Patient Data with AI-Powered Risk Assessment',
      company: 'MedCare Systems',
      industry: 'healthcare',
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      challenge: 'MedCare Systems, managing sensitive health data for 500,000+ patients, faced complex HIPAA and GDPR requirements. Manual risk assessments were taking weeks, creating compliance gaps and putting patient privacy at risk. They needed real-time monitoring and automated threat detection.',
      solution: 'Our intelligent agent Victor now provides 24/7 breach monitoring while Clara maintains up-to-date policies across all jurisdictions. AI-powered risk assessments identify potential vulnerabilities before they become incidents, and automated DPIA generation ensures all processing activities meet regulatory standards.',
      results: [
        { metric: 'Risk Assessment Speed', value: '2 minutes', improvement: '-99%' },
        { metric: 'Breach Detection Time', value: '< 1 hour', improvement: '-95%' },
        { metric: 'Policy Update Frequency', value: 'Real-time', improvement: '+400%' },
        { metric: 'Compliance Score', value: '98/100', improvement: '+35%' }
      ],
      quote: {
        text: 'The AI risk assessment capabilities are game-changing. We can now identify and mitigate privacy risks before they impact our patients. The peace of mind is invaluable.',
        author: 'Dr. Michael Rodriguez',
        position: 'CISO, MedCare Systems'
      },
      tags: ['risk-assessment', 'ai-automation', 'gdpr-compliance'],
      readTime: '6 min read',
      downloadUrl: '/case-studies/medcare-systems.pdf',
      featured: true
    },
    {
      id: 'ecommerce-marketplace',
      title: 'E-commerce Marketplace Scales Privacy Compliance Across 25 Countries',
      company: 'GlobalMart',
      industry: 'ecommerce',
      logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
      challenge: 'GlobalMart operates in 25 countries with varying privacy laws, processing data for millions of customers and sellers. Managing compliance across jurisdictions was overwhelming their legal team, with policy updates taking months and DSAR responses averaging 25 days.',
      solution: 'PrivacyGuard\'s multi-jurisdiction AI engine automatically generates country-specific policies and handles DSARs in local languages. Our intelligent agents provide 24/7 monitoring across all markets, while automated risk assessments ensure new features meet privacy requirements before launch.',
      results: [
        { metric: 'Multi-Jurisdiction Coverage', value: '25 countries', improvement: '+400%' },
        { metric: 'Policy Generation Time', value: '30 minutes', improvement: '-98%' },
        { metric: 'DSAR Response Time', value: '6 hours', improvement: '-92%' },
        { metric: 'Legal Team Efficiency', value: '10x faster', improvement: '+900%' }
      ],
      quote: {
        text: 'PrivacyGuard made global compliance actually manageable. We can now launch in new markets knowing our privacy infrastructure scales automatically.',
        author: 'Lisa Thompson',
        position: 'VP Legal & Compliance, GlobalMart'
      },
      tags: ['gdpr-compliance', 'policy-generation', 'dsar-management'],
      readTime: '7 min read',
      downloadUrl: '/case-studies/globalmart.pdf',
      featured: false
    },
    {
      id: 'saas-startup',
      title: 'SaaS Startup Achieves Enterprise-Grade Compliance with 90% Cost Reduction',
      company: 'CloudFlow Analytics',
      industry: 'saas',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
      challenge: 'As a fast-growing SaaS startup, CloudFlow couldn\'t afford a full compliance team but needed enterprise-grade privacy controls to win large customers. Manual processes were blocking deals and creating operational overhead.',
      solution: 'PrivacyGuard became their virtual DPO team. AI agents handle all routine compliance tasks, while the risk assessment engine ensures new features are privacy-compliant by design. Automated policy generation and DSAR processing removed the need for expensive legal consultants.',
      results: [
        { metric: 'Compliance Costs', value: '$5K/month', improvement: '-90%' },
        { metric: 'Enterprise Deals Won', value: '85%', improvement: '+300%' },
        { metric: 'Time to Compliance', value: '1 week', improvement: '-95%' },
        { metric: 'Team Productivity', value: '40 hours/week saved', improvement: '+80%' }
      ],
      quote: {
        text: 'PrivacyGuard gave us enterprise-level compliance capabilities without the enterprise budget. It\'s been crucial to our growth and customer trust.',
        author: 'James Park',
        position: 'CTO & Co-founder, CloudFlow Analytics'
      },
      tags: ['ai-automation', 'policy-generation', 'risk-assessment'],
      readTime: '5 min read',
      downloadUrl: '/case-studies/cloudflow-analytics.pdf',
      featured: false
    },
    {
      id: 'retail-chain',
      title: 'Retail Chain Transforms Customer Data Management with AI Automation',
      company: 'StyleHub Retail',
      industry: 'ecommerce',
      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      challenge: 'StyleHub Retail\'s 200+ stores and online platform generated massive customer data volumes. Manual compliance processes couldn\'t keep up with customer requests, leading to regulatory warnings and customer dissatisfaction.',
      solution: 'Our AI agents now manage the entire customer data lifecycle. Sophia handles DSAR automation with 99% accuracy, while Clara maintains real-time policy updates across all channels. Automated data mapping and retention management ensure continuous compliance.',
      results: [
        { metric: 'Customer Request Processing', value: '99% automated', improvement: '+94%' },
        { metric: 'Regulatory Warnings', value: '0', improvement: '-100%' },
        { metric: 'Customer Satisfaction', value: '95%', improvement: '+60%' },
        { metric: 'Data Processing Accuracy', value: '99.8%', improvement: '+25%' }
      ],
      quote: {
        text: 'The customer impact has been incredible. We went from taking weeks to respond to data requests to providing instant, accurate responses.',
        author: 'Maria Garcia',
        position: 'Head of Customer Privacy, StyleHub Retail'
      },
      tags: ['dsar-management', 'ai-automation', 'gdpr-compliance'],
      readTime: '6 min read',
      downloadUrl: '/case-studies/stylehub-retail.pdf',
      featured: false
    },
    {
      id: 'insurtech-company',
      title: 'InsurTech Company Streamlines Regulatory Compliance Across Multiple Markets',
      company: 'SecureLife Insurance',
      industry: 'fintech',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
      challenge: 'SecureLife operates across North America and Europe, dealing with complex insurance regulations alongside privacy laws. Maintaining compliance across multiple regulatory frameworks was consuming 60% of their legal resources.',
      solution: 'PrivacyGuard\'s multi-regulatory AI engine tracks changes across insurance and privacy regulations automatically. Our agents generate compliant policies for each market and maintain audit-ready documentation for regulatory examinations.',
      results: [
        { metric: 'Regulatory Compliance', value: '100%', improvement: '+35%' },
        { metric: 'Legal Resource Utilization', value: '25%', improvement: '-58%' },
        { metric: 'Audit Preparation Time', value: '2 days', improvement: '-85%' },
        { metric: 'Cross-Border Data Transfers', value: 'Fully Compliant', improvement: '+100%' }
      ],
      quote: {
        text: 'PrivacyGuard doesn\'t just handle privacy - it understands our industry context. The AI knows insurance regulations as well as privacy laws.',
        author: 'Robert Kim',
        position: 'Chief Compliance Officer, SecureLife Insurance'
      },
      tags: ['gdpr-compliance', 'risk-assessment', 'policy-generation'],
      readTime: '7 min read',
      downloadUrl: '/case-studies/securelife-insurance.pdf',
      featured: false
    }
  ];

  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesIndustry = selectedIndustry === 'all' || study.industry === selectedIndustry;
    const matchesTag = selectedTag === 'all' || study.tags.includes(selectedTag);
    return matchesIndustry && matchesTag;
  });

  const featuredStudies = filteredCaseStudies.filter(study => study.featured);
  const regularStudies = filteredCaseStudies.filter(study => !study.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PrivacyGuard</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/case-studies" className="text-blue-600 font-medium">Case Studies</Link>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Login
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Customer Success Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how organizations worldwide are transforming their privacy compliance 
            with PrivacyGuard's AI-powered automation platform.
          </p>
          
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">95%</p>
              <p className="text-sm text-gray-600">Average Automation Rate</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">85%</p>
              <p className="text-sm text-gray-600">Time Savings</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">10,000+</p>
              <p className="text-sm text-gray-600">Organizations Served</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">99.5%</p>
              <p className="text-sm text-gray-600">Compliance Accuracy</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Case Studies</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name} ({industry.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Solution Type</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Case Studies */}
        {featuredStudies.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Success Stories</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStudies.map((study) => (
                <div key={study.id} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 hover:shadow-lg transition-all">
                  {/* Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <img 
                      src={study.logo} 
                      alt={study.company}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          Featured
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {study.industry}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{study.title}</h3>
                      <p className="text-gray-600">{study.company}</p>
                    </div>
                  </div>

                  {/* Challenge */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Challenge</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {study.challenge.substring(0, 200)}...
                    </p>
                  </div>

                  {/* Results */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {study.results.slice(0, 4).map((result, index) => (
                      <div key={index} className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600 mb-1">{result.value}</p>
                        <p className="text-xs text-gray-600">{result.metric}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="mb-6">
                    <p className="text-gray-700 italic mb-3">"{study.quote.text.substring(0, 120)}..."</p>
                    <footer className="text-sm">
                      <strong className="text-gray-900">{study.quote.author}</strong>
                      <span className="text-gray-600">, {study.quote.position}</span>
                    </footer>
                  </blockquote>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{study.readTime}</span>
                      <div className="flex items-center space-x-1">
                        {study.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <a
                        href={study.downloadUrl}
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">PDF</span>
                      </a>
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium">
                        <span className="text-sm">Read Full Story</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Regular Case Studies */}
        {regularStudies.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">All Case Studies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularStudies.map((study) => (
                <div key={study.id} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-lg transition-all">
                  {/* Header */}
                  <div className="flex items-start space-x-3 mb-4">
                    <img 
                      src={study.logo} 
                      alt={study.company}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {study.industry}
                        </span>
                        <span className="text-xs text-gray-500">{study.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{study.title}</h3>
                      <p className="text-sm text-gray-600">{study.company}</p>
                    </div>
                  </div>

                  {/* Results Preview */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {study.results.slice(0, 2).map((result, index) => (
                      <div key={index} className="text-center p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600 mb-1">{result.value}</p>
                        <p className="text-xs text-gray-600">{result.metric}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {study.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <a
                      href={study.downloadUrl}
                      className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download PDF</span>
                    </a>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium">
                      <span className="text-sm">Read More</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white mt-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Compliance?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of organizations automating their privacy compliance with AI
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold">PrivacyGuard</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered DPO-as-a-Service platform revolutionizing data protection compliance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link to="/case-studies" className="text-gray-400 hover:text-white block">Case Studies</Link>
                <Link to="/documentation" className="text-gray-400 hover:text-white block">Documentation</Link>
                <Link to="/api" className="text-gray-400 hover:text-white block">API Reference</Link>
                <Link to="/blog" className="text-gray-400 hover:text-white block">Blog</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="text-gray-400 hover:text-white block">About</Link>
                <Link to="/careers" className="text-gray-400 hover:text-white block">Careers</Link>
                <Link to="/press" className="text-gray-400 hover:text-white block">Press</Link>
                <Link to="/contact" className="text-gray-400 hover:text-white block">Contact</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>hello@privacyguard.ai</p>
                <p>+1 (555) 123-4567</p>
                <p>San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
