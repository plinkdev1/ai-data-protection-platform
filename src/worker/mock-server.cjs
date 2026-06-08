// Simple mock API server for testing frontend functionality
const http = require('http');
const url = require('url');

const PORT = 8787;

const mockData = {
  organizations: [
    {
      id: 1,
      name: "Acme Corporation",
      domain: "acme.com",
      industry: "Technology",
      size: "large",
      country: "US",
      gdpr_applicable: true,
      dpo_required: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Privacy First Ltd",
      domain: "privacyfirst.co.uk",
      industry: "Consulting",
      size: "medium",
      country: "UK",
      gdpr_applicable: true,
      dpo_required: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  metrics: {
    totalProcessingActivities: 12,
    activeDPIAs: 3,
    pendingDSARs: 5,
    openBreaches: 1,
    complianceScore: 87.5,
    riskTrends: [
      { date: '2024-01-01', high: 2, medium: 5, low: 8 },
      { date: '2024-02-01', high: 1, medium: 6, low: 10 },
      { date: '2024-03-01', high: 3, medium: 4, low: 12 }
    ],
    dsarTrends: [
      { date: '2024-01-01', received: 8, completed: 6 },
      { date: '2024-02-01', received: 12, completed: 10 },
      { date: '2024-03-01', received: 15, completed: 13 }
    ]
  },
  integrations: {
    masterOrchestrator: true,
    availableIntegrations: {
      openai: true,
      anthropic: true,
      auth0: true,
      apolloGateway: true,
      postgresql: true,
      mongodb: true,
      kafka: true,
      redis: true,
      stripe: false,
      sendgrid: true,
      twilio: true,
      datadog: true,
      splunk: false,
      powerbi: false,
      grafana: true,
      onfido: false,
      hyperproof: false,
      vanta: false
    }
  }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  try {
    // Health check endpoint
    if (path === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ok',
        timestamp: new Date().toISOString(),
        enhanced_features: true,
        message: 'Mock API server running'
      }));
      return;
    }

    // Organizations endpoint
    if (path === '/api/organizations') {
      if (method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(mockData.organizations));
        return;
      }
      
      if (method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          try {
            const newOrg = JSON.parse(body);
            const org = {
              id: mockData.organizations.length + 1,
              ...newOrg,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            mockData.organizations.push(org);
            res.writeHead(201);
            res.end(JSON.stringify(org));
          } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }
    }

    // Organization metrics endpoint
    if (path.match(/^\/api\/organizations\/\d+\/metrics$/)) {
      res.writeHead(200);
      res.end(JSON.stringify(mockData.metrics));
      return;
    }

    // Integration status endpoint
    if (path === '/api/integrations/status') {
      res.writeHead(200);
      res.end(JSON.stringify(mockData.integrations));
      return;
    }

    // OAuth redirect URL endpoint
    if (path === '/api/oauth/google/redirect_url') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        redirectUrl: 'https://accounts.google.com/oauth/mock-redirect' 
      }));
      return;
    }

    // Mock user endpoint
    if (path === '/api/users/me') {
      res.writeHead(200);
      res.end(JSON.stringify({
        id: 'user123',
        email: 'demo@privacyguard.com',
        name: 'Demo User'
      }));
      return;
    }

    // AI risk assessment endpoint
    if (path === '/api/ai/basic-risk-assessment') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: {
          riskScore: 8,
          riskLevel: 'medium',
          risks: ['Third-party data sharing increases exposure risk'],
          mitigations: [
            'Implement data minimization principles',
            'Conduct regular security assessments',
            'Establish clear data retention policies'
          ]
        },
        confidence: 0.85,
        reasoning: 'Risk assessment based on processing activity characteristics',
        requiresHumanReview: false
      }));
      return;
    }

    // Default 404 response
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found', path, method }));

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock API server running on http://127.0.0.1:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /health');
  console.log('- GET /api/organizations');
  console.log('- POST /api/organizations');
  console.log('- GET /api/organizations/:id/metrics');
  console.log('- GET /api/integrations/status');
  console.log('- GET /api/oauth/google/redirect_url');
  console.log('- GET /api/users/me');
  console.log('- POST /api/ai/basic-risk-assessment');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
