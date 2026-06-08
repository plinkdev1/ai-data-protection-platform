import { Hono } from "hono";
import { cors } from "hono/cors";
import { kyc } from './routes/kyc-routes';
import { policies } from './routes/policy-routes';
import { ApolloServer } from '@apollo/server';
import { 
  authMiddleware,
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { buildSubgraphSchema } from '@apollo/subgraph';
import { MasterOrchestrator } from './integrations/master-orchestrator';

interface Env {
  DB: D1Database;
  MOCHA_USERS_SERVICE_API_KEY: string;
  MOCHA_USERS_SERVICE_API_URL: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  AUTH0_CLIENT_ID?: string;
  AUTH0_CLIENT_SECRET?: string;
  AUTH0_DOMAIN?: string;
  APOLLO_GATEWAY_API_KEY?: string;
  POSTGRESQL_URL?: string;
  MONGODB_ATLAS_URI?: string;
  PINECONE_API_KEY?: string;
  WEAVIATE_API_KEY?: string;
  KAFKA_BROKERS?: string;
  RABBITMQ_URL?: string;
  REDIS_URL?: string;
  ELASTICSEARCH_URL?: string;
  PROMETHEUS_API_KEY?: string;
  GRAFANA_API_KEY?: string;
  JAEGER_ENDPOINT?: string;
  PAGERDUTY_API_KEY?: string;
  AZURE_AD_B2C_CLIENT_ID?: string;
  AZURE_AD_B2C_CLIENT_SECRET?: string;
  HASHICORP_VAULT_TOKEN?: string;
  HASHICORP_VAULT_URL?: string;
  AWS_SECRETS_MANAGER_ACCESS_KEY?: string;
  ROOTLY_API_KEY?: string;
  ACADEMY_OF_MINE_API_KEY?: string;
  EDAPP_API_KEY?: string;
  ONETRUST_API_KEY?: string;
  LEXISNEXIS_API_KEY?: string;
  THOMSON_REUTERS_API_KEY?: string;
  SMARTSUITE_API_KEY?: string;
  PROCESSUNITY_API_KEY?: string;
  LOOKER_API_KEY?: string;
  TABLEAU_API_KEY?: string;
  FRESHCHAT_API_KEY?: string;
  AWS_CLOUDWATCH_ACCESS_KEY?: string;
  GOOGLE_CLOUD_VISION_API_KEY?: string;
  ONFIDO_API_KEY?: string;
  HYPERPROOF_API_KEY?: string;
  VANTA_API_KEY?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  SENDGRID_API_KEY?: string;
  POWER_BI_API_KEY?: string;
  DATADOG_API_KEY?: string;
  SPLUNK_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all routes
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'],
  credentials: true,
}));

// GraphQL Server setup
const schema = buildSubgraphSchema({ 
  typeDefs, 
  resolvers 
});

const server = new ApolloServer({
  schema,
  introspection: true,
});

// Master Orchestrator for enhanced functionality
let masterOrchestrator: MasterOrchestrator | null = null;

async function getMasterOrchestrator(env: Env): Promise<MasterOrchestrator | null> {
  if (masterOrchestrator) return masterOrchestrator;
  
  try {
    // Only initialize if we have the required APIs
    if (env.APOLLO_GATEWAY_API_KEY || env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY) {
      masterOrchestrator = new MasterOrchestrator(env as any);
      await masterOrchestrator.initialize();
      return masterOrchestrator;
    }
  } catch (error) {
    console.error('Master Orchestrator initialization failed:', error);
  }
  
  return null;
}

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  try {
    const sessionToken = await exchangeCodeForSessionToken(body.code, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60, // 60 days
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Session exchange error:', error);
    return c.json({ error: "Failed to exchange code for session" }, 400);
  }
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    try {
      await deleteSession(sessionToken, {
        apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
        apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Clear the session cookie with additional cache-busting headers
  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  // Add cache-busting headers to prevent browser caching
  c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  c.header('Pragma', 'no-cache');
  c.header('Expires', '0');

  return c.json({ success: true, redirectTo: '/' }, 200);
});

// Enhanced endpoint routing through Master Orchestrator
app.all('/api/enhanced/*', async (c) => {
  const orchestrator = await getMasterOrchestrator(c.env);
  
  if (orchestrator) {
    try {
      return await orchestrator.processRequest(c.req.raw);
    } catch (error) {
      console.error('Master Orchestrator request failed:', error);
      return c.json({ error: 'Enhanced features temporarily unavailable' }, 503);
    }
  }
  
  return c.json({ error: 'Enhanced features not available' }, 404);
});

// Add database query endpoint for policy catalog fallback
app.post('/api/db/query', async (c) => {
  try {
    const body = await c.req.json();
    const { sql } = body;
    
    // Only allow SELECT queries for security
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      return c.json({ error: 'Only SELECT queries allowed' }, 400);
    }
    
    const stmt = c.env.DB.prepare(sql);
    const result = await stmt.all();
    return c.json(result.results);
  } catch (error) {
    console.error('Database query failed:', error);
    return c.json({ error: 'Database query failed' }, 500);
  }
});

// Debug endpoint to check routes
app.get('/api/test', async (c) => {
  return c.json({ message: 'API is working' });
});

// Mount route handlers
app.use('/api/kyc/*', authMiddleware);
app.route('/api/kyc', kyc);
app.route('/api/policies', policies);

// Health check endpoint
app.get('/health', async (c) => {
  const orchestrator = await getMasterOrchestrator(c.env);
  
  if (orchestrator) {
    try {
      const health = await orchestrator.getSystemHealth();
      return c.json(health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }
  
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    enhanced_features: !!orchestrator
  });
});

// GraphQL endpoint
app.all('/api/graphql', async (c) => {
  // Create Apollo Server context
  const user = c.get('user');
  const context = {
    user,
    env: c.env,
  };

  try {
    // Parse the request
    const url = new URL(c.req.url);
    const body = c.req.method === 'POST' ? await c.req.text() : undefined;
    
    const headers = new Headers();
    for (const [key, value] of Object.entries(c.req.header())) {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }

    const httpGraphQLRequest = {
      method: c.req.method,
      headers: headers as any,
      body,
      url: url.pathname + url.search,
      search: url.search,
    };

    // Execute GraphQL
    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      httpGraphQLRequest,
      context: () => Promise.resolve(context),
    });

    // Set response headers
    for (const [key, value] of httpGraphQLResponse.headers) {
      c.res.headers.set(key, value);
    }

    if (httpGraphQLResponse.body.kind === 'complete') {
      return new Response(httpGraphQLResponse.body.string, {
        status: httpGraphQLResponse.status || 200,
        headers: c.res.headers,
      });
    }

    // Handle streaming response (for subscriptions, though we don't use them here)
    return new Response("Streaming not supported", { status: 501 });

  } catch (error) {
    console.error('GraphQL execution error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// REST API endpoints for quick operations
app.get('/api/organizations', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const { results } = await c.env.DB.prepare(`
    SELECT o.* FROM organizations o 
    JOIN user_organizations uo ON o.id = uo.organization_id 
    WHERE uo.user_id = ?
    ORDER BY o.created_at DESC
  `).bind(user.id).all();

  return c.json(results);
});

app.post('/api/organizations', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const body = await c.req.json();
  
  // Validate input
  const { validateAndRespond, CreateOrganizationSchema } = await import('./validators/input-validators');
  const validation = validateAndRespond(CreateOrganizationSchema, body);
  
  if (!validation.isValid) {
    return c.json(validation.response, 400);
  }

  const validData = validation.data;
  
  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO organizations (name, domain, industry, size, country, gdpr_applicable, dpo_required)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      validData.name,
      validData.domain || null,
      validData.industry || null,
      validData.size || null,
      validData.country || null,
      validData.gdpr_applicable ? 1 : 0,
      validData.dpo_required ? 1 : 0
    ).run();

    // Add user as admin
    await c.env.DB.prepare(`
      INSERT INTO user_organizations (user_id, organization_id, role, is_primary_dpo)
      VALUES (?, ?, 'admin', ?)
    `).bind(
      user.id,
      result.meta.last_row_id,
      validData.dpo_required ? 1 : 0
    ).run();

    const organization = await c.env.DB.prepare(
      'SELECT * FROM organizations WHERE id = ?'
    ).bind(result.meta.last_row_id).first();

    return c.json(organization);
  } catch (error) {
    console.error('Create organization error:', error);
    return c.json({ error: 'Failed to create organization' }, 500);
  }
});

// Basic AI endpoints (fallback when master orchestrator is not available)
app.post('/api/ai/basic-risk-assessment', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  const body = await c.req.json();
  const { organizationId, activityData } = body;

  try {
    // Verify user has access to this organization
    const userOrg = await c.env.DB.prepare(
      'SELECT * FROM user_organizations WHERE user_id = ? AND organization_id = ?'
    ).bind(user.id, organizationId).first();

    if (!userOrg) {
      return c.json({ error: 'Access denied' }, 403);
    }

    // Basic risk assessment logic
    const riskFactors = [];
    let riskScore = 5;

    if (activityData.thirdPartySharing) {
      riskFactors.push('Third-party data sharing increases exposure risk');
      riskScore += 3;
    }
    
    if (activityData.internationalTransfers) {
      riskFactors.push('International transfers require additional safeguards');
      riskScore += 4;
    }

    if (activityData.automatedDecisionMaking) {
      riskFactors.push('Automated decision making requires transparency measures');
      riskScore += 3;
    }

    const riskLevel = riskScore <= 6 ? 'low' : riskScore <= 12 ? 'medium' : riskScore <= 18 ? 'high' : 'very_high';

    const response = {
      success: true,
      data: {
        riskScore,
        riskLevel,
        risks: riskFactors,
        mitigations: [
          'Implement data minimization principles',
          'Conduct regular security assessments',
          'Establish clear data retention policies',
          'Provide staff training on data protection'
        ]
      },
      confidence: 0.8,
      reasoning: 'Risk assessment based on processing activity characteristics',
      requiresHumanReview: riskScore > 12
    };

    return c.json(response);
  } catch (error) {
    console.error('Basic risk assessment error:', error);
    return c.json({ error: 'Failed to assess risk' }, 500);
  }
});

// Integration status endpoint
app.get('/api/integrations/status', authMiddleware, async (c) => {
  const orchestrator = await getMasterOrchestrator(c.env);
  
  const status = {
    masterOrchestrator: !!orchestrator,
    availableIntegrations: {
      openai: !!c.env.OPENAI_API_KEY,
      anthropic: !!c.env.ANTHROPIC_API_KEY,
      auth0: !!(c.env.AUTH0_CLIENT_ID && c.env.AUTH0_CLIENT_SECRET),
      apolloGateway: !!c.env.APOLLO_GATEWAY_API_KEY,
      postgresql: !!c.env.POSTGRESQL_URL,
      mongodb: !!c.env.MONGODB_ATLAS_URI,
      kafka: !!c.env.KAFKA_BROKERS,
      redis: !!c.env.REDIS_URL,
      stripe: !!c.env.STRIPE_SECRET_KEY,
      sendgrid: !!c.env.SENDGRID_API_KEY,
      twilio: !!(c.env.TWILIO_ACCOUNT_SID && c.env.TWILIO_AUTH_TOKEN),
      datadog: !!c.env.DATADOG_API_KEY,
      splunk: !!c.env.SPLUNK_API_KEY,
      powerbi: !!c.env.POWER_BI_API_KEY,
      grafana: !!c.env.GRAFANA_API_KEY,
      onfido: !!c.env.ONFIDO_API_KEY,
      hyperproof: !!c.env.HYPERPROOF_API_KEY,
      vanta: !!c.env.VANTA_API_KEY,
      vault: !!(c.env.HASHICORP_VAULT_TOKEN && c.env.HASHICORP_VAULT_URL),
    }
  };

  return c.json(status);
});

export default {
  fetch: app.fetch,
};

// Named exports for compatibility
export const fetch = app.fetch;
