import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { 
  Search, 
  Star, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Shield,
  Brain,
  Users,
  Award,
  Briefcase
} from 'lucide-react';

interface MarketplaceService {
  id: number;
  service_key: string;
  name: string;
  description: string;
  category: string;
  base_price: number;
  estimated_hours: number;
  complexity_level: string;
  required_tier: string;
  is_active: boolean;
}

interface ServiceProvider {
  id: number;
  user_id: string;
  provider_type: string;
  company_name?: string;
  specializations: string[];
  hourly_rate: number;
  bio: string;
  certifications: string[];
  rating: number;
  total_reviews: number;
  completed_tasks: number;
  status: string;
}

interface ServiceRequest {
  service_id: number;
  title: string;
  description: string;
  requirements: {
    urgency: string;
    specific_needs: string[];
    documents_provided: string[];
    additional_context?: string;
  };
  budget?: number;
  deadline?: string;
  priority: string;
}

const categoryIcons = {
  compliance: Shield,
  legal: FileText,
  assessment: Brain,
  consultation: Users,
};

const complexityColors = {
  basic: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
};

export default function MarketplacePage() {
  const { user } = useAuth();
  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState<MarketplaceService | null>(null);
  const [requestForm, setRequestForm] = useState<ServiceRequest>({
    service_id: 0,
    title: '',
    description: '',
    requirements: {
      urgency: 'normal',
      specific_needs: [],
      documents_provided: [],
    },
    priority: 'normal',
  });

  useEffect(() => {
    fetchServices();
    fetchProviders();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/marketplace-services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/service-providers?status=approved');
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const handleRequestService = (service: MarketplaceService) => {
    if (!user) {
      alert('Please sign in to request services');
      return;
    }
    
    setSelectedService(service);
    setRequestForm(prev => ({
      ...prev,
      service_id: service.id,
      title: `${service.name} Request`,
    }));
    setShowRequestModal(true);
  };

  const submitServiceRequest = async () => {
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestForm),
      });

      if (response.ok) {
        setShowRequestModal(false);
        alert('Service request submitted successfully! You will be notified when a provider accepts your request.');
        setRequestForm({
          service_id: 0,
          title: '',
          description: '',
          requirements: {
            urgency: 'normal',
            specific_needs: [],
            documents_provided: [],
          },
          priority: 'normal',
        });
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Request submission failed:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || service.complexity_level === selectedComplexity;
    return matchesSearch && matchesCategory && matchesComplexity && service.is_active;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.base_price - b.base_price;
      case 'complexity':
        const complexityOrder = { basic: 1, intermediate: 2, advanced: 3 };
        return complexityOrder[a.complexity_level as keyof typeof complexityOrder] - 
               complexityOrder[b.complexity_level as keyof typeof complexityOrder];
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const categories = [...new Set(services.map(s => s.category))];
  const availableProviders = providers.filter(p => p.status === 'approved').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading marketplace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              DPO Services Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with expert data protection professionals for specialized compliance services
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{services.length}</div>
              <div className="text-sm text-gray-600">Services Available</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{availableProviders}</div>
              <div className="text-sm text-gray-600">Expert Providers</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="complexity">Sort by Complexity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map((service) => {
            const IconComponent = categoryIcons[service.category as keyof typeof categoryIcons] || Briefcase;
            
            return (
              <div
                key={service.id}
                className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:bg-white/80 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${complexityColors[service.complexity_level as keyof typeof complexityColors]}`}>
                        {service.complexity_level}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${service.base_price}</div>
                    <div className="text-sm text-gray-500">starting from</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{service.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>~{service.estimated_hours}h</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Award className="w-4 h-4 mr-1" />
                    <span>{service.category}</span>
                  </div>
                </div>

                {service.required_tier && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Requires:</strong> {service.required_tier} tier or higher
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleRequestService(service)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Request Service</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {sortedServices.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all available services
            </p>
          </div>
        )}
      </div>

      {/* Service Request Modal */}
      {showRequestModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Request Service</h2>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedService.name}</h3>
              <p className="text-gray-600 text-sm">{selectedService.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-gray-900">${selectedService.base_price}</span>
                <span className="text-sm text-gray-500">~{selectedService.estimated_hours}h</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={requestForm.title}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief title for your project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={requestForm.description}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide details about your project requirements..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency
                  </label>
                  <select
                    value={requestForm.requirements.urgency}
                    onChange={(e) => setRequestForm(prev => ({
                      ...prev,
                      requirements: { ...prev.requirements, urgency: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low (1-2 weeks)</option>
                    <option value="normal">Normal (3-5 days)</option>
                    <option value="high">High (1-2 days)</option>
                    <option value="urgent">Urgent (24 hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={requestForm.budget || ''}
                      onChange={(e) => setRequestForm(prev => ({ 
                        ...prev, 
                        budget: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your budget"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={requestForm.deadline || ''}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitServiceRequest}
                disabled={!requestForm.title.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
