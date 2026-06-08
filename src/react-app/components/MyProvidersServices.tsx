import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { 
  User, 
  Star, 
  MessageCircle, 
  FileText, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Search,
  DollarSign
} from 'lucide-react';

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  budget?: number;
  deadline?: string;
  created_at: string;
  provider?: {
    id: number;
    company_name: string;
    rating: number;
    provider_type: string;
  };
  service?: {
    name: string;
    category: string;
  };
}

interface ServiceProvider {
  id: number;
  company_name: string;
  provider_type: string;
  rating: number;
  total_reviews: number;
  specializations: string[];
  hourly_rate: number;
  bio: string;
}

export default function MyProvidersServices() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('active-requests');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch user's service requests
      const requestsResponse = await fetch('/api/user/service-requests', {
        credentials: 'include'
      });
      if (requestsResponse.ok) {
        const requests = await requestsResponse.json();
        setServiceRequests(requests);
      }

      // Fetch available providers
      const providersResponse = await fetch('/api/service-providers', {
        credentials: 'include'
      });
      if (providersResponse.ok) {
        const providers = await providersResponse.json();
        setProviders(providers);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'under_review':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'normal':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'low':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredRequests = serviceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Providers & Services</h2>
            <p className="text-gray-600">Manage your service requests and communicate with providers</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
            Request New Service
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('active-requests')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'active-requests'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Active Requests</span>
              {serviceRequests.filter(r => ['pending', 'assigned', 'in_progress'].includes(r.status)).length > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {serviceRequests.filter(r => ['pending', 'assigned', 'in_progress'].includes(r.status)).length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'completed'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('providers')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'providers'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Available Providers</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('communications')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'communications'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Messages</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
        {(activeTab === 'active-requests' || activeTab === 'completed') && (
          <>
            {/* Search and Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Service Requests */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Service Requests</h3>
                  <p className="text-gray-600">
                    {activeTab === 'active-requests' 
                      ? "You don't have any active service requests."
                      : "You don't have any completed service requests."
                    }
                  </p>
                  <button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
                    Request Service
                  </button>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                          {getPriorityIcon(request.priority)}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        
                        {request.provider && (
                          <div className="flex items-center space-x-2 mb-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              Provider: {request.provider.company_name}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">{request.provider.rating}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                          {request.deadline && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>Due: {new Date(request.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                          {request.budget && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>Budget: ${request.budget}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {request.service && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {request.service.category}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Message</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:text-blue-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div key={provider.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{provider.company_name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{provider.provider_type.replace('_', ' ')}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-xs text-gray-500">({provider.total_reviews})</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.specializations.slice(0, 3).map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {spec}
                        </span>
                      ))}
                      {provider.specializations.length > 3 && (
                        <span className="text-xs text-gray-500">+{provider.specializations.length - 3} more</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{provider.bio}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-900">
                      ${provider.hourly_rate}/hr
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium">
                        View Profile
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'communications' && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages Coming Soon</h3>
            <p className="text-gray-600">
              Direct messaging with your service providers will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
