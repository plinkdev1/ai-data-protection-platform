import { Shield, Brain, Globe, MapPin, Clock, Briefcase, ArrowRight, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Careers() {
  const navigate = useNavigate();

  const positions = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      description: 'Build and improve our AI agents for compliance automation at DPOhub. Work with OpenAI, Claude, and custom LLMs.',
      requirements: ['5+ years ML/AI experience', 'Python, TypeScript', 'Experience with LLMs', 'Privacy-tech interest'],
      salary: '$180k - $250k'
    },
    {
      title: 'Compliance Specialist',
      department: 'Legal & Compliance',
      location: 'Remote / London',
      type: 'Full-time', 
      description: 'Expert in GDPR, CCPA, and global privacy laws. Help design compliance automation workflows.',
      requirements: ['GDPR certification', '3+ years compliance experience', 'Legal background preferred', 'Multi-jurisdictional knowledge'],
      salary: '$120k - $160k'
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote / Berlin',
      type: 'Full-time',
      description: 'Design intuitive interfaces for complex compliance workflows. Make privacy accessible through great UX.',
      requirements: ['5+ years product design', 'B2B SaaS experience', 'Figma expertise', 'Systems thinking'],
      salary: '$140k - $180k'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Scale our infrastructure across AWS, GCP, and Azure. Ensure SOC2 and ISO27001 compliance.',
      requirements: ['Kubernetes expertise', 'Multi-cloud experience', 'Security focus', 'Infrastructure as Code'],
      salary: '$160k - $220k'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote / New York',
      type: 'Full-time',
      description: 'Help enterprise customers maximize value from DPOhub. Drive adoption and renewals.',
      requirements: ['B2B SaaS experience', 'Compliance knowledge helpful', 'Customer-focused', 'Data-driven approach'],
      salary: '$100k - $140k'
    },
    {
      title: 'Data Protection Officer (DPO)',
      department: 'Marketplace',
      location: 'Remote / EU',
      type: 'Contract / Part-time',
      description: 'Provide expert DPO services through our marketplace platform. Flexible schedule, competitive rates.',
      requirements: ['DPO certification', 'GDPR expertise', 'Client-facing experience', 'Independent contractor'],
      salary: '$150 - $300/hour'
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness stipends.'
    },
    {
      icon: Globe,
      title: 'Remote-First',
      description: 'Work from anywhere with flexible hours and quarterly team meetups worldwide.'
    },
    {
      icon: Brain,
      title: 'Learning & Growth',
      description: '$5,000 annual learning budget and conference attendance support.'
    },
    {
      icon: Zap,
      title: 'Equity & Impact',
      description: 'Meaningful equity participation and the chance to shape the future of privacy.'
    }
  ];

  const values = [
    {
      title: 'Privacy by Design',
      description: 'We build privacy and security into everything we do, not as an afterthought.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Human-Centric AI',
      description: 'AI should enhance human capabilities, not replace human judgment and empathy.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Global Impact',
      description: 'Our work helps organizations worldwide protect people\'s fundamental right to privacy.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Inclusive Excellence',
      description: 'Diverse perspectives make us stronger. We create an environment where everyone can thrive.',
      color: 'from-orange-500 to-red-500'
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
                <p className="text-xs text-gray-500">Careers</p>
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
            Join Our
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}Mission
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Help us democratize data protection compliance and make privacy accessible to organizations worldwide. 
            We're building the future of AI-powered compliance automation at DPOhub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center space-x-2"
            >
              <span>View Open Positions</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              About DPOhub
            </button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and define our culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl mb-6 flex items-center justify-center`}>
                  <div className="w-8 h-8 bg-white rounded-lg"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Work With Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer competitive benefits and a supportive environment where you can do your best work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-6 mx-auto">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our team of privacy experts, engineers, and innovators building the future of compliance.
            </p>
          </div>
          
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">{position.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">{position.department}</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{position.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{position.type}</span>
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{position.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Requirements:</h4>
                        <ul className="space-y-2">
                          {position.requirements.map((req, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Compensation:</h4>
                        <p className="text-lg font-bold text-green-600">{position.salary}</p>
                        <p className="text-sm text-gray-600">Plus equity and benefits</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 lg:mt-0 lg:ml-8">
                    <button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                      <Briefcase className="w-5 h-5" />
                      <span>Apply Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Hiring Process</h2>
          <p className="text-xl text-gray-600 mb-12">
            We believe in a fair, transparent process that respects your time while finding the best fit.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Application</h3>
              <p className="text-sm text-gray-600">Submit your application and we'll review within 48 hours</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Screening</h3>
              <p className="text-sm text-gray-600">30-minute call to discuss your background and interests</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Interview</h3>
              <p className="text-sm text-gray-600">Technical and cultural fit interviews with the team</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Offer</h3>
              <p className="text-sm text-gray-600">Reference check and offer discussion</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Join Us?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Don't see the perfect role? We're always looking for exceptional talent to join our mission.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center space-x-2">
              <span>Send Us Your Resume</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              Learn More About Us
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
            Building the future of AI-powered compliance automation.
          </p>
          <p className="text-gray-500">
            © 2024 DPOhub. All rights reserved. Built with Mocha.
          </p>
        </div>
      </footer>
    </div>
  );
}
