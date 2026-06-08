import { useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { 
  User, 
  Building, 
  FileText, 
  Clock, 
  DollarSign, 
  Award, 
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  CreditCard
} from 'lucide-react';
import ProviderCertification from '../components/ProviderCertification';
import KYCVerification from '../components/KYCVerification';
import PaymentProcessor from '../components/PaymentProcessor';

interface ProviderFormData {
  provider_type: 'freelancer' | 'dpo_company';
  company_name: string;
  business_registration: string;
  specializations: string[];
  hourly_rate: number;
  availability_hours: {
    timezone: string;
    schedule: Record<string, string[]>;
  };
  bio: string;
  certifications: string[];
  portfolio_url: string;
}

const specializations = [
  'GDPR Compliance',
  'CCPA Compliance',
  'Data Protection Impact Assessments',
  'Privacy Policy Development',
  'Data Subject Access Requests',
  'Breach Notification',
  'Data Processing Agreements',
  'Privacy by Design',
  'Consent Management',
  'Data Retention Policies',
  'Vendor Risk Assessment',
  'Cross-border Data Transfers',
];

const certifications = [
  'CIPP/E (Certified Information Privacy Professional - Europe)',
  'CIPP/US (Certified Information Privacy Professional - US)',
  'CIPM (Certified Information Privacy Manager)',
  'CIPT (Certified Information Privacy Technologist)',
  'ISO 27001 Lead Auditor',
  'FIP (Fellow of Information Privacy)',
  'Law Degree (JD/LLB)',
  'MBA in Data Protection',
  'Other Professional Certification',
];

const timeSlots = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
  '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00',
  '17:00-18:00', '18:00-19:00'
];

const timezones = [
  'UTC', 'EST', 'PST', 'GMT', 'CET', 'JST', 'AEST'
];

export default function ProviderSignupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCertification, setShowCertification] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<ProviderFormData>({
    provider_type: 'freelancer',
    company_name: '',
    business_registration: '',
    specializations: [],
    hourly_rate: 50,
    availability_hours: {
      timezone: 'UTC',
      schedule: {}
    },
    bio: '',
    certifications: [],
    portfolio_url: '',
  });

  const totalSteps = 6;

  const handleInputChange = (field: keyof ProviderFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleCertificationToggle = (certification: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(certification)
        ? prev.certifications.filter(c => c !== certification)
        : [...prev.certifications, certification]
    }));
  };

  const handleScheduleChange = (day: string, slots: string[]) => {
    setFormData(prev => ({
      ...prev,
      availability_hours: {
        ...prev.availability_hours,
        schedule: {
          ...prev.availability_hours.schedule,
          [day]: slots
        }
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/service-providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit provider application');
      }

      navigate('/provider-dashboard');
    } catch (error) {
      console.error('Provider signup failed:', error);
      alert('Application submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.provider_type && 
               (formData.provider_type === 'freelancer' || formData.company_name.trim() !== '');
      case 2:
        return formData.specializations.length > 0 && formData.bio.trim() !== '';
      case 3:
        return formData.hourly_rate > 0;
      case 4:
        return formData.certifications.length > 0;
      case 5:
        return true; // KYC verification
      case 6:
        return true; // Payment setup
      default:
        return false;
    }
  };

  const { redirectToLogin } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h1>
          <button
            onClick={redirectToLogin}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Type</h2>
              <p className="text-gray-600">Tell us about your practice</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('provider_type', 'freelancer')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.provider_type === 'freelancer'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Freelancer</h3>
                  <p className="text-sm text-gray-600">Individual data protection professional</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange('provider_type', 'dpo_company')}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.provider_type === 'dpo_company'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">DPO Company</h3>
                  <p className="text-sm text-gray-600">Professional services firm</p>
                </button>
              </div>

              {formData.provider_type === 'dpo_company' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.business_registration}
                      onChange={(e) => handleInputChange('business_registration', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Registration number or tax ID"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Expertise & Background</h2>
              <p className="text-gray-600">Share your specializations and experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specializations * (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {specializations.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleSpecializationToggle(spec)}
                      className={`p-3 text-left rounded-lg border-2 transition-all ${
                        formData.specializations.includes(spec)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{spec}</span>
                        {formData.specializations.includes(spec) && (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your experience, background, and what makes you unique as a data protection professional..."
                />
                <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/1000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.portfolio_url}
                  onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Rates & Availability</h2>
              <p className="text-gray-600">Set your pricing and working hours</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={formData.hourly_rate}
                    onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">This will be your base rate for marketplace services</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Timezone
                </label>
                <select
                  value={formData.availability_hours.timezone}
                  onChange={(e) => handleInputChange('availability_hours', {
                    ...formData.availability_hours,
                    timezone: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Weekly Availability (Optional)
                </label>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">{day}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              const currentSlots = formData.availability_hours.schedule[day] || [];
                              const newSlots = currentSlots.includes(slot)
                                ? currentSlots.filter(s => s !== slot)
                                : [...currentSlots, slot];
                              handleScheduleChange(day, newSlots);
                            }}
                            className={`px-2 py-1 text-xs rounded border transition-all ${
                              (formData.availability_hours.schedule[day] || []).includes(slot)
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Certifications</h2>
              <p className="text-gray-600">Share your professional credentials</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Professional Certifications * (Select all that apply)
              </label>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleCertificationToggle(cert)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      formData.certifications.includes(cert)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cert}</span>
                      {formData.certifications.includes(cert) && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Application Review Process</h3>
              <p className="text-sm text-blue-800">
                After submission, our team will review your application within 2-3 business days. 
                You'll receive an email notification once your profile is approved and you can start accepting client requests.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
              <p className="text-gray-600">Complete KYC verification to start accepting clients</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">Why do we need this?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Comply with financial regulations and anti-money laundering laws</li>
                <li>• Build trust with clients through verified provider profiles</li>
                <li>• Enable secure payment processing and earnings withdrawals</li>
                <li>• Protect against fraud and maintain platform integrity</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowKYC(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                Start Identity Verification
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Setup</h2>
              <p className="text-gray-600">Configure how you'll receive payments from clients</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Bank Transfer (ACH)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>PayPal</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Stripe Connect</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Cryptocurrency</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">Payment Schedule</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly payouts</span>
                    <span className="font-medium">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing time</span>
                    <span className="font-medium">1-3 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction fee</span>
                    <span className="font-medium">2.9% + $0.30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum payout</span>
                    <span className="font-medium">$10.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Setup Complete!</h4>
              <p className="text-sm text-green-800">
                You can configure your payment preferences after your account is approved.
                We'll guide you through connecting your preferred payment method.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Welcome Message */}
          {currentStep === 1 && (
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Join Our Provider Network
              </h1>
              <p className="text-gray-600">
                Connect with clients who need expert data protection services
              </p>
            </div>
          )}

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Certification Modal */}
      {showCertification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ProviderCertification
              providerId={user?.id || ''}
              onCertificationComplete={() => {
                setShowCertification(false);
                setCurrentStep(5);
              }}
            />
            <button
              onClick={() => setShowCertification(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* KYC Modal */}
      {showKYC && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <KYCVerification
              userId={user?.id || ''}
              onVerificationComplete={() => {
                setShowKYC(false);
                setCurrentStep(6);
              }}
            />
            <button
              onClick={() => setShowKYC(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Payment Setup Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <PaymentProcessor
              amount={99}
              currency="USD"
              description="Provider Account Setup Fee"
              onPaymentSuccess={(paymentId) => {
                setShowPayment(false);
                console.log('Payment successful:', paymentId);
              }}
              onPaymentError={(error) => {
                console.error('Payment failed:', error);
              }}
            />
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
