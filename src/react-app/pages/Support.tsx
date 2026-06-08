import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Book, 
  Phone, 
  Mail, 
  FileText,
  Search,
  Star,
  ExternalLink,
  Download,
  ArrowRight,
  Zap,
  Shield,
  Users,
  TrendingUp
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
  confidence?: number;
}

interface SupportTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_featured: boolean;
}

export default function SupportPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chatbot');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchSupportData();
      initializeChatbot();
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchSupportData = async () => {
    try {
      // Mock data - in real implementation, these would be API calls
      const mockTickets: SupportTicket[] = [
        {
          id: 1,
          subject: 'DPIA Template Question',
          status: 'open',
          priority: 'normal',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          subject: 'Data Breach Notification Process',
          status: 'resolved',
          priority: 'high',
          created_at: '2024-01-10T14:20:00Z'
        }
      ];

      const mockFAQs: FAQ[] = [
        {
          id: 1,
          question: 'When is a DPO appointment mandatory under GDPR?',
          answer: 'A DPO must be appointed when: 1) Core activities involve large-scale regular monitoring of data subjects, 2) Core activities involve large-scale processing of special categories of data, or 3) The organization is a public authority.',
          category: 'gdpr',
          is_featured: true
        },
        {
          id: 2,
          question: 'What is the timeline for GDPR breach notifications?',
          answer: 'Under GDPR, you must notify the supervisory authority within 72 hours of becoming aware of a breach. If the breach poses a high risk to individuals, you must also notify affected data subjects without undue delay.',
          category: 'compliance',
          is_featured: true
        },
        {
          id: 3,
          question: 'How do I conduct a DPIA?',
          answer: 'A DPIA should include: description of processing operations, assessment of necessity and proportionality, identification of risks to data subjects, and measures to address risks. Use our DPIA templates for guidance.',
          category: 'assessment',
          is_featured: true
        },
        {
          id: 4,
          question: 'What are Standard Contractual Clauses (SCCs)?',
          answer: 'SCCs are standard terms approved by the EU Commission for international data transfers. They provide appropriate safeguards for personal data transferred outside the EEA.',
          category: 'transfers',
          is_featured: false
        }
      ];

      setTickets(mockTickets);
      setFaqs(mockFAQs);
    } catch (error) {
      console.error('Failed to fetch support data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeChatbot = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'bot',
      message: 'Hello! I\'m your DPO Assistant. I can help you with GDPR compliance questions, privacy policies, data breach procedures, and more. What would you like to know?',
      timestamp: new Date(),
      confidence: 1.0
    };
    setChatMessages([welcomeMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): ChatMessage => {
    const lowerInput = userInput.toLowerCase();
    
    let response = '';
    let confidence = 0.8;

    if (lowerInput.includes('dpo') || lowerInput.includes('data protection officer')) {
      response = 'A Data Protection Officer (DPO) is mandatory under GDPR Article 37 in specific cases: when core activities involve large-scale monitoring, large-scale processing of special categories of data, or for public authorities. The DPO must be independent, report to highest management, and act as a contact point for data subjects and supervisory authorities.';
    } else if (lowerInput.includes('breach') || lowerInput.includes('incident')) {
      response = 'For data breaches under GDPR: 1) Document the breach immediately, 2) Assess the risk to individuals, 3) Notify the supervisory authority within 72 hours if there\'s a risk, 4) Notify affected individuals if there\'s a high risk. Use our incident response templates in the Policies section.';
    } else if (lowerInput.includes('dpia') || lowerInput.includes('impact assessment')) {
      response = 'A Data Protection Impact Assessment (DPIA) is required when processing is likely to result in high risk to individuals. It should describe the processing, assess necessity/proportionality, identify risks, and outline mitigation measures. Check our DPIA templates and guidance.';
    } else if (lowerInput.includes('consent') || lowerInput.includes('legal basis')) {
      response = 'GDPR provides six legal bases for processing: consent, contract, legal obligation, vital interests, public task, and legitimate interests. Consent must be freely given, specific, informed, and unambiguous. You can withdraw consent at any time.';
    } else if (lowerInput.includes('transfer') || lowerInput.includes('international')) {
      response = 'International data transfers outside the EEA require appropriate safeguards: adequacy decisions, Standard Contractual Clauses (SCCs), Binding Corporate Rules (BCRs), or certification schemes. The UK and some other countries have adequacy decisions.';
    } else {
      response = 'I can help you with GDPR compliance, privacy policies, data breach procedures, DPIAs, international transfers, and more. Could you please be more specific about your question? You can also browse our FAQ section for common topics.';
      confidence = 0.6;
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      message: response,
      timestamp: new Date(),
      confidence
    };
  };

  const filteredFAQs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const featuredFAQs = faqs.filter(faq => faq.is_featured);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to continue</h1>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading support center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
              <p className="text-gray-600 mt-1">
                Get help with compliance questions and platform guidance
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Create Ticket</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Response</p>
                <p className="text-2xl font-bold text-gray-900">2h</p>
              </div>
              <Zap className="w-6 h-6 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold text-gray-900">98%</p>
              </div>
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">4.9★</p>
              </div>
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expert Support</p>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
              </div>
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'chatbot'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span>AI Assistant</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'faq'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'tickets'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>My Tickets</span>
                {tickets.filter(t => t.status === 'open').length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {tickets.filter(t => t.status === 'open').length}
                  </span>
                )}
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'resources'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Book className="w-4 h-4" />
                <span>Resources</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'chatbot' && (
              <div className="max-w-4xl mx-auto">
                {/* Chat Messages */}
                <div className="bg-gray-50 rounded-xl p-4 h-96 overflow-y-auto mb-4">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex items-start space-x-3 mb-4 ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-purple-600 text-white'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      
                      <div className={`flex-1 max-w-xs lg:max-w-md ${
                        message.type === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                          {message.confidence && message.confidence < 0.8 && (
                            <p className="text-xs mt-1 opacity-70">
                              I'm not entirely sure about this. Consider contacting human support.
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me about GDPR, DPIAs, data breaches, or any compliance topic..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Questions */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-900 mb-3">Quick Questions</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'When do I need a DPO?',
                      'How to report a data breach?',
                      'What is a DPIA?',
                      'International data transfers',
                      'GDPR compliance checklist'
                    ].map((question) => (
                      <button
                        key={question}
                        onClick={() => setInputMessage(question)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Featured FAQs */}
                {!searchQuery && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Questions</h3>
                    <div className="space-y-4">
                      {featuredFAQs.map((faq) => (
                        <div key={faq.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <h4 className="font-medium text-blue-900 mb-2">{faq.question}</h4>
                          <p className="text-blue-800 text-sm">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All FAQs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {searchQuery ? 'Search Results' : 'All Questions'}
                  </h3>
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <div key={faq.id} className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                        <p className="text-gray-700 text-sm">{faq.answer}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500 uppercase">{faq.category}</span>
                          <button className="text-blue-600 text-sm hover:text-blue-700">
                            Was this helpful?
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Support Tickets</h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any support tickets yet. Create one if you need help!
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                      Create New Ticket
                    </button>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                            <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority} priority
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                          <span className="text-sm">View</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Book className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Documentation</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Comprehensive guides and documentation for all platform features and compliance requirements.
                  </p>
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                    <span className="text-sm">Browse Docs</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Download className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Templates</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Ready-to-use templates for DPIAs, privacy policies, data mapping, and compliance documentation.
                  </p>
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-700">
                    <span className="text-sm">Download Templates</span>
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Best Practices</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Industry best practices, case studies, and expert guidance for data protection and privacy compliance.
                  </p>
                  <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700">
                    <span className="text-sm">View Guides</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Phone className="w-6 h-6 text-yellow-600" />
                    <h3 className="font-semibold text-gray-900">Phone Support</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Direct phone support for urgent compliance questions and technical assistance.
                  </p>
                  <button className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700">
                    <span className="text-sm">Call Now</span>
                    <Phone className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="w-6 h-6 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Email Support</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Email our compliance experts for detailed questions and personalized guidance.
                  </p>
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-700">
                    <span className="text-sm">Send Email</span>
                    <Mail className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-6 h-6 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Community</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Join our community of DPOs and privacy professionals to share knowledge and experiences.
                  </p>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700">
                    <span className="text-sm">Join Community</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
