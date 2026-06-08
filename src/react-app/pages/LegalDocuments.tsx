import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  Shield, 
  Users, 
  Building,
  Search
} from 'lucide-react';

interface LegalDocument {
  id: number;
  document_type: string;
  version: string;
  title: string;
  content: string;
  effective_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserAcceptance {
  id: number;
  document_id: number;
  accepted_at: string;
  digital_signature: string;
}

const documentTypeInfo = {
  tos: {
    name: 'Terms of Service',
    description: 'Platform usage terms and conditions for end-clients',
    icon: FileText,
    color: 'blue',
    audience: 'All Users'
  },
  sla: {
    name: 'Service Level Agreement',
    description: 'Performance standards and remedies for human-in-the-loop services',
    icon: Clock,
    color: 'green',
    audience: 'Clients'
  },
  dpa: {
    name: 'Data Processing Agreement',
    description: 'Data protection terms between platform and users',
    icon: Shield,
    color: 'purple',
    audience: 'Organizations'
  },
  freelancer_agreement: {
    name: 'Freelancer Agreement',
    description: 'Independent contractor terms for service providers',
    icon: Users,
    color: 'orange',
    audience: 'Freelancers'
  },
  partnership_agreement: {
    name: 'Partnership Agreement',
    description: 'Terms for DPO company partnerships',
    icon: Building,
    color: 'red',
    audience: 'DPO Companies'
  }
};

export default function LegalDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [userAcceptances, setUserAcceptances] = useState<UserAcceptance[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    fetchDocuments();
    if (user) {
      fetchUserAcceptances();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/legal-documents');
      const data = await response.json();
      setDocuments(data.filter((doc: LegalDocument) => doc.is_active));
    } catch (error) {
      console.error('Failed to fetch legal documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAcceptances = async () => {
    try {
      const response = await fetch('/api/user-legal-acceptances', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserAcceptances(data);
      }
    } catch (error) {
      console.error('Failed to fetch user acceptances:', error);
    }
  };

  const isDocumentAccepted = (documentId: number) => {
    return userAcceptances.some(acceptance => acceptance.document_id === documentId);
  };

  const handleSignDocument = async (document: LegalDocument) => {
    if (!user) {
      alert('Please sign in to accept legal documents');
      return;
    }

    setSigning(true);
    try {
      const response = await fetch('/api/accept-legal-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          document_id: document.id,
          digital_signature: `${user.email}_${Date.now()}`
        }),
      });

      if (response.ok) {
        await fetchUserAcceptances();
        alert('Document accepted successfully');
      } else {
        throw new Error('Failed to accept document');
      }
    } catch (error) {
      console.error('Document acceptance failed:', error);
      alert('Failed to accept document. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  const downloadDocument = (document: LegalDocument) => {
    const blob = new Blob([document.content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}_v${document.version}.html`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.document_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      red: 'bg-red-100 text-red-700 border-red-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading legal documents...</span>
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
            Legal Documents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Review and accept the legal agreements that govern our platform and services
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Document Types</option>
              {Object.entries(documentTypeInfo).map(([key, info]) => (
                <option key={key} value={key}>{info.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDocuments.map((document) => {
            const typeInfo = documentTypeInfo[document.document_type as keyof typeof documentTypeInfo];
            const IconComponent = typeInfo?.icon || FileText;
            const isAccepted = isDocumentAccepted(document.id);
            
            return (
              <div
                key={document.id}
                className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:bg-white/80 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                      typeInfo ? `bg-${typeInfo.color}-100` : 'bg-gray-100'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        typeInfo ? `text-${typeInfo.color}-600` : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{document.title}</h3>
                      <p className="text-sm text-gray-500">Version {document.version}</p>
                    </div>
                  </div>
                  
                  {isAccepted && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Accepted</span>
                    </div>
                  )}
                </div>

                {typeInfo && (
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getColorClasses(typeInfo.color)}`}>
                      {typeInfo.audience}
                    </span>
                  </div>
                )}

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {typeInfo?.description || 'Legal document for platform usage'}
                </p>

                {document.effective_date && (
                  <p className="text-sm text-gray-500 mb-4">
                    Effective: {new Date(document.effective_date).toLocaleDateString()}
                  </p>
                )}

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedDocument(document)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    View Document
                  </button>
                  
                  <button
                    onClick={() => downloadDocument(document)}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No legal documents are available at the moment'
              }
            </p>
          </div>
        )}
      </div>

      {/* Document Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDocument.title}</h2>
                <p className="text-gray-500">Version {selectedDocument.version}</p>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedDocument.content }}
              />
            </div>
            
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                {isDocumentAccepted(selectedDocument.id) ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Document Accepted</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    You have not accepted this document yet
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => downloadDocument(selectedDocument)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Download
                </button>
                
                {!isDocumentAccepted(selectedDocument.id) && user && (
                  <button
                    onClick={() => handleSignDocument(selectedDocument)}
                    disabled={signing}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {signing ? 'Accepting...' : 'Accept Document'}
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
