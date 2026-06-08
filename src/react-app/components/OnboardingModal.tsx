import { useState, useEffect } from 'react';
import { X, Play, ChevronRight, CheckCircle, Users, Shield, Brain, Globe, Zap, Award } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to DPOHub",
      description: "Your comprehensive platform for data protection and privacy compliance",
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      features: [
        "GDPR, CCPA, PIPL compliance automation",
        "AI-powered risk assessments",
        "Expert DPO marketplace",
        "Interactive learning center"
      ]
    },
    {
      id: 2,
      title: "AI-Powered Compliance",
      description: "Leverage artificial intelligence to automate compliance workflows",
      icon: <Brain className="w-12 h-12 text-purple-600" />,
      features: [
        "Automated policy generation",
        "Smart risk assessments",
        "Intelligent DSAR responses",
        "Compliance gap analysis"
      ]
    },
    {
      id: 3,
      title: "Global Expert Network",
      description: "Access certified DPOs and privacy professionals worldwide",
      icon: <Globe className="w-12 h-12 text-green-600" />,
      features: [
        "Vetted compliance experts",
        "Multi-jurisdictional coverage",
        "24/7 support availability",
        "Quality-assured deliverables"
      ]
    },
    {
      id: 4,
      title: "Learning & Certification",
      description: "Master data protection through interactive learning modules",
      icon: <Award className="w-12 h-12 text-yellow-600" />,
      features: [
        "GDPR fundamentals training",
        "DPO certification prep",
        "Gamified learning experience",
        "Industry best practices"
      ]
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "10x Faster",
      description: "Compliance processes"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "99% Accuracy",
      description: "Risk assessments"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "500+ Experts",
      description: "Global network"
    },
    {
      icon: <Globe className="w-6 h-6 text-purple-500" />,
      title: "6 Jurisdictions",
      description: "Coverage worldwide"
    }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    localStorage.setItem('dpohub_onboarding_completed', 'true');
  };

  const handleComplete = () => {
    onClose();
    localStorage.setItem('dpohub_onboarding_completed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-8">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Transform Your Compliance Journey</h1>
            <p className="text-xl opacity-90">
              Discover how DPOHub revolutionizes data protection and privacy compliance
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-sm opacity-75 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStep === 0 && (
            <div className="text-center">
              {/* Video/Demo Section */}
              <div className="mb-8">
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-6">
                  {!isVideoPlaying ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors"
                           onClick={() => setIsVideoPlaying(true)}>
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Watch Platform Overview</h3>
                      <p className="text-gray-300">3-minute introduction to DPOHub features</p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Loading demo video...</p>
                        <button 
                          onClick={() => setIsVideoPlaying(false)}
                          className="mt-4 text-sm text-gray-300 hover:text-white"
                        >
                          Skip video
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-center mb-2">
                        {benefit.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div>
                <div className="flex items-center mb-6">
                  {steps[currentStep].icon}
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h2>
                    <p className="text-gray-600 mt-1">{steps[currentStep].description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {steps[currentStep].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                    {steps[currentStep].icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-600">
                    Experience the power of automated compliance
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSkip}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Skip Tour
              </button>

              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
