import { Calendar, Download, ExternalLink, FileText, Award, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';

interface PressRelease {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: 'funding' | 'product' | 'partnership' | 'award' | 'milestone';
  readTime: string;
  downloadUrl: string;
}

interface MediaKit {
  name: string;
  description: string;
  type: 'logo' | 'screenshot' | 'document';
  formats: string[];
  downloadUrl: string;
}

export default function PressPage() {
  const pressReleases: PressRelease[] = [
    {
      id: '1',
      title: 'DPOhub Raises $15M Series A to Democratize Data Protection Compliance',
      date: '2024-03-15',
      excerpt: 'AI-powered DPO-as-a-Service platform secures funding from leading privacy-focused investors to expand globally and enhance intelligent automation capabilities.',
      category: 'funding',
      readTime: '3 min read',
      downloadUrl: '/press/series-a-announcement.pdf'
    },
    {
      id: '2',
      title: 'DPOhub Launches Intelligent Agent System for Automated Compliance',
      date: '2024-02-20',
      excerpt: 'Revolutionary AI agents Clara, Ethan, and Sophia now handle 90% of routine compliance tasks, reducing manual workload for data protection officers.',
      category: 'product',
      readTime: '4 min read',
      downloadUrl: '/press/agent-system-launch.pdf'
    },
    {
      id: '3',
      title: 'Strategic Partnership with Microsoft Azure Enhances Enterprise Security',
      date: '2024-01-30',
      excerpt: 'Integration with Azure AI and security services provides enterprise customers with seamless cloud-native compliance solutions.',
      category: 'partnership',
      readTime: '2 min read',
      downloadUrl: '/press/microsoft-partnership.pdf'
    },
    {
      id: '4',
      title: 'DPOhub Wins "Best AI Innovation" at Privacy Tech Awards 2024',
      date: '2024-01-15',
      excerpt: 'Recognition for groundbreaking use of artificial intelligence in automating complex GDPR compliance workflows.',
      category: 'award',
      readTime: '2 min read',
      downloadUrl: '/press/privacy-tech-award.pdf'
    },
    {
      id: '5',
      title: 'Platform Surpasses 10,000 Organizations and 500+ Verified DPO Partners',
      date: '2023-12-10',
      excerpt: 'Milestone achievement demonstrates growing trust in AI-assisted compliance solutions across diverse industries.',
      category: 'milestone',
      readTime: '3 min read',
      downloadUrl: '/press/10k-milestone.pdf'
    }
  ];

  const mediaKit: MediaKit[] = [
    {
      name: 'DPOhub Logo Pack',
      description: 'High-resolution logos in various formats and colorways',
      type: 'logo',
      formats: ['PNG', 'SVG', 'EPS'],
      downloadUrl: '/media/logo-pack.zip'
    },
    {
      name: 'Product Screenshots',
      description: 'High-quality screenshots of dashboard and key features',
      type: 'screenshot',
      formats: ['PNG', 'JPG'],
      downloadUrl: '/media/screenshots.zip'
    },
    {
      name: 'Company Fact Sheet',
      description: 'Key statistics, timeline, and company information',
      type: 'document',
      formats: ['PDF'],
      downloadUrl: '/media/fact-sheet.pdf'
    },
    {
      name: 'Executive Headshots',
      description: 'Professional photos of leadership team',
      type: 'screenshot',
      formats: ['JPG', 'PNG'],
      downloadUrl: '/media/headshots.zip'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'funding':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'product':
        return <FileText className="w-5 h-5 text-blue-600" />;
      case 'partnership':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'award':
        return <Award className="w-5 h-5 text-yellow-600" />;
      case 'milestone':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'funding':
        return 'bg-green-100 text-green-800';
      case 'product':
        return 'bg-blue-100 text-blue-800';
      case 'partnership':
        return 'bg-purple-100 text-purple-800';
      case 'award':
        return 'bg-yellow-100 text-yellow-800';
      case 'milestone':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              <span className="text-xl font-bold text-gray-900">DPOhub</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/careers" className="text-gray-600 hover:text-gray-900">Careers</Link>
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
            Press & Media
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Latest news, announcements, and media resources from DPOhub. 
            Revolutionizing data protection compliance with AI-powered automation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">10,000+</p>
              <p className="text-gray-600">Organizations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">500+</p>
              <p className="text-gray-600">DPO Partners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">99.5%</p>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>
          </div>
        </div>

        {/* Press Contact */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Media Inquiries</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-gray-600">Head of Communications</p>
                  <p className="text-blue-600">press@privacyguard.ai</p>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Partnership Inquiries</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">Michael Chen</p>
                  <p className="text-gray-600">VP of Partnerships</p>
                  <p className="text-blue-600">partnerships@privacyguard.ai</p>
                  <p className="text-gray-600">+1 (555) 123-4568</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Press Releases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release) => (
              <div key={release.id} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(release.category)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(release.category)}`}>
                      {release.category.charAt(0).toUpperCase() + release.category.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">{release.readTime}</span>
                  </div>
                  <time className="text-sm text-gray-500">
                    {new Date(release.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{release.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{release.excerpt}</p>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                    <span>Read Full Release</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <a
                    href={release.downloadUrl}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Media Kit */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Media Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.formats.map((format) => (
                      <span key={format} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {format}
                      </span>
                    ))}
                  </div>
                  <a
                    href={item.downloadUrl}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Statistics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Statistics</h2>
          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">$15M</p>
                <p className="text-gray-700 font-medium">Series A Funding</p>
                <p className="text-sm text-gray-500">Raised in 2024</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">90%</p>
                <p className="text-gray-700 font-medium">Task Automation</p>
                <p className="text-sm text-gray-500">Compliance workload reduction</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-purple-600 mb-2">50+</p>
                <p className="text-gray-700 font-medium">Countries</p>
                <p className="text-sm text-gray-500">Global compliance coverage</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600 mb-2">24/7</p>
                <p className="text-gray-700 font-medium">AI Monitoring</p>
                <p className="text-sm text-gray-500">Continuous compliance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Awards & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Best AI Innovation</h3>
              <p className="text-gray-600 mb-2">Privacy Tech Awards 2024</p>
              <p className="text-sm text-gray-500">Recognized for revolutionary AI agent system</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Fastest Growing</h3>
              <p className="text-gray-600 mb-2">LegalTech Startup 2024</p>
              <p className="text-sm text-gray-500">400% year-over-year growth</p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Customer Choice</h3>
              <p className="text-gray-600 mb-2">Privacy Software Review 2024</p>
              <p className="text-sm text-gray-500">98% customer satisfaction rating</p>
            </div>
          </div>
        </section>
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
                <span className="text-xl font-bold">DPOhub</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered DPO-as-a-Service platform revolutionizing data protection compliance.
              </p>
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
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link to="/documentation" className="text-gray-400 hover:text-white block">Documentation</Link>
                <Link to="/api" className="text-gray-400 hover:text-white block">API Reference</Link>
                <Link to="/case-studies" className="text-gray-400 hover:text-white block">Case Studies</Link>
                <Link to="/blog" className="text-gray-400 hover:text-white block">Blog</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>press@privacyguard.ai</p>
                <p>+1 (555) 123-4567</p>
                <p>San Francisco, CA</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 DPOhub Inc. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/legal" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link to="/legal" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
