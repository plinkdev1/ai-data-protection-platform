import { useState } from 'react';
import { X, Activity, FileCheck, FileText, Users, Brain, AlertTriangle } from 'lucide-react';

interface CreateModalProps {
  type: 'activity' | 'dpia' | 'policy' | 'breach' | 'dsar';
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateProcessingActivityModal({ isOpen, onClose, onSubmit }: Omit<CreateModalProps, 'type'>) {
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    legalBasis: 'contract',
    dataCategories: [] as string[],
    dataSubjects: [] as string[],
    recipients: [] as string[],
    retentionPeriod: '',
    securityMeasures: '',
    riskLevel: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">New Processing Activity</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Customer Data Processing"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
            <textarea
              required
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe the purpose of this processing activity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Legal Basis</label>
            <select
              value={formData.legalBasis}
              onChange={(e) => setFormData({ ...formData, legalBasis: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="consent">Consent</option>
              <option value="contract">Contract</option>
              <option value="legal_obligation">Legal Obligation</option>
              <option value="vital_interests">Vital Interests</option>
              <option value="public_task">Public Task</option>
              <option value="legitimate_interests">Legitimate Interests</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period</label>
              <input
                type="text"
                value={formData.retentionPeriod}
                onChange={(e) => setFormData({ ...formData, retentionPeriod: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 3 years"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateDPIAModal({ isOpen, onClose, onSubmit }: Omit<CreateModalProps, 'type'>) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    processingActivityId: '',
    riskAssessment: {
      likelihood: 'medium',
      impact: 'medium',
      risks: [] as string[]
    },
    mitigationMeasures: [] as string[],
    necessityProportionality: '',
    consultationDetails: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">New DPIA</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DPIA Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Customer Analytics System DPIA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Describe the scope and context of this DPIA"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Likelihood</label>
              <select
                value={formData.riskAssessment.likelihood}
                onChange={(e) => setFormData({
                  ...formData,
                  riskAssessment: { ...formData.riskAssessment, likelihood: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Impact</label>
              <select
                value={formData.riskAssessment.impact}
                onChange={(e) => setFormData({
                  ...formData,
                  riskAssessment: { ...formData.riskAssessment, impact: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Necessity & Proportionality</label>
            <textarea
              value={formData.necessityProportionality}
              onChange={(e) => setFormData({ ...formData, necessityProportionality: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Explain why this processing is necessary and proportionate"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Create DPIA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreatePolicyModal({ isOpen, onClose, onSubmit }: Omit<CreateModalProps, 'type'>) {
  const [formData, setFormData] = useState({
    policyType: 'privacy_policy',
    title: '',
    generateWithAI: false,
    context: {
      organizationName: '',
      industry: '',
      dataCategories: [] as string[],
      legalBases: [] as string[],
      contactEmail: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Generate Policy</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Type</label>
            <select
              value={formData.policyType}
              onChange={(e) => setFormData({ ...formData, policyType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="privacy_policy">Privacy Policy</option>
              <option value="cookie_policy">Cookie Policy</option>
              <option value="data_retention">Data Retention Policy</option>
              <option value="security_policy">Security Policy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Privacy Policy v2.0"
            />
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                id="aiGenerate"
                checked={formData.generateWithAI}
                onChange={(e) => setFormData({ ...formData, generateWithAI: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="aiGenerate" className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Generate with AI assistance</span>
              </label>
            </div>
            <p className="text-sm text-gray-600">
              Use our AI to automatically generate a comprehensive policy based on your organization's context.
            </p>
          </div>

          {formData.generateWithAI && (
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  value={formData.context.organizationName}
                  onChange={(e) => setFormData({
                    ...formData,
                    context: { ...formData.context, organizationName: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.context.industry}
                  onChange={(e) => setFormData({
                    ...formData,
                    context: { ...formData.context, industry: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={formData.context.contactEmail}
                  onChange={(e) => setFormData({
                    ...formData,
                    context: { ...formData.context, contactEmail: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="privacy@yourcompany.com"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              {formData.generateWithAI && <Brain className="w-4 h-4" />}
              <span>{formData.generateWithAI ? 'Generate with AI' : 'Create Policy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateDataBreachModal({ isOpen, onClose, onSubmit }: Omit<CreateModalProps, 'type'>) {
  const [formData, setFormData] = useState({
    incidentType: 'breach',
    severity: 'medium',
    description: '',
    affectedDataTypes: [] as string[],
    affectedIndividualsCount: 0,
    detectionDate: '',
    containmentDate: '',
    notificationRequired: false,
    rootCause: '',
    remediationActions: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Report Data Breach</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Incident Type</label>
              <select
                value={formData.incidentType}
                onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="breach">Data Breach</option>
                <option value="near_miss">Near Miss</option>
                <option value="vulnerability">Vulnerability</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              placeholder="Describe the incident in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Detection Date</label>
              <input
                type="datetime-local"
                value={formData.detectionDate}
                onChange={(e) => setFormData({ ...formData, detectionDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Affected Individuals</label>
              <input
                type="number"
                min="0"
                value={formData.affectedIndividualsCount}
                onChange={(e) => setFormData({ ...formData, affectedIndividualsCount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Number of affected individuals"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notificationRequired"
              checked={formData.notificationRequired}
              onChange={(e) => setFormData({ ...formData, notificationRequired: e.target.checked })}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="notificationRequired" className="text-sm font-medium text-gray-900">
              Regulatory notification required (72-hour rule)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Root Cause (if known)</label>
            <textarea
              value={formData.rootCause}
              onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
              placeholder="Describe the root cause of the incident"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Report Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateDSARModal({ isOpen, onClose, onSubmit }: Omit<CreateModalProps, 'type'>) {
  const [formData, setFormData] = useState({
    requestType: 'access',
    subjectEmail: '',
    subjectName: '',
    requestDetails: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">New Data Subject Request</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
            <select
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="access">Right of Access</option>
              <option value="rectification">Right to Rectification</option>
              <option value="erasure">Right to Erasure</option>
              <option value="portability">Right to Data Portability</option>
              <option value="objection">Right to Object</option>
              <option value="restriction">Right to Restriction</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Email</label>
              <input
                type="email"
                required
                value={formData.subjectEmail}
                onChange={(e) => setFormData({ ...formData, subjectEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="subject@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
              <input
                type="text"
                value={formData.subjectName}
                onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Data subject's full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Details</label>
            <textarea
              value={formData.requestDetails}
              onChange={(e) => setFormData({ ...formData, requestDetails: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
              placeholder="Additional details about the request"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
