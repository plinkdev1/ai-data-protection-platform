import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  CheckCircle, 
  MessageSquare, 
  Settings, 
  Star, 
  DollarSign, 
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
  Eye
} from 'lucide-react';

interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  budget: number;
  deadline: string;
  client_name: string;
  created_at: string;
}

interface ProviderStats {
  activeRequests: number;
  completedServices: number;
  totalEarnings: number;
  rating: number;
  responseTime: string;
}

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [completedServices, setCompletedServices] = useState<ServiceRequest[]>([]);
  const [stats, setStats] = useState<ProviderStats>({
    activeRequests: 0,
    completedServices: 0,
    totalEarnings: 0,
    rating: 0,
    responseTime: '< 2 hours'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviderData();
  }, []);

  const loadProviderData = async () => {
    try {
      setLoading(true);
      
      // Load active service requests assigned to this provider
      const activeResponse = await fetch('/api/service-requests?status=active&provider=true');
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        setServiceRequests(activeData.requests || []);
      }

      // Load completed services
      const completedResponse = await fetch('/api/service-requests?status=completed&provider=true');
      if (completedResponse.ok) {
        const completedData = await completedResponse.json();
        setCompletedServices(completedData.requests || []);
      }

      // Calculate stats
      const totalCompleted = completedServices.length;
      const totalEarnings = completedServices.reduce((sum, service) => sum + (service.budget || 0), 0);
      
      setStats({
        activeRequests: serviceRequests.length,
        completedServices: totalCompleted,
        totalEarnings,
        rating: 4.8, // This would come from provider reviews
        responseTime: '< 2 hours'
      });

    } catch (error) {
      console.error('Error loading provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'active', label: 'Active Services', icon: Briefcase },
    { id: 'completed', label: 'Completed Services', icon: CheckCircle },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Profile Settings', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your provider dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Dashboard</h1>
          <p className="text-gray-600">Manage your services and client communications</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeRequests}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedServices}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
                  <Star className="h-5 w-5 text-yellow-400 ml-1 fill-current" />
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {serviceRequests.slice(0, 3).map((request) => (
                        <div key={request.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{request.title}</p>
                            <p className="text-sm text-gray-500">Client: {request.client_name}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Response Time</span>
                        <span className="font-medium text-gray-900">{stats.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-medium text-gray-900">95%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Client Satisfaction</span>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 mr-1">{stats.rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'active' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Active Service Requests</h3>
                  <span className="text-sm text-gray-500">{serviceRequests.length} active</span>
                </div>
                
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active service requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <div key={request.id} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{request.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status.replace('_', ' ')}
                              </span>
                              <AlertCircle className={`h-4 w-4 ${getPriorityColor(request.priority)}`} />
                            </div>
                            <p className="text-gray-600 mb-3">{request.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span>Client: {request.client_name}</span>
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                ${request.budget?.toLocaleString()}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Due: {new Date(request.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                              View Details
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors">
                              Message Client
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Completed Services</h3>
                  <span className="text-sm text-gray-500">{completedServices.length} completed</span>
                </div>

                {completedServices.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No completed services yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedServices.map((service) => (
                      <div key={service.id} className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{service.title}</h4>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Completed
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{service.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span>Client: {service.client_name}</span>
                              <span className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                ${service.budget?.toLocaleString()}
                              </span>
                              <span>Completed: {new Date(service.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Client Communications</h3>
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Messaging system coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">You'll be able to communicate directly with clients here</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Provider Profile Settings</h3>
                
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="150"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specializations</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="GDPR, CCPA, Privacy Impact Assessments..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your experience and expertise..."
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Availability Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>9 AM - 5 PM (Mon-Fri)</option>
                        <option>8 AM - 6 PM (Mon-Fri)</option>
                        <option>Flexible Hours</option>
                        <option>24/7 Available</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="available"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                        Currently accepting new clients
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
