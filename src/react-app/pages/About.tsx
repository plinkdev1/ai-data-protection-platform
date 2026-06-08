import { Shield, Users, Brain, Globe, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function About() {
  const navigate = useNavigate();

  const stats = [
    { number: '99.9%', label: 'Compliance Accuracy', description: 'AI + Human oversight ensures precision' },
    { number: '80%', label: 'Cost Reduction', description: 'Compared to traditional DPO services' },
    { number: '24/7', label: 'Monitoring', description: 'Continuous compliance surveillance' },
    { number: '50+', label: 'Frameworks', description: 'Global compliance standards supported' }
  ];

  const team = [
    {
      name: 'Clara',
      role: 'Chief Compliance Officer (AI)',
      description: 'Monitors global regulations and ensures policy compliance across all jurisdictions.',
      specialties: ['GDPR', 'CCPA', 'PIPL', 'Policy Management']
    },
    {
      name: 'Ethan',
      role: 'Document Verification Specialist (AI)',
      description: 'Validates certificates, IDs, and professional credentials with advanced OCR and fraud detection.',
      specialties: ['Document Verification', 'Fraud Detection', 'Certification Validation']
    },
    {
      name: 'Sophia',
      role: 'Data Rights Advocate (AI)',
      description: 'Processes data subject requests and ensures timely, compliant responses.',
      specialties: ['Data Subject Rights', 'DSAR Processing', 'Privacy Advocacy']
    },
    {
      name: 'Victor',
      role: 'Security Incident Commander (AI)',
      description: 'Monitors for security threats and coordinates incident response procedures.',
      specialties: ['Incident Response', 'Security Monitoring', 'Breach Management']
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Privacy by Design',
      description: 'Every feature built with privacy and security as fundamental principles.'
    },
    {
      icon: Brain,
      title: 'AI + Human Excellence',
      description: 'Perfect balance of artificial intelligence efficiency and human expertise.'
    },
    {
      icon: Globe,
      title: 'Global Compliance',
      description: 'Supporting organizations worldwide with localized compliance requirements.'
    },
    {
      icon: Users,
      title: 'Human-Centric',
      description: 'Technology serves people, not the other way around. User experience first.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DPOhub
                </h1>
                <p className="text-xs text-gray-500">About Us</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}DPOhub
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            We're revolutionizing data protection compliance through intelligent automation combined with expert human oversight. 
            Our mission is to make GDPR compliance accessible, affordable, and efficient for organizations worldwide.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                DPOhub was founded on the belief that data protection compliance shouldn't be a burden. 
                Traditional DPO services are expensive, slow, and often out of reach for smaller organizations.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                By combining cutting-edge AI with verified human experts, we've created a platform that delivers 
                enterprise-grade compliance at a fraction of the cost, without sacrificing quality or accuracy.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Democratize access to professional DPO services</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Reduce compliance costs through intelligent automation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Maintain human oversight for critical decisions</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-600 mb-6">
                  A world where every organization, regardless of size, can achieve and maintain 
                  perfect data protection compliance effortlessly.
                </p>
                <div className="text-sm text-gray-500">
                  "Privacy is a fundamental human right, and compliance should be accessible to all."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our AI Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our specialized AI agents work around the clock to ensure your compliance needs are met with precision and care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-blue-600 font-medium">{member.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">{member.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at PrivacyGuard.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-6 mx-auto">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Compliance?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of organizations that trust DPOhub for their data protection needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              Explore Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">DPOhub</span>
          </div>
          <p className="text-gray-400 mb-4">
            AI-powered DPO services for global compliance management.
          </p>
          <p className="text-gray-500">
            © 2024 DPOhub. All rights reserved. Built with Mocha.
          </p>
        </div>
      </footer>
    </div>
  );
}
