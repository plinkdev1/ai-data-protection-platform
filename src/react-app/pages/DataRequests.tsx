import { useState } from 'react';
import { Plus, Search, Clock, CheckCircle, XCircle, AlertTriangle, Calendar, User } from 'lucide-react';

interface DataSubjectRequest {
  id: number;
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection' | 'restriction';
  subjectEmail: string;
  subjectName?: string;
  status: 'received' | 'in_progress' | 'completed' | 'rejected';
  responseDueDate: string;
  createdAt: string;
  assignedTo?: string;
}

const mockRequests: DataSubjectRequest[] = [
  {
    id: 1,
    requestType: 'access',
    subjectEmail: 'john.doe@example.com',
    subjectName: 'John Doe',
    status: 'in_progress',
    responseDueDate: '2024-02-15',
    createdAt: '2024-01-16',
    assignedTo: 'Sarah Chen',
  },
  {
    id: 2,
    requestType: 'erasure',
    subjectEmail: 'former.customer@example.com',
    status: 'received',
    responseDueDate: '2024-02-20',
    createdAt: '2024-01-21',
  },
  {
    id: 3,
    requestType: 'rectification',
    subjectEmail: 'jane.smith@example.com',
    subjectName: 'Jane Smith',
    status: 'completed',
    responseDueDate: '2024-02-10',
    createdAt: '2024-01-11',
    assignedTo: 'Mike Johnson',
  },
];

export default function DataRequestsPage() {
  const [requests] = useState<DataSubjectRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getRequestTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      access: 'Data Access',
      rectification: 'Data Rectification',
      erasure: 'Data Erasure',
      portability: 'Data Portability',
      objection: 'Object to Processing',
      restriction: 'Restrict Processing',
    };
    return labels[type] || type;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      access: 'bg-blue-50 text-blue-700 border-blue-200',
      rectification: 'bg-orange-50 text-orange-700 border-orange-200',
      erasure: 'bg-red-50 text-red-700 border-red-200',
      portability: 'bg-purple-50 text-purple-700 border-purple-200',
      objection: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      restriction: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.subjectEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (request.subjectName && request.subjectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         getRequestTypeLabel(request.requestType).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Subject Requests</h1>
          <p className="text-gray-600">Manage GDPR data subject access requests (DSARs)</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'in_progress').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {requests.filter(r => getDaysRemaining(r.responseDueDate) < 0 && r.status !== 'completed').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
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
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="received">Received</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRequests.map((request) => {
          const daysRemaining = getDaysRemaining(request.responseDueDate);
          const isOverdue = daysRemaining < 0 && request.status !== 'completed';
          
          return (
            <div
              key={request.id}
              className={`bg-white/70 backdrop-blur-sm border rounded-2xl p-6 hover:bg-white/80 transition-all hover:shadow-lg ${
                isOverdue ? 'border-red-300 bg-red-50/50' : 'border-white/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRequestTypeColor(request.requestType)}`}>
                        {getRequestTypeLabel(request.requestType)}
                      </span>
                      <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span>{request.status.replace('_', ' ')}</span>
                      </span>
                      {isOverdue && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="mb-3">
                      <p className="font-medium text-gray-900">{request.subjectName || request.subjectEmail}</p>
                      {request.subjectName && (
                        <p className="text-sm text-gray-600">{request.subjectEmail}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due {request.responseDueDate}</span>
                        <span className={`ml-1 ${isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-yellow-600' : 'text-gray-500'}`}>
                          ({daysRemaining > 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`})
                        </span>
                      </div>
                      {request.assignedTo && (
                        <span>Assigned to {request.assignedTo}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {request.status === 'received' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Assign
                    </button>
                  )}
                  <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'No data subject requests have been submitted yet'
            }
          </p>
        </div>
      )}

      {/* Create Modal (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Data Subject Request</h2>
            <p className="text-gray-600 mb-6">This form would collect details about the data subject request.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
