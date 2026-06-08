import { useState } from 'react';
import { Clock, ArrowRight, Search, Eye, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  views: number;
  comments: number;
  coverImage: string;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'ai-privacy', name: 'AI & Privacy', count: 8 },
    { id: 'gdpr-compliance', name: 'GDPR Compliance', count: 6 },
    { id: 'industry-insights', name: 'Industry Insights', count: 5 },
    { id: 'product-updates', name: 'Product Updates', count: 3 },
    { id: 'case-studies', name: 'Case Studies', count: 2 }
  ];

  const tags = [
    'AI Automation', 'GDPR', 'Data Protection', 'Compliance', 'DPO', 'Risk Assessment', 
    'DSAR', 'Privacy Policy', 'Data Breach', 'Machine Learning', 'RegTech', 'Legal Tech'
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 'ai-revolution-privacy-compliance',
      title: 'The AI Revolution in Privacy Compliance: How Machine Learning is Transforming Data Protection',
      excerpt: 'Explore how artificial intelligence is revolutionizing privacy compliance, from automated risk assessments to intelligent policy generation. Learn about the latest AI developments reshaping the data protection landscape.',
      author: {
        name: 'Dr. Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
        role: 'Chief AI Officer'
      },
      publishedAt: '2024-03-15',
      readTime: '8 min read',
      category: 'ai-privacy',
      tags: ['AI Automation', 'Machine Learning', 'Compliance'],
      featured: true,
      views: 12500,
      comments: 47,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
    },
    {
      id: 'gdpr-6-years-later',
      title: 'GDPR Six Years Later: Lessons Learned and Future Challenges',
      excerpt: 'A comprehensive analysis of GDPR\'s impact on global data protection practices, enforcement trends, and emerging challenges. What organizations need to know for the next phase of privacy regulation.',
      author: {
        name: 'Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        role: 'Head of Legal Affairs'
      },
      publishedAt: '2024-03-10',
      readTime: '12 min read',
      category: 'gdpr-compliance',
      tags: ['GDPR', 'Data Protection', 'Legal Tech'],
      featured: true,
      views: 8700,
      comments: 32,
      coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800'
    },
    {
      id: 'automated-dsar-processing',
      title: 'Automated DSAR Processing: Reducing Response Times from Weeks to Hours',
      excerpt: 'Discover how AI-powered automation is transforming data subject access request processing. Real-world examples of organizations achieving 95% automation rates while maintaining accuracy.',
      author: {
        name: 'Lisa Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        role: 'Product Manager'
      },
      publishedAt: '2024-03-05',
      readTime: '6 min read',
      category: 'ai-privacy',
      tags: ['DSAR', 'AI Automation', 'Compliance'],
      featured: false,
      views: 5400,
      comments: 18,
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
    },
    {
      id: 'privacy-by-design-2024',
      title: 'Privacy by Design in 2024: Building Compliance into Every Product Decision',
      excerpt: 'Learn how modern organizations are embedding privacy considerations into their product development lifecycle. Practical frameworks and tools for implementing privacy by design principles.',
      author: {
        name: 'James Park',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        role: 'Privacy Engineer'
      },
      publishedAt: '2024-02-28',
      readTime: '10 min read',
      category: 'industry-insights',
      tags: ['Privacy Policy', 'Data Protection', 'Product Development'],
      featured: false,
      views: 7200,
      comments: 25,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'
    },
    {
      id: 'intelligent-agents-privacy',
      title: 'Meet Your AI Privacy Team: How Intelligent Agents Handle Compliance 24/7',
      excerpt: 'An inside look at PrivacyGuard\'s intelligent agent system. Meet Clara, Ethan, Sophia, and Victor - the AI agents revolutionizing how organizations manage privacy compliance.',
      author: {
        name: 'Dr. Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
        role: 'Chief AI Officer'
      },
      publishedAt: '2024-02-20',
      readTime: '7 min read',
      category: 'product-updates',
      tags: ['AI Automation', 'Product Updates', 'DPO'],
      featured: false,
      views: 9100,
      comments: 56,
      coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'
    },
    {
      id: 'global-privacy-landscape-2024',
      title: 'The Global Privacy Landscape 2024: New Regulations and Enforcement Trends',
      excerpt: 'A comprehensive overview of emerging privacy regulations worldwide, from state-level laws in the US to new frameworks in Asia-Pacific. What multinational organizations need to know.',
      author: {
        name: 'Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        role: 'Head of Legal Affairs'
      },
      publishedAt: '2024-02-15',
      readTime: '15 min read',
      category: 'industry-insights',
      tags: ['GDPR', 'Data Protection', 'Global Regulation'],
      featured: false,
      views: 11800,
      comments: 73,
      coverImage: 'https://images.unsplash.com/photo-1519452634265-7b808ac70097?w=800'
    },
    {
      id: 'data-breach-response-automation',
      title: 'Automated Data Breach Response: From Detection to Regulatory Notification',
      excerpt: 'How AI-powered systems can detect, assess, and respond to data breaches in real-time. Learn about automated notification systems that ensure 72-hour compliance requirements are met.',
      author: {
        name: 'Robert Kim',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        role: 'Security Architect'
      },
      publishedAt: '2024-02-10',
      readTime: '9 min read',
      category: 'ai-privacy',
      tags: ['Data Breach', 'AI Automation', 'Incident Response'],
      featured: false,
      views: 6300,
      comments: 29,
      coverImage: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800'
    },
    {
      id: 'dpo-as-a-service-guide',
      title: 'DPO-as-a-Service: The Complete Guide for Growing Organizations',
      excerpt: 'Everything you need to know about DPO-as-a-Service solutions. Compare traditional DPO hiring vs. AI-powered services, cost analysis, and implementation best practices.',
      author: {
        name: 'Lisa Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        role: 'Product Manager'
      },
      publishedAt: '2024-02-05',
      readTime: '11 min read',
      category: 'industry-insights',
      tags: ['DPO', 'Compliance', 'Business Strategy'],
      featured: false,
      views: 8900,
      comments: 41,
      coverImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800'
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
              <Link to="/blog" className="text-blue-600 font-medium">Blog</Link>
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
            Privacy & AI Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Insights, trends, and best practices in AI-powered privacy compliance. 
            Stay ahead of the curve with expert analysis and practical guidance.
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Blog Stats */}
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-600">Articles</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">150K+</p>
              <p className="text-sm text-gray-600">Monthly Readers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">5 min</p>
              <p className="text-sm text-gray-600">Avg Read Time</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Articles</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                  <div className="relative">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                          <p className="text-xs text-gray-500">{post.author.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mt-4 group">
                      <span>Read Article</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                  <div className="relative">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {categories.find(c => c.id === post.category)?.name}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{(post.views / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Read More
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white mt-16">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Privacy Insights</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest articles on AI-powered privacy compliance delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="w-full sm:w-auto bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Subscribe
            </button>
          </div>
          <p className="text-sm opacity-75 mt-4">
            Join 50,000+ privacy professionals. Unsubscribe anytime.
          </p>
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
                <Link to="/blog" className="text-gray-400 hover:text-white block">Blog</Link>
                <Link to="/case-studies" className="text-gray-400 hover:text-white block">Case Studies</Link>
                <Link to="/documentation" className="text-gray-400 hover:text-white block">Documentation</Link>
                <Link to="/api" className="text-gray-400 hover:text-white block">API Reference</Link>
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
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>newsletter@privacyguard.ai</p>
                <p>LinkedIn • Twitter • GitHub</p>
                <p>50,000+ subscribers</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 PrivacyGuard Inc. All rights reserved.
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
