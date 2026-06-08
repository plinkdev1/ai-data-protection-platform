import { useState } from 'react';
import { QrCode, Upload, CheckCircle, AlertCircle, Camera, Shield, Award, FileText, Eye } from 'lucide-react';

interface CertificationDocument {
  id: string;
  name: string;
  type: 'certificate' | 'diploma' | 'license' | 'other';
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: string;
  verificationDate?: string;
  url?: string;
}

interface ProviderCertificationProps {
  providerId: string;
  onCertificationComplete: () => void;
}

export default function ProviderCertification({ onCertificationComplete }: ProviderCertificationProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'qr' | 'documents'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [qrScannerActive, setQrScannerActive] = useState(false);
  const [documents, setDocuments] = useState<CertificationDocument[]>([
    {
      id: '1',
      name: 'CIPP/E Certificate',
      type: 'certificate',
      status: 'verified',
      uploadDate: '2024-01-15',
      verificationDate: '2024-01-16',
      url: '/api/documents/cert-1.pdf'
    },
    {
      id: '2',
      name: 'Law Degree (JD)',
      type: 'diploma',
      status: 'pending',
      uploadDate: '2024-01-20'
    }
  ]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDoc: CertificationDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: 'certificate',
        status: 'pending',
        uploadDate: new Date().toISOString().split('T')[0]
      };

      setDocuments(prev => [...prev, newDoc]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleQRScan = () => {
    setQrScannerActive(true);
    // Mock QR scanning process
    setTimeout(() => {
      const scannedDoc: CertificationDocument = {
        id: Date.now().toString(),
        name: 'IAPP Certificate (QR Verified)',
        type: 'certificate',
        status: 'verified',
        uploadDate: new Date().toISOString().split('T')[0],
        verificationDate: new Date().toISOString().split('T')[0]
      };
      
      setDocuments(prev => [...prev, scannedDoc]);
      setQrScannerActive(false);
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending':
        return 'Under Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const verifiedCount = documents.filter(doc => doc.status === 'verified').length;
  const totalCount = documents.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Provider Certification</h1>
          <p className="text-gray-600">Upload and verify your professional certifications</p>
          
          {/* Progress */}
          <div className="mt-6 bg-gray-100 rounded-full p-1">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full px-4 py-2 text-white text-sm font-medium">
              {verifiedCount} of {totalCount} documents verified
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload Documents
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'qr'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <QrCode className="w-4 h-4 inline mr-2" />
            QR Verification
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            My Documents
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Certification</h3>
              <p className="text-gray-600 mb-4">
                Upload your professional certifications, licenses, or diplomas
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="certification-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="certification-upload"
                className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium cursor-pointer hover:bg-blue-700 transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </>
                )}
              </label>
              <p className="text-sm text-gray-500 mt-2">PDF, JPG, PNG up to 10MB</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Accepted Certifications</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• CIPP/E, CIPP/US (Certified Information Privacy Professional)</li>
                <li>• CIPM (Certified Information Privacy Manager)</li>
                <li>• CIPT (Certified Information Privacy Technologist)</li>
                <li>• Law Degrees (JD, LLB, LLM)</li>
                <li>• ISO 27001 Lead Auditor</li>
                <li>• Other relevant professional certifications</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="space-y-6">
            <div className="text-center">
              <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">QR Code Verification</h3>
              <p className="text-gray-600 mb-6">
                Scan QR codes from your digital certificates for instant verification
              </p>

              {!qrScannerActive ? (
                <button
                  onClick={handleQRScan}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
                >
                  <Camera className="w-5 h-5" />
                  <span>Start QR Scanner</span>
                </button>
              ) : (
                <div className="bg-gray-900 rounded-2xl p-8 mx-auto max-w-md">
                  <div className="relative">
                    <div className="w-64 h-64 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Camera className="w-12 h-12 mx-auto mb-2" />
                        <p>Scanning QR Code...</p>
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mt-2"></div>
                      </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-green-500 rounded-lg animate-pulse"></div>
                  </div>
                  <p className="text-white text-sm text-center">
                    Position the QR code within the frame
                  </p>
                </div>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">QR Code Benefits</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Instant verification with issuing authority</li>
                <li>• Real-time authenticity checks</li>
                <li>• Reduced manual review time</li>
                <li>• Enhanced security and trust</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No documents uploaded yet</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      <p className="text-sm text-gray-600">
                        Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        {doc.verificationDate && ` • Verified ${new Date(doc.verificationDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      <span className={`text-sm font-medium ${
                        doc.status === 'verified' ? 'text-green-600' :
                        doc.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {getStatusText(doc.status)}
                      </span>
                    </div>
                    
                    {doc.url && (
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {verifiedCount >= 2 ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Certification requirements met
              </div>
            ) : (
              <div className="flex items-center text-yellow-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                Upload at least 2 verified documents
              </div>
            )}
          </div>

          <button
            onClick={onCertificationComplete}
            disabled={verifiedCount < 2}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Certification
          </button>
        </div>
      </div>
    </div>
  );
}
