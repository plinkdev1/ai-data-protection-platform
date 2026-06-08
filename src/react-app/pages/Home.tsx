import { useState, useEffect } from 'react';
import { Shield, ArrowRight, CheckCircle, Brain, Globe, Users, Play, Info, Menu } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import OnboardingModal from '../components/OnboardingModal';
import MobileFooterMenu from '../components/MobileFooterMenu';
import WelcomeVideoModal from '../components/WelcomeVideoModal';

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInfoTooltip, setShowInfoTooltip] = useState<string | null>(null);
  const [isMobileFooterMenuOpen, setIsMobileFooterMenuOpen] = useState(false);
  const [showWelcomeVideo, setShowWelcomeVideo] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, isFetching } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logout flag and reset it
    const isLoggingOutFlag = localStorage.getItem('dpohub_logging_out');
    if (isLoggingOutFlag) {
      setIsLoggingOut(true);
      localStorage.removeItem('dpohub_logging_out');
      // Clear the logout state after the auth context has had time to update
      const timer = setTimeout(() => {
        setIsLoggingOut(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Don't show any modals if we're in the middle of logging out
    if (isLoggingOut) {
      return;
    }

    // Check if user has seen welcome video on first visit
    const hasSeenWelcome = localStorage.getItem('dpohub_welcome_video_shown');
    if (!hasSeenWelcome && !user) {
      const timer = setTimeout(() => {
        setShowWelcomeVideo(true);
        localStorage.setItem('dpohub_welcome_video_shown', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('dpohub_onboarding_completed');
    if (!hasSeenOnboarding && !user) {
      // Show onboarding after a brief delay for non-authenticated users
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, isLoggingOut, isFetching]);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Compliance',
      description: 'Generate privacy policies, conduct risk assessments, and automate DSAR responses with AI assistance.',
    },
    {
      icon: Shield,
      title: 'GDPR Compliance Suite',
      description: 'Complete toolkit for GDPR compliance including DPIAs, processing activities, and breach management.',
    },
    {
      icon: Globe,
      title: 'Multi-Organization Support',
      description: 'Manage multiple organizations with role-based access control and centralized oversight.',
    },
    {
      icon: Users,
      title: 'DPO-as-a-Service',
      description: 'Professional data protection officer services with expert guidance and support.',
    },
  ];

  const benefits = [
    'Automated policy generation with AI',
    'Comprehensive DPIA management',
    'Real-time breach reporting',
    'Audit trail transparency',
    'Expert DPO guidance',
    'Multi-organization dashboard',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DPOhub
                </h1>
                <p className="text-xs text-gray-500">DPO-as-a-Service Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                Marketplace
              </button>
              <button
                onClick={() => navigate('/faq')}
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                FAQ
              </button>
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    User Login
                  </button>
                  <button
                    onClick={() => navigate('/provider-signup')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Join as Provider
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8">
            GDPR Compliance
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Made Simple
            </span>
            <div className="inline-flex items-center ml-4">
              <button
                onMouseEnter={() => setShowInfoTooltip('hero')}
                onMouseLeave={() => setShowInfoTooltip(null)}
                className="relative p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
              >
                <Info className="w-6 h-6 text-blue-600" />
                {showInfoTooltip === 'hero' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-10">
                    <div className="text-center">
                      <p className="font-medium mb-1">Why DPOhub?</p>
                      <p>AI-powered compliance automation with human expert oversight ensures 99% accuracy while reducing compliance costs by 70%.</p>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </button>
            </div>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered data protection platform that simplifies GDPR compliance with automated policy generation, 
            intelligent risk assessments, and professional DPO services.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={handleGetStarted}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setShowOnboarding(true)}
              className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for GDPR Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive suite of tools powered by AI to streamline your data protection workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-6 mx-auto">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Why Choose DPOhub?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of organizations who trust DPOhub for their GDPR compliance needs.
                </p>
                <button
                  onClick={handleGetStarted}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all"
                >
                  Start Your Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">DPOhub</span>
              </div>
              <p className="text-gray-400">
                AI-powered DPO services for global compliance management.
              </p>
            </div>
            
            <div className="hidden md:block">
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/pricing')} className="block text-gray-400 hover:text-white transition-colors">Pricing</button>
                <button onClick={() => navigate('/marketplace')} className="block text-gray-400 hover:text-white transition-colors">Marketplace</button>
                <button onClick={() => navigate('/faq')} className="block text-gray-400 hover:text-white transition-colors">FAQ</button>
                <button onClick={() => navigate('/legal')} className="block text-gray-400 hover:text-white transition-colors">Legal</button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <h3 className="text-lg font-semibold mb-4">For Providers</h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/provider-signup')} className="block text-gray-400 hover:text-white transition-colors">Join as Provider</button>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Provider Guidelines</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Success Stories</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div className="hidden md:block">
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">API Reference</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Case Studies</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileFooterMenuOpen(true)}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl transition-colors w-full"
              >
                <Menu className="w-5 h-5" />
                <span>Browse All Links</span>
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500">
              © 2024 DPOhub. All rights reserved. Built with Mocha.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Footer Menu */}
      <MobileFooterMenu 
        isOpen={isMobileFooterMenuOpen} 
        onClose={() => setIsMobileFooterMenuOpen(false)} 
      />

      {/* Welcome Video Modal */}
      <WelcomeVideoModal
        isOpen={showWelcomeVideo}
        onClose={() => setShowWelcomeVideo(false)}
      />

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </div>
  );
}
