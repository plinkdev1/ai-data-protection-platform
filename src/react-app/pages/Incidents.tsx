import { useState } from 'react';
import { Plus, Search, AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';

interface DataBreach {
  id: number;
  incidentType: 'breach' | 'near_miss' | 'vulnerability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedIndividualsCount: number;
  status: 'open' | 'investigating' | 'contained' | 'resolved';
  detectionDate: string;
  notificationRequired: boolean;
  createdAt: string;
}

const mockBreaches: DataBreach[] = [
  {
    id: 1,
    incidentType: 'breach',
    severity: 'high',
    description: 'Unauthorized access to customer database via SQL injection',
    affectedIndividualsCount: 1250,
    status: 'investigating',
    detectionDate: '2024-01-20',
    notificationRequired: true,
    createdAt: '2024-01-20',
  },
  {
    id: 2,
    incidentType: 'near_miss',
    severity: 'medium',
    description: 'Phishing attempt targeting employee credentials',
    affectedIndividualsCount: 0,
    status: 'contained',
    detectionDate: '2024-01-18',
    notificationRequired: false,
    createdAt: '2024-01-18',
  },
  {
    id: 3,
    incidentType: 'vulnerability',
    severity: 'critical',
    description: 'Unpatched security vulnerability in payment processing system',
    affectedIndividualsCount: 0,
    status: 'resolved',
    detectionDate: '2024-01-15',
    notificationRequired: false,
    createdAt: '2024-01-15',
  },
];

export default function IncidentsPage() {
  const [breaches] = useState<DataBreach[]>(mockBreaches);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4" />;
      case 'investigating': return <Clock className="w-4 h-4" />;
      case 'contained': return <Shield className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'contained': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case 'breach': return 'bg-red-50 text-red-700 border-red-200';
      case 'near_miss': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'vulnerability': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredBreaches = breaches.filter(breach => {
    const matchesSearch = breach.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || breach.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || breach.severity === filterSeverity;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Breaches & Incidents</h1>
          <p className="text-gray-600">Track and manage security incidents and data breaches</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Report Incident</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{breaches.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Open/Investigating</p>
              <p className="text-2xl font-bold text-gray-900">
                {breaches.filter(b => b.status === 'open' || b.status === 'investigating').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical Severity</p>
              <p className="text-2xl font-bold text-gray-900">
                {breaches.filter(b => b.severity === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Affected Individuals</p>
              <p className="text-2xl font-bold text-gray-900">
                {breaches.reduce((sum, b) => sum + b.affectedIndividualsCount, 0).toLocaleString()}
              </p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
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
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="contained">Contained</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredBreaches.map((breach) => (
          <div
            key={breach.id}
            className={`bg-white/70 backdrop-blur-sm border rounded-2xl p-6 hover:bg-white/80 transition-all hover:shadow-lg ${
              breach.severity === 'critical' ? 'border-red-300 bg-red-50/30' : 'border-white/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                  breach.severity === 'critical' ? 'bg-red-600' : 
                  breach.severity === 'high' ? 'bg-orange-500' :
                  breach.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getIncidentTypeColor(breach.incidentType)}`}>
                      {breach.incidentType.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(breach.severity)}`}>
                      {breach.severity} severity
                    </span>
                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(breach.status)}`}>
                      {getStatusIcon(breach.status)}
                      <span>{breach.status}</span>
                    </span>
                    {breach.notificationRequired && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Notification Required
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{breach.description}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Detected: {breach.detectionDate}</span>
                    <span>Affected: {breach.affectedIndividualsCount.toLocaleString()} individuals</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {breach.status !== 'resolved' && (
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Update Status
                  </button>
                )}
                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBreaches.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No incidents found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' || filterSeverity !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No security incidents have been reported'
            }
          </p>
        </div>
      )}

      {/* Create Modal (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Report Security Incident</h2>
            <p className="text-gray-600 mb-6">This form would collect incident details for proper documentation and response.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Report Incident
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
