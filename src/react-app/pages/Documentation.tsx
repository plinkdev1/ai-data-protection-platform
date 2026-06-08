import { useState } from 'react';
import { Search, Book, Code, FileText, Play, ExternalLink, Copy, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  sections: {
    id: string;
    title: string;
    content: string;
    codeExample?: string;
  }[];
}

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));

  const documentation: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick start guide to using PrivacyGuard API',
      icon: <Play className="w-5 h-5" />,
      sections: [
        {
          id: 'introduction',
          title: 'Introduction',
          content: `Welcome to PrivacyGuard API documentation. Our AI-powered platform provides comprehensive data protection compliance automation through a simple RESTful API.

Key features:
• Automated GDPR compliance workflows
• AI-powered risk assessments
• Real-time policy generation
• Data subject request automation
• Intelligent breach detection`,
          codeExample: `// Initialize PrivacyGuard client
const privacyGuard = new PrivacyGuard({
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});`
        },
        {
          id: 'authentication',
          title: 'Authentication',
          content: `All API requests must be authenticated using your API key. Include your API key in the Authorization header of every request.

You can find your API key in your dashboard under Settings > API Keys.`,
          codeExample: `curl -X GET https://api.privacyguard.ai/v1/organizations \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json"`
        },
        {
          id: 'rate-limits',
          title: 'Rate Limits',
          content: `API requests are rate limited to ensure fair usage:
• Free tier: 100 requests/hour
• Pro tier: 1,000 requests/hour  
• Enterprise tier: 10,000 requests/hour

Rate limit headers are included in all responses.`,
          codeExample: `// Response headers
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200`
        }
      ]
    },
    {
      id: 'organizations',
      title: 'Organizations',
      description: 'Manage organization settings and compliance data',
      icon: <FileText className="w-5 h-5" />,
      sections: [
        {
          id: 'create-organization',
          title: 'Create Organization',
          content: `Create a new organization in your PrivacyGuard account. This will be the container for all compliance data and activities.`,
          codeExample: `POST /v1/organizations

{
  "name": "Acme Corporation",
  "domain": "acme.com",
  "industry": "Technology",
  "country": "US",
  "gdpr_applicable": true
}`
        },
        {
          id: 'get-organization',
          title: 'Get Organization',
          content: `Retrieve detailed information about a specific organization, including compliance status and key metrics.`,
          codeExample: `GET /v1/organizations/{id}

// Response
{
  "id": "org_12345",
  "name": "Acme Corporation",
  "compliance_score": 87.5,
  "created_at": "2024-01-15T10:30:00Z"
}`
        }
      ]
    },
    {
      id: 'processing-activities',
      title: 'Processing Activities',
      description: 'Document and manage data processing activities',
      icon: <Code className="w-5 h-5" />,
      sections: [
        {
          id: 'create-activity',
          title: 'Create Processing Activity',
          content: `Register a new data processing activity. This is essential for GDPR Article 30 compliance and forms the basis for risk assessments.`,
          codeExample: `POST /v1/organizations/{org_id}/processing-activities

{
  "name": "Customer Analytics",
  "purpose": "Website analytics and user behavior analysis",
  "legal_basis": "legitimate_interests",
  "data_categories": ["usage_data", "technical_data"],
  "data_subjects": ["customers", "website_visitors"],
  "retention_period": "2 years"
}`
        },
        {
          id: 'risk-assessment',
          title: 'AI Risk Assessment',
          content: `Use our AI to automatically assess the privacy risk of processing activities. Our intelligent system analyzes multiple factors to provide accurate risk scores.`,
          codeExample: `POST /v1/ai/assess-risk

{
  "activity_id": "activity_123",
  "factors": {
    "data_sensitivity": "high",
    "third_party_sharing": true,
    "international_transfers": false,
    "automated_decisions": true
  }
}

// Response
{
  "risk_score": 75,
  "risk_level": "high",
  "recommendations": [
    "Implement additional security measures",
    "Conduct DPIA assessment"
  ]
}`
        }
      ]
    },
    {
      id: 'dsar',
      title: 'Data Subject Requests',
      description: 'Automate GDPR data subject access requests',
      icon: <FileText className="w-5 h-5" />,
      sections: [
        {
          id: 'create-dsar',
          title: 'Create DSAR',
          content: `Create and track data subject access requests. Our system automatically handles the 30-day compliance timeline and generates appropriate responses.`,
          codeExample: `POST /v1/organizations/{org_id}/data-subject-requests

{
  "request_type": "access",
  "subject_email": "john@example.com",
  "subject_name": "John Doe",
  "request_details": "Request for all personal data"
}`
        },
        {
          id: 'ai-response',
          title: 'AI Response Generation',
          content: `Generate compliant DSAR responses using our AI. The system creates legally accurate responses based on your organization's data and processing activities.`,
          codeExample: `POST /v1/ai/generate-dsar-response

{
  "request_id": "dsar_123",
  "organization_context": {
    "data_holdings": ["contact_info", "usage_data"],
    "legal_bases": ["consent", "legitimate_interests"]
  }
}

// Response includes generated letter and required attachments`
        }
      ]
    },
    {
      id: 'policies',
      title: 'Policy Generation',
      description: 'AI-powered privacy policy creation',
      icon: <Book className="w-5 h-5" />,
      sections: [
        {
          id: 'generate-policy',
          title: 'Generate Privacy Policy',
          content: `Use our AI to generate comprehensive, legally compliant privacy policies tailored to your organization and jurisdiction requirements.`,
          codeExample: `POST /v1/ai/generate-policy

{
  "policy_type": "privacy_policy",
  "organization": {
    "name": "Acme Corp",
    "industry": "Technology",
    "jurisdiction": "EU"
  },
  "context": {
    "data_categories": ["personal", "usage"],
    "legal_bases": ["consent", "contract"],
    "third_party_sharing": true
  }
}`
        },
        {
          id: 'policy-templates',
          title: 'Policy Templates',
          content: `Access our library of pre-built policy templates for different industries and jurisdictions. Templates are regularly updated to reflect legal changes.`,
          codeExample: `GET /v1/policy-templates?jurisdiction=EU&industry=technology

// Response
{
  "templates": [
    {
      "id": "gdpr_privacy_policy",
      "name": "GDPR Privacy Policy",
      "description": "Comprehensive EU GDPR privacy policy"
    }
  ]
}`
        }
      ]
    },
    {
      id: 'webhooks',
      title: 'Webhooks',
      description: 'Real-time notifications for compliance events',
      icon: <ExternalLink className="w-5 h-5" />,
      sections: [
        {
          id: 'setup-webhooks',
          title: 'Setup Webhooks',
          content: `Configure webhooks to receive real-time notifications about compliance events, DSAR deadlines, and security incidents.`,
          codeExample: `POST /v1/webhooks

{
  "url": "https://your-app.com/privacy-webhook",
  "events": [
    "dsar.created",
    "dsar.deadline_approaching",
    "breach.detected",
    "policy.updated"
  ],
  "secret": "your-webhook-secret"
}`
        },
        {
          id: 'webhook-events',
          title: 'Webhook Events',
          content: `Available webhook events that you can subscribe to for automated compliance monitoring and response.`,
          codeExample: `// Example webhook payload
{
  "event": "dsar.deadline_approaching",
  "data": {
    "request_id": "dsar_123",
    "subject_email": "john@example.com",
    "deadline": "2024-02-15T23:59:59Z",
    "hours_remaining": 24
  },
  "timestamp": "2024-02-14T23:59:59Z"
}`
        }
      ]
    }
  ];

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const filteredDocs = documentation.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.sections.some(section =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PrivacyGuard</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/api" className="text-blue-600 font-medium">API</Link>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Login
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Integrate PrivacyGuard's AI-powered compliance automation into your applications
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Documentation</h3>
              <nav className="space-y-2">
                {filteredDocs.map((doc) => (
                  <div key={doc.id}>
                    <button
                      onClick={() => toggleSection(doc.id)}
                      className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        {doc.icon}
                        <span className="font-medium text-gray-900">{doc.title}</span>
                      </div>
                      {expandedSections.has(doc.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedSections.has(doc.id) && (
                      <div className="ml-6 mt-2 space-y-1">
                        {doc.sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`block w-full text-left py-1 px-2 rounded text-sm transition-colors ${
                              activeSection === section.id
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {section.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {filteredDocs.map((doc) =>
              doc.sections.map((section) =>
                activeSection === section.id ? (
                  <div key={section.id} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8">
                    <div className="flex items-center space-x-3 mb-6">
                      {doc.icon}
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{section.title}</h1>
                        <p className="text-gray-600">{doc.description}</p>
                      </div>
                    </div>

                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-line text-gray-700 leading-relaxed mb-6">
                        {section.content}
                      </div>

                      {section.codeExample && (
                        <div className="bg-gray-900 rounded-xl p-6 overflow-x-auto">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 text-sm font-medium">Example</span>
                            <button
                              onClick={() => copyToClipboard(section.codeExample!, section.id)}
                              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                            >
                              {copiedCode === section.id ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span className="text-sm">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span className="text-sm">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="text-green-400 text-sm">
                            <code>{section.codeExample}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Quick Links */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to="/api"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>API Reference</span>
                        </Link>
                        <Link
                          to="/login"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          <span>Try API</span>
                        </Link>
                        <Link
                          to="/case-studies"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Case Studies</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null
              )
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold">PrivacyGuard</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered DPO-as-a-Service platform revolutionizing data protection compliance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Documentation</h4>
              <div className="space-y-2 text-sm">
                <Link to="/documentation" className="text-gray-400 hover:text-white block">Getting Started</Link>
                <Link to="/api" className="text-gray-400 hover:text-white block">API Reference</Link>
                <Link to="/case-studies" className="text-gray-400 hover:text-white block">Case Studies</Link>
                <Link to="/blog" className="text-gray-400 hover:text-white block">Blog</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <Link to="/about" className="text-gray-400 hover:text-white block">About</Link>
                <Link to="/careers" className="text-gray-400 hover:text-white block">Careers</Link>
                <Link to="/press" className="text-gray-400 hover:text-white block">Press</Link>
                <Link to="/contact" className="text-gray-400 hover:text-white block">Contact</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>hello@privacyguard.ai</p>
                <p>24/7 Support Chat</p>
                <p>API Status</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
