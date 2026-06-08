import { useState } from 'react';
import { Search, Filter, Brain, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface AIAuditEntry {
  id: number;
  actionType: 'policy_generation' | 'risk_assessment' | 'dsar_response' | 'compliance_check';
  aiInput: string;
  aiOutput: string;
  humanReviewStatus: 'pending' | 'approved' | 'modified' | 'rejected';
  humanModifications?: string;
  confidenceScore: number;
  modelVersion: string;
  userId: string;
  userEmail: string;
  createdAt: string;
}

const mockAuditEntries: AIAuditEntry[] = [
  {
    id: 1,
    actionType: 'policy_generation',
    aiInput: 'Generate privacy policy for e-commerce website processing customer data',
    aiOutput: 'Privacy Policy v1.0 - comprehensive GDPR-compliant privacy policy generated',
    humanReviewStatus: 'approved',
    confidenceScore: 0.92,
    modelVersion: 'gpt-4-1106-preview',
    userId: '1',
    userEmail: 'sarah.chen@company.com',
    createdAt: '2024-01-20T10:30:00Z',
  },
  {
    id: 2,
    actionType: 'risk_assessment',
    aiInput: 'Assess privacy risk for biometric employee attendance system',
    aiOutput: 'High risk assessment with detailed mitigation recommendations',
    humanReviewStatus: 'modified',
    humanModifications: 'Adjusted risk level from very high to high after additional security measures',
    confidenceScore: 0.87,
    modelVersion: 'gpt-4-1106-preview',
    userId: '2',
    userEmail: 'mike.johnson@company.com',
    createdAt: '2024-01-19T14:15:00Z',
  },
  {
    id: 3,
    actionType: 'dsar_response',
    aiInput: 'Generate response for data access request from john.doe@example.com',
    aiOutput: 'Draft response letter with data compilation and legal explanations',
    humanReviewStatus: 'pending',
    confidenceScore: 0.95,
    modelVersion: 'gpt-4-1106-preview',
    userId: '1',
    userEmail: 'sarah.chen@company.com',
    createdAt: '2024-01-18T09:45:00Z',
  },
  {
    id: 4,
    actionType: 'compliance_check',
    aiInput: 'Verify GDPR compliance for new marketing automation workflow',
    aiOutput: 'Compliance analysis revealing 3 potential issues and recommendations',
    humanReviewStatus: 'rejected',
    humanModifications: 'AI missed critical consent management requirements',
    confidenceScore: 0.78,
    modelVersion: 'gpt-4-1106-preview',
    userId: '3',
    userEmail: 'alex.thompson@company.com',
    createdAt: '2024-01-17T16:20:00Z',
  },
];

export default function AuditTrailPage() {
  const [auditEntries] = useState<AIAuditEntry[]>(mockAuditEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      policy_generation: 'Policy Generation',
      risk_assessment: 'Risk Assessment',
      dsar_response: 'DSAR Response',
      compliance_check: 'Compliance Check',
    };
    return labels[type] || type;
  };

  const getActionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      policy_generation: 'bg-blue-50 text-blue-700 border-blue-200',
      risk_assessment: 'bg-orange-50 text-orange-700 border-orange-200',
      dsar_response: 'bg-purple-50 text-purple-700 border-purple-200',
      compliance_check: 'bg-green-50 text-green-700 border-green-200',
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'modified': return <AlertTriangle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'modified': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-50';
    if (score >= 0.8) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredEntries = auditEntries.filter(entry => {
    const matchesSearch = entry.aiInput.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.aiOutput.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || entry.actionType === filterAction;
    const matchesStatus = filterStatus === 'all' || entry.humanReviewStatus === filterStatus;
    return matchesSearch && matchesAction && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Audit Trail</h1>
          <p className="text-gray-600">Track all AI-assisted actions and human oversight decisions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total AI Actions</p>
              <p className="text-2xl font-bold text-gray-900">{auditEntries.length}</p>
            </div>
            <Brain className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditEntries.filter(e => e.humanReviewStatus === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditEntries.filter(e => e.humanReviewStatus === 'approved').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Confidence</p>
              <p className="text-2xl font-bold text-gray-900">
                {(auditEntries.reduce((sum, e) => sum + e.confidenceScore, 0) / auditEntries.length * 100).toFixed(1)}%
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-500" />
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
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="policy_generation">Policy Generation</option>
              <option value="risk_assessment">Risk Assessment</option>
              <option value="dsar_response">DSAR Response</option>
              <option value="compliance_check">Compliance Check</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="modified">Modified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:bg-white/80 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionTypeColor(entry.actionType)}`}>
                      {getActionTypeLabel(entry.actionType)}
                    </span>
                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.humanReviewStatus)}`}>
                      {getStatusIcon(entry.humanReviewStatus)}
                      <span>{entry.humanReviewStatus}</span>
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(entry.confidenceScore)}`}>
                      {(entry.confidenceScore * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">by {entry.userEmail}</p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{new Date(entry.createdAt).toLocaleDateString()}</p>
                <p>{new Date(entry.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">AI Input:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{entry.aiInput}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">AI Output:</h4>
                <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">{entry.aiOutput}</p>
              </div>

              {entry.humanModifications && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Human Modifications:</h4>
                  <p className="text-sm text-gray-600 bg-yellow-50 rounded-lg p-3">{entry.humanModifications}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>Model: {entry.modelVersion}</span>
                <span>Entry ID: {entry.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit entries found</h3>
          <p className="text-gray-600">
            {searchTerm || filterAction !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'AI audit trail entries will appear here as AI actions are performed'
            }
          </p>
        </div>
      )}
    </div>
  );
}
