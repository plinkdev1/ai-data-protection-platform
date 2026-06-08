import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Star, MessageCircle, CreditCard, Shield, Settings } from 'lucide-react';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  is_featured: boolean;
}

const categoryIcons = {
  general: MessageCircle,
  billing: CreditCard,
  services: Shield,
  technical: Settings,
  legal: Star,
};

const categoryColors = {
  general: 'bg-blue-100 text-blue-700 border-blue-200',
  billing: 'bg-green-100 text-green-700 border-green-200',
  services: 'bg-purple-100 text-purple-700 border-purple-200',
  technical: 'bg-orange-100 text-orange-700 border-orange-200',
  legal: 'bg-red-100 text-red-700 border-red-200',
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [faqs, searchTerm, selectedCategory]);

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faqs');
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by featured first, then alphabetically
    filtered.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return a.question.localeCompare(b.question);
    });

    setFilteredFaqs(filtered);
  };

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const categories = [
    { value: 'all', label: 'All Categories', count: faqs.length },
    { value: 'general', label: 'General', count: faqs.filter(f => f.category === 'general').length },
    { value: 'billing', label: 'Billing', count: faqs.filter(f => f.category === 'billing').length },
    { value: 'services', label: 'Services', count: faqs.filter(f => f.category === 'services').length },
    { value: 'technical', label: 'Technical', count: faqs.filter(f => f.category === 'technical').length },
    { value: 'legal', label: 'Legal', count: faqs.filter(f => f.category === 'legal').length },
  ];

  const featuredFaqs = faqs.filter(faq => faq.is_featured).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading FAQs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our Human-in-the-Loop DPO services, 
            pricing, and platform features.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured FAQs */}
        {featuredFaqs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Popular Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredFaqs.map((faq) => {
                const IconComponent = categoryIcons[faq.category as keyof typeof categoryIcons];
                return (
                  <div
                    key={faq.id}
                    className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:bg-white/80 transition-all cursor-pointer"
                    onClick={() => toggleExpanded(faq.id)}
                  >
                    <div className="flex items-center mb-3">
                      <IconComponent className="w-5 h-5 text-blue-600 mr-2" />
                      <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[faq.category as keyof typeof categoryColors]}`}>
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{faq.answer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No FAQs are available at the moment'
                }
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedItems.has(faq.id);
              const IconComponent = categoryIcons[faq.category as keyof typeof categoryIcons];
              
              return (
                <div
                  key={faq.id}
                  className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:bg-white/80 transition-all"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <IconComponent className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[faq.category as keyof typeof categoryColors]}`}>
                              {faq.category}
                            </span>
                            {faq.is_featured && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 text-left">{faq.question}</h3>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-6 pb-4">
                      <div className="pt-4 border-t border-gray-200">
                        <div
                          className="text-gray-700 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br>') }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-blue-100 mb-6">
            Our support team is here to help you with any questions about our DPO services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors">
              Contact Support
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
