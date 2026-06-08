import { useState, useEffect } from 'react';
import { X, Play, CheckCircle, Users, Shield, Brain, Globe, ArrowRight, Sparkles } from 'lucide-react';

interface WelcomeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function WelcomeVideoModal({ isOpen, onClose, userEmail }: WelcomeVideoModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    {
      title: "Welcome to PrivacyGuard",
      description: "Your AI-powered compliance automation platform",
      icon: Sparkles,
      content: "Transform your GDPR compliance workflow with intelligent automation and expert human oversight."
    },
    {
      title: "AI-Powered Automation",
      description: "Generate policies, assess risks, and manage data subject requests",
      icon: Brain,
      content: "Our AI agents handle routine compliance tasks while ensuring human experts review critical decisions."
    },
    {
      title: "Multi-Organization Management",
      description: "Centralized dashboard for all your compliance needs",
      icon: Globe,
      content: "Manage multiple organizations with role-based access control and comprehensive audit trails."
    },
    {
      title: "Expert DPO Services",
      description: "Professional data protection officer support when you need it",
      icon: Shield,
      content: "Access certified DPO professionals and freelance experts through our marketplace model."
    },
    {
      title: "Human-in-the-Loop Quality",
      description: "Perfect balance of automation and expert oversight",
      icon: Users,
      content: "Every AI decision can be reviewed by qualified professionals, ensuring accuracy and compliance."
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('dpohub_onboarding_completed', 'true');
    if (userEmail) {
      localStorage.setItem(`welcome_shown_${userEmail}`, 'true');
    }
    onClose();
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    // In a real implementation, this would start the actual video
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000); // Simulate 3-second video
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">PrivacyGuard Onboarding</h2>
              <p className="text-sm text-gray-500">Learn how to maximize your compliance workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h3>
                  <p className="text-gray-600">{currentStepData.description}</p>
                </div>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {currentStepData.content}
              </p>

              {/* Feature highlights for each step */}
              {currentStep === 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">99.9% compliance accuracy with AI + human oversight</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Reduce compliance costs by up to 80%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">24/7 automated monitoring and alerts</span>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Clara: Compliance & Policy Agent</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Sophia: Data Subject Requests Agent</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Victor: Incident Response Agent</span>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Manage unlimited organizations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Role-based access control (Admin, DPO, Staff)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Centralized compliance dashboard</span>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Certified DPO professionals available 24/7</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Marketplace of compliance experts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Tiered service levels (Basic, Pro, Enterprise)</span>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700">AI handles routine tasks, humans review critical decisions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700">Complete audit trail for all AI-human interactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700">Configurable approval workflows</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Interactive Demo */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              {!isPlaying ? (
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-48 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mx-auto flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <Play className="w-16 h-16 text-white relative z-10" />
                      <div className="absolute bottom-2 left-2 text-white text-sm font-medium">Demo Video</div>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">See PrivacyGuard in Action</h4>
                  <p className="text-gray-600 mb-6">Watch a 2-minute overview of key features and workflows</p>
                  <button
                    onClick={handlePlayVideo}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
                  >
                    <Play className="w-5 h-5" />
                    <span>Play Demo</span>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-48 h-32 bg-gray-800 rounded-xl mx-auto flex items-center justify-center mb-6 relative">
                    <div className="animate-pulse text-white">Playing Demo...</div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 rounded-full"></div>
                  </div>
                  <p className="text-gray-600">Showing you how PrivacyGuard streamlines GDPR compliance</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <span>Get Started</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
