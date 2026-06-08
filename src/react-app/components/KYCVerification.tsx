import { useState } from 'react';
import { FileText, Shield, CheckCircle, AlertCircle, Upload, MapPin } from 'lucide-react';

interface KYCDocument {
  id: string;
  type: 'passport' | 'drivers_license' | 'national_id' | 'utility_bill' | 'bank_statement';
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: string;
  verificationDate?: string;
  rejectionReason?: string;
}

interface KYCVerificationProps {
  userId: string;
  onVerificationComplete: () => void;
}

const documentTypes = [
  {
    type: 'passport' as const,
    name: 'Passport',
    description: 'Government-issued passport',
    category: 'identity',
    icon: <FileText className="w-6 h-6" />
  },
  {
    type: 'drivers_license' as const,
    name: "Driver's License",
    description: 'Valid driver\'s license',
    category: 'identity',
    icon: <FileText className="w-6 h-6" />
  },
  {
    type: 'national_id' as const,
    name: 'National ID',
    description: 'Government-issued ID card',
    category: 'identity',
    icon: <FileText className="w-6 h-6" />
  },
  {
    type: 'utility_bill' as const,
    name: 'Utility Bill',
    description: 'Recent utility bill (last 3 months)',
    category: 'address',
    icon: <MapPin className="w-6 h-6" />
  },
  {
    type: 'bank_statement' as const,
    name: 'Bank Statement',
    description: 'Recent bank statement (last 3 months)',
    category: 'address',
    icon: <FileText className="w-6 h-6" />
  }
];

export default function KYCVerification({ onVerificationComplete }: KYCVerificationProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<KYCDocument[]>([
    {
      id: '1',
      type: 'passport',
      status: 'verified',
      uploadDate: '2024-01-15',
      verificationDate: '2024-01-16'
    },
    {
      id: '2',
      type: 'utility_bill',
      status: 'pending',
      uploadDate: '2024-01-20'
    }
  ]);

  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    phoneNumber: ''
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocumentType) return;

    setIsUploading(true);
    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDoc: KYCDocument = {
        id: Date.now().toString(),
        type: selectedDocumentType as any,
        status: 'pending',
        uploadDate: new Date().toISOString().split('T')[0]
      };

      setUploadedDocuments(prev => [...prev, newDoc]);
      setSelectedDocumentType('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
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

  const hasIdentityDoc = uploadedDocuments.some(doc => 
    ['passport', 'drivers_license', 'national_id'].includes(doc.type) && doc.status === 'verified'
  );
  
  const hasAddressDoc = uploadedDocuments.some(doc => 
    ['utility_bill', 'bank_statement'].includes(doc.type) && doc.status === 'verified'
  );

  const isKYCComplete = hasIdentityDoc && hasAddressDoc;

  const steps = [
    { number: 1, title: 'Personal Information', completed: personalInfo.fullName && personalInfo.dateOfBirth },
    { number: 2, title: 'Identity Verification', completed: hasIdentityDoc },
    { number: 3, title: 'Address Verification', completed: hasAddressDoc },
    { number: 4, title: 'Review & Submit', completed: isKYCComplete }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
          <p className="text-gray-600">Complete your identity verification to access all platform features</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : activeStep === step.number
                  ? 'border-blue-500 text-blue-500'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  step.completed ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 ml-6 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full legal name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={personalInfo.nationality}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, nationality: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your nationality"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your full address"
                />
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Identity Verification</h3>
            <p className="text-gray-600 mb-6">
              Please upload a government-issued photo ID document
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {documentTypes.filter(doc => doc.category === 'identity').map((doc) => (
                <button
                  key={doc.type}
                  onClick={() => setSelectedDocumentType(doc.type)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    selectedDocumentType === doc.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-blue-600 mb-2">{doc.icon}</div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedDocumentType && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-4">Upload your {documentTypes.find(d => d.type === selectedDocumentType)?.name}</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="identity-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="identity-upload"
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
              </div>
            )}
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Address Verification</h3>
            <p className="text-gray-600 mb-6">
              Please upload a recent document showing your address (within the last 3 months)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {documentTypes.filter(doc => doc.category === 'address').map((doc) => (
                <button
                  key={doc.type}
                  onClick={() => setSelectedDocumentType(doc.type)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    selectedDocumentType === doc.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-blue-600 mb-2">{doc.icon}</div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedDocumentType && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-4">Upload your {documentTypes.find(d => d.type === selectedDocumentType)?.name}</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="address-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="address-upload"
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
              </div>
            )}
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review & Submit</h3>
            
            {/* Personal Info Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-medium text-gray-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{personalInfo.fullName || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="ml-2 font-medium">{personalInfo.dateOfBirth || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Nationality:</span>
                  <span className="ml-2 font-medium">{personalInfo.nationality || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{personalInfo.phoneNumber || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Documents Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-medium text-gray-900 mb-4">Uploaded Documents</h4>
              <div className="space-y-3">
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600">
                        {documentTypes.find(d => d.type === doc.type)?.icon}
                      </div>
                      <span className="font-medium">
                        {documentTypes.find(d => d.type === doc.type)?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm text-gray-600">
                        {doc.status === 'verified' ? 'Verified' : 
                         doc.status === 'pending' ? 'Under Review' : 'Rejected'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isKYCComplete && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium text-green-900 mb-1">KYC Verification Complete</h4>
                <p className="text-sm text-green-800">
                  Your identity has been successfully verified
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600">
            Step {activeStep} of {steps.length}
          </div>

          {activeStep < 4 ? (
            <button
              onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
              disabled={!steps[activeStep - 1].completed}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={onVerificationComplete}
              disabled={!isKYCComplete}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Verification
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
