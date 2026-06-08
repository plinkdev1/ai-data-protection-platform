import { useState } from 'react';
import { Plus, Search, FileText, Brain, CheckCircle, Clock, Edit } from 'lucide-react';

interface Policy {
  id: number;
  policyType: 'privacy_policy' | 'cookie_policy' | 'data_retention' | 'security_policy';
  title: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  effectiveDate?: string;
  reviewDate?: string;
  aiGenerated: boolean;
  lastUpdated: string;
}

const mockPolicies: Policy[] = [
  {
    id: 1,
    policyType: 'privacy_policy',
    title: 'Privacy Policy v2.1',
    version: '2.1',
    status: 'active',
    effectiveDate: '2024-01-01',
    reviewDate: '2024-07-01',
    aiGenerated: true,
    lastUpdated: '2024-01-15',
  },
  {
    id: 2,
    policyType: 'cookie_policy',
    title: 'Cookie Policy v1.3',
    version: '1.3',
    status: 'active',
    effectiveDate: '2024-01-01',
    reviewDate: '2024-04-01',
    aiGenerated: true,
    lastUpdated: '2024-01-10',
  },
  {
    id: 3,
    policyType: 'data_retention',
    title: 'Data Retention Policy v1.0',
    version: '1.0',
    status: 'draft',
    aiGenerated: false,
    lastUpdated: '2024-01-08',
  },
];

export default function PoliciesPage() {
  const [policies] = useState<Policy[]>(mockPolicies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getPolicyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      privacy_policy: 'Privacy Policy',
      cookie_policy: 'Cookie Policy',
      data_retention: 'Data Retention Policy',
      security_policy: 'Security Policy',
    };
    return labels[type] || type;
  };

  const getPolicyTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      privacy_policy: 'bg-blue-50 text-blue-700 border-blue-200',
      cookie_policy: 'bg-green-50 text-green-700 border-green-200',
      data_retention: 'bg-purple-50 text-purple-700 border-purple-200',
      security_policy: 'bg-red-50 text-red-700 border-red-200',
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getPolicyTypeLabel(policy.policyType).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || policy.status === filterStatus;
    const matchesType = filterType === 'all' || policy.policyType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Policies</h1>
          <p className="text-gray-600">Manage your privacy and compliance documentation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Brain className="w-5 h-5" />
            <span>AI Generate</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Policy</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Policies</p>
              <p className="text-2xl font-bold text-gray-900">
                {policies.filter(p => p.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">AI Generated</p>
              <p className="text-2xl font-bold text-gray-900">
                {policies.filter(p => p.aiGenerated).length}
              </p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Need Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {policies.filter(p => p.reviewDate && new Date(p.reviewDate) <= new Date()).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="privacy_policy">Privacy Policy</option>
            <option value="cookie_policy">Cookie Policy</option>
            <option value="data_retention">Data Retention</option>
            <option value="security_policy">Security Policy</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Policies List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPolicies.map((policy) => {
          const needsReview = policy.reviewDate && new Date(policy.reviewDate) <= new Date();
          
          return (
            <div
              key={policy.id}
              className={`bg-white/70 backdrop-blur-sm border rounded-2xl p-6 hover:bg-white/80 transition-all hover:shadow-lg ${
                needsReview ? 'border-yellow-300 bg-yellow-50/30' : 'border-white/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPolicyTypeColor(policy.policyType)}`}>
                        {getPolicyTypeLabel(policy.policyType)}
                      </span>
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                        {getStatusIcon(policy.status)}
                        <span>{policy.status}</span>
                      </span>
                      {policy.aiGenerated && (
                        <span className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          <Brain className="w-3 h-3" />
                          <span>AI Generated</span>
                        </span>
                      )}
                      {needsReview && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Review Required
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{policy.title}</h3>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Version {policy.version}</span>
                      <span>Updated {policy.lastUpdated}</span>
                      {policy.effectiveDate && <span>Effective {policy.effectiveDate}</span>}
                      {policy.reviewDate && <span>Review by {policy.reviewDate}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPolicies.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No policies found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first compliance policy'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                AI Generate Policy
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Create Manually
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Policy</h2>
            <p className="text-gray-600 mb-6">This would provide options for AI-assisted policy generation or manual creation.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Create Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
