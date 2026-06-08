import { useState } from 'react';
import { Plus, Search, FileCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface DPIA {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'under_review' | 'approved' | 'rejected';
  riskScore: number;
  createdAt: string;
  reviewedAt?: string;
}

const mockDPIAs: DPIA[] = [
  {
    id: 1,
    title: 'Employee Monitoring System',
    description: 'Assessment for new workplace monitoring software implementation',
    status: 'under_review',
    riskScore: 85,
    createdAt: '2024-01-15',
    reviewedAt: undefined,
  },
  {
    id: 2,
    title: 'Customer Analytics Platform',
    description: 'DPIA for new behavioral analytics and tracking system',
    status: 'approved',
    riskScore: 42,
    createdAt: '2024-01-10',
    reviewedAt: '2024-01-14',
  },
  {
    id: 3,
    title: 'Biometric Access Control',
    description: 'Risk assessment for fingerprint-based building access',
    status: 'draft',
    riskScore: 76,
    createdAt: '2024-01-08',
    reviewedAt: undefined,
  },
];

export default function DPIAsPage() {
  const [dpias] = useState<DPIA[]>(mockDPIAs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'under_review': return <AlertTriangle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileCheck className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const filteredDPIAs = dpias.filter(dpia => {
    const matchesSearch = dpia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dpia.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || dpia.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Protection Impact Assessments</h1>
          <p className="text-gray-600">Manage and track your DPIA processes</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New DPIA</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total DPIAs</p>
              <p className="text-2xl font-bold text-gray-900">{dpias.length}</p>
            </div>
            <FileCheck className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {dpias.filter(d => d.status === 'under_review').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {dpias.filter(d => d.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">
                {dpias.filter(d => d.riskScore >= 80).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
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
              placeholder="Search DPIAs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* DPIAs List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDPIAs.map((dpia) => (
          <div
            key={dpia.id}
            className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:bg-white/80 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{dpia.title}</h3>
                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dpia.status)}`}>
                      {getStatusIcon(dpia.status)}
                      <span>{dpia.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{dpia.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Created {dpia.createdAt}</span>
                    {dpia.reviewedAt && <span>Reviewed {dpia.reviewedAt}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(dpia.riskScore)}`}>
                    Risk: {getRiskLevel(dpia.riskScore)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Score: {dpia.riskScore}/100</p>
                </div>
                <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  View DPIA
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDPIAs.length === 0 && (
        <div className="text-center py-12">
          <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No DPIAs found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first DPIA'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Create First DPIA
            </button>
          )}
        </div>
      )}

      {/* Create Modal (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New DPIA</h2>
            <p className="text-gray-600 mb-6">This wizard would guide users through the DPIA process with AI assistance.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Start DPIA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
