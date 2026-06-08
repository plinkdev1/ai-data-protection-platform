import { useState } from 'react';
import { Search, Code, Copy, Check, Play, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router';

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  category: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  requestBody?: string;
  response: string;
  example: string;
}

export default function APIReferencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Endpoints', count: 24 },
    { id: 'organizations', name: 'Organizations', count: 6 },
    { id: 'processing', name: 'Processing Activities', count: 5 },
    { id: 'dsar', name: 'Data Subject Requests', count: 4 },
    { id: 'ai', name: 'AI Services', count: 6 },
    { id: 'policies', name: 'Policies', count: 3 }
  ];

  const endpoints: APIEndpoint[] = [
    {
      id: 'create-organization',
      method: 'POST',
      path: '/v1/organizations',
      title: 'Create Organization',
      description: 'Create a new organization in your PrivacyGuard account',
      category: 'organizations',
      parameters: [
        { name: 'name', type: 'string', required: true, description: 'Organization name' },
        { name: 'domain', type: 'string', required: false, description: 'Organization domain' },
        { name: 'industry', type: 'string', required: false, description: 'Industry sector' },
        { name: 'country', type: 'string', required: false, description: 'Country code (ISO 3166-1)' }
      ],
      requestBody: `{
  "name": "Acme Corporation",
  "domain": "acme.com", 
  "industry": "Technology",
  "country": "US",
  "gdpr_applicable": true
}`,
      response: `{
  "id": "org_1234567890",
  "name": "Acme Corporation",
  "domain": "acme.com",
  "industry": "Technology", 
  "country": "US",
  "gdpr_applicable": true,
  "compliance_score": 0,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}`,
      example: `curl -X POST https://api.privacyguard.ai/v1/organizations \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Acme Corporation",
    "domain": "acme.com",
    "industry": "Technology",
    "country": "US",
    "gdpr_applicable": true
  }'`
    },
    {
      id: 'get-organizations',
      method: 'GET', 
      path: '/v1/organizations',
      title: 'List Organizations',
      description: 'Retrieve all organizations in your account',
      category: 'organizations',
      response: `{
  "data": [
    {
      "id": "org_1234567890",
      "name": "Acme Corporation",
      "compliance_score": 87.5,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}`,
      example: `curl -X GET https://api.privacyguard.ai/v1/organizations \\
  -H "Authorization: Bearer your-api-key"`
    },
    {
      id: 'create-processing-activity',
      method: 'POST',
      path: '/v1/organizations/{org_id}/processing-activities',
      title: 'Create Processing Activity',
      description: 'Register a new data processing activity for GDPR Article 30 compliance',
      category: 'processing',
      parameters: [
        { name: 'org_id', type: 'string', required: true, description: 'Organization ID' }
      ],
      requestBody: `{
  "name": "Customer Analytics",
  "purpose": "Website analytics and user behavior analysis",
  "legal_basis": "legitimate_interests",
  "data_categories": ["usage_data", "technical_data"],
  "data_subjects": ["customers", "website_visitors"], 
  "recipients": ["internal_analytics_team"],
  "retention_period": "2 years",
  "security_measures": "Encrypted storage, access controls",
  "risk_level": "medium"
}`,
      response: `{
  "id": "activity_1234567890",
  "organization_id": "org_1234567890",
  "name": "Customer Analytics",
  "purpose": "Website analytics and user behavior analysis",
  "legal_basis": "legitimate_interests",
  "risk_level": "medium",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}`,
      example: `curl -X POST https://api.privacyguard.ai/v1/organizations/org_123/processing-activities \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Customer Analytics",
    "purpose": "Website analytics",
    "legal_basis": "legitimate_interests"
  }'`
    },
    {
      id: 'ai-risk-assessment',
      method: 'POST',
      path: '/v1/ai/assess-risk',
      title: 'AI Risk Assessment',
      description: 'Use AI to automatically assess privacy risk of processing activities',
      category: 'ai',
      requestBody: `{
  "organization_id": "org_1234567890",
  "activity_data": {
    "name": "Customer Analytics",
    "purpose": "User behavior analysis",
    "data_categories": ["usage_data", "personal_data"],
    "third_party_sharing": true,
    "international_transfers": false,
    "automated_decision_making": true,
    "existing_security_measures": ["encryption", "access_controls"]
  }
}`,
      response: `{
  "success": true,
  "data": {
    "risk_score": 75,
    "risk_level": "high", 
    "risks": [
      "Third-party data sharing increases exposure risk",
      "Automated decision making requires transparency measures"
    ],
    "mitigations": [
      "Implement data minimization principles",
      "Establish clear data retention policies",
      "Provide transparency about automated decisions"
    ]
  },
  "confidence": 0.92,
  "requires_human_review": true
}`,
      example: `curl -X POST https://api.privacyguard.ai/v1/ai/assess-risk \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "organization_id": "org_123",
    "activity_data": {
      "name": "Customer Analytics",
      "third_party_sharing": true
    }
  }'`
    },
    {
      id: 'create-dsar',
      method: 'POST',
      path: '/v1/organizations/{org_id}/data-subject-requests',
      title: 'Create Data Subject Request',
      description: 'Create and track a GDPR data subject access request',
      category: 'dsar',
      parameters: [
        { name: 'org_id', type: 'string', required: true, description: 'Organization ID' }
      ],
      requestBody: `{
  "request_type": "access",
  "subject_email": "john.doe@example.com",
  "subject_name": "John Doe",
  "request_details": "Request for all personal data held by the organization"
}`,
      response: `{
  "id": "dsar_1234567890",
  "organization_id": "org_1234567890",
  "request_type": "access",
  "subject_email": "john.doe@example.com",
  "subject_name": "John Doe", 
  "status": "received",
  "verification_status": "pending",
  "response_due_date": "2024-02-14",
  "created_at": "2024-01-15T10:30:00Z"
}`,
      example: `curl -X POST https://api.privacyguard.ai/v1/organizations/org_123/data-subject-requests \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "request_type": "access",
    "subject_email": "john@example.com"
  }'`
    },
    {
      id: 'ai-dsar-response',
      method: 'POST',
      path: '/v1/ai/generate-dsar-response',
      title: 'Generate DSAR Response',
      description: 'AI-generated compliant response to data subject access requests',
      category: 'ai',
      requestBody: `{
  "organization_id": "org_1234567890",
  "dsar_data": {
    "request_type": "access",
    "subject_details": {
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "data_holdings": ["contact_info", "usage_data", "preferences"],
    "legal_bases": ["consent", "legitimate_interests"]
  }
}`,
      response: `{
  "success": true,
  "data": {
    "response": "Dear John Doe,\\n\\nThank you for your data access request...",
    "attachments": ["Data Export.csv", "Privacy Policy.pdf"],
    "next_steps": [
      "Send response within 30 days",
      "Verify identity before data release",
      "Log completion in audit trail"
    ]
  },
  "confidence": 0.88,
  "requires_human_review": true
}`,
      example: `curl -X POST https://api.privacyguard.ai/v1/ai/generate-dsar-response \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "organization_id": "org_123",
    "dsar_data": {
      "request_type": "access",
      "subject_details": {
        "email": "john@example.com"
      }
    }
  }'`
    },
    {
      id: 'ai-generate-policy',
      method: 'POST',
      path: '/v1/ai/generate-policy',
      title: 'Generate Privacy Policy',
      description: 'AI-powered generation of comprehensive privacy policies',
      category: 'ai',
      requestBody: `{
  "organization_id": "org_1234567890",
  "policy_type": "privacy_policy",
  "context": {
    "organization_name": "Acme Corporation",
    "industry": "Technology",
    "data_categories": ["contact_info", "usage_data"],
    "legal_bases": ["consent", "legitimate_interests"],
    "contact_email": "privacy@acme.com"
  }
}`,
      response: `{
  "success": true,
  "policy": {
    "title": "Privacy Policy",
    "content": "# Privacy Policy\\n\\n## 1. Introduction\\n\\nThis privacy policy explains how Acme Corporation...",
    "version": "1.0"
  },
  "confidence": 0.95,
  "requires_human_review": true,
  "reasoning": "Generated comprehensive GDPR-compliant privacy policy based on organization context"
}`,
      example: `curl -X POST https://api.privacyguard.ai/v1/ai/generate-policy \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "organization_id": "org_123",
    "policy_type": "privacy_policy",
    "context": {
      "organization_name": "Acme Corp"
    }
  }'`
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

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesSearch = 
      endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <Link to="/documentation" className="text-gray-600 hover:text-gray-900">Docs</Link>
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
            API Reference
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Complete reference for PrivacyGuard REST API. Automate compliance workflows with AI-powered endpoints.
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-2">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600">Endpoints</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-2">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-2">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">SOC 2</p>
              <p className="text-sm text-gray-600">Compliant</p>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search endpoints..."
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
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Base URL */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Base URL</h4>
                <code className="text-sm bg-gray-100 px-3 py-2 rounded-lg block">
                  https://api.privacyguard.ai
                </code>
              </div>

              {/* Authentication */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                <code className="text-sm bg-gray-100 px-3 py-2 rounded-lg block">
                  Bearer your-api-key
                </code>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {filteredEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{endpoint.title}</h2>
                    <p className="text-gray-600">{endpoint.description}</p>
                  </div>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Try It</span>
                  </button>
                </div>

                {/* Parameters */}
                {endpoint.parameters && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Parameters</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Name</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Type</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Required</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map((param, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-2 px-3 font-mono text-blue-600">{param.name}</td>
                              <td className="py-2 px-3 text-gray-600">{param.type}</td>
                              <td className="py-2 px-3">
                                {param.required ? (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Required</span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">Optional</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-gray-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {endpoint.requestBody && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Body</h3>
                    <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">JSON</span>
                        <button
                          onClick={() => copyToClipboard(endpoint.requestBody!, `${endpoint.id}-request`)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-white"
                        >
                          {copiedCode === `${endpoint.id}-request` ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <pre className="text-green-400 text-sm">
                        <code>{endpoint.requestBody}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Response */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response</h3>
                  <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">JSON</span>
                      <button
                        onClick={() => copyToClipboard(endpoint.response, `${endpoint.id}-response`)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white"
                      >
                        {copiedCode === `${endpoint.id}-response` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <pre className="text-blue-400 text-sm">
                      <code>{endpoint.response}</code>
                    </pre>
                  </div>
                </div>

                {/* Example */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Example</h3>
                  <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">cURL</span>
                      <button
                        onClick={() => copyToClipboard(endpoint.example, `${endpoint.id}-example`)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white"
                      >
                        {copiedCode === `${endpoint.id}-example` ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <pre className="text-yellow-400 text-sm">
                      <code>{endpoint.example}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}

            {filteredEndpoints.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No endpoints found</h3>
                <p className="text-gray-600">Try adjusting your search or category filter</p>
              </div>
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
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link to="/documentation" className="text-gray-400 hover:text-white block">Documentation</Link>
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
                <p>API Status: ✅ Operational</p>
                <p>Response Time: ~200ms</p>
                <p>24/7 Support Chat</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
