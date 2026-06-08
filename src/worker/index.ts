import { Hono } from "hono";
import { cors } from "hono/cors";
import policyRoutes from './routes/policy-routes';
import kycRoutes from './routes/kyc-routes';
import providerRoutes from './routes/provider-routes';

interface Env {
  DB: any; // D1Database
  MOCHA_USERS_SERVICE_API_KEY: string;
  MOCHA_USERS_SERVICE_API_URL: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all routes
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'],
  credentials: true,
}));

// Simple OAuth redirect URL endpoint
app.get('/api/oauth/google/redirect_url', async (c) => {
  try {
    // Import the auth functions dynamically to avoid startup issues
    const { getOAuthRedirectUrl } = await import("@getmocha/users-service/backend");
    
    const redirectUrl = await getOAuthRedirectUrl('google', {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    return c.json({ redirectUrl }, 200);
  } catch (error) {
    console.error('OAuth redirect URL error:', error);
    return c.json({ error: "Failed to get OAuth redirect URL" }, 500);
  }
});

// Session exchange endpoint
app.post("/api/sessions", async (c) => {
  try {
    const { exchangeCodeForSessionToken, MOCHA_SESSION_TOKEN_COOKIE_NAME } = await import("@getmocha/users-service/backend");
    const { setCookie } = await import("hono/cookie");
    
    const body = await c.req.json();

    if (!body.code) {
      return c.json({ error: "No authorization code provided" }, 400);
    }

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

// Get current user endpoint with middleware
app.get("/api/users/me", async (c) => {
  try {
    const { authMiddleware } = await import("@getmocha/users-service/backend");
    
    // Apply auth middleware manually
    const middlewareHandler = authMiddleware as any;
    await middlewareHandler(c, async () => {});
    
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }
    
    return c.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: "Failed to get user" }, 500);
  }
});

// Logout endpoint
app.get('/api/logout', async (c) => {
  try {
    const { deleteSession, MOCHA_SESSION_TOKEN_COOKIE_NAME } = await import("@getmocha/users-service/backend");
    const { getCookie, setCookie } = await import("hono/cookie");
    
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

    // Clear the session cookie
    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
      maxAge: 0,
    });

    // Add cache-busting headers
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');

    return c.json({ success: true, redirectTo: '/' }, 200);
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({ error: "Failed to logout" }, 500);
  }
});

// Health check endpoint
app.get('/health', async (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', async (c) => {
  return c.json({ message: 'API is working' });
});

// Basic database query endpoint for policy catalog
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

// Policy catalog endpoint
app.get('/api/policies/catalog', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id, policy_key, title, category, jurisdiction, framework, description,
        mandatory_for, template_content, checklist_items, is_featured, 
        complexity_level, estimated_hours
      FROM policy_catalog 
      ORDER BY is_featured DESC, title ASC
    `).all();

    const catalog = results.map((row: any) => ({
      id: row.id,
      policy_key: row.policy_key,
      title: row.title,
      category: row.category,
      jurisdiction: row.jurisdiction,
      framework: row.framework,
      description: row.description,
      mandatory_for: JSON.parse(row.mandatory_for || '[]'),
      template_content: row.template_content,
      checklist_items: JSON.parse(row.checklist_items || '[]'),
      is_featured: Boolean(row.is_featured),
      complexity_level: row.complexity_level,
      estimated_hours: row.estimated_hours
    }));

    return c.json(catalog);
  } catch (error) {
    console.error('Get policy catalog error:', error);
    return c.json({ error: 'Failed to get policy catalog' }, 500);
  }
});

// Organizations endpoint
app.get('/api/organizations', async (c) => {
  try {
    // Get user from auth middleware
    const { authMiddleware } = await import("@getmocha/users-service/backend");
    await authMiddleware(c, async () => {});
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const { results } = await c.env.DB.prepare(`
      SELECT o.* FROM organizations o
      INNER JOIN user_organizations uo ON o.id = uo.organization_id
      WHERE uo.user_id = ?
    `).bind(user.id).all();

    return c.json(results);
  } catch (error) {
    console.error('Get organizations error:', error);
    return c.json({ error: 'Failed to get organizations' }, 500);
  }
});

// Organization metrics endpoint
app.get('/api/organizations/:id/metrics', async (c) => {
  try {
    const { authMiddleware } = await import("@getmocha/users-service/backend");
    await authMiddleware(c, async () => {});
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const orgId = c.req.param('id');
    
    // Mock metrics for now - in production this would aggregate real data
    const metrics = {
      totalProcessingActivities: 12,
      activeDPIAs: 3,
      pendingDSARs: 2,
      openBreaches: 0,
      complianceScore: 87.5,
      riskTrends: [
        { date: '2025-01', high: 2, medium: 8, low: 15 },
        { date: '2025-02', high: 1, medium: 10, low: 18 },
        { date: '2025-03', high: 0, medium: 7, low: 20 }
      ],
      dsarTrends: [
        { date: '2025-01', received: 5, completed: 4 },
        { date: '2025-02', received: 3, completed: 3 },
        { date: '2025-03', received: 4, completed: 2 }
      ]
    };

    return c.json(metrics);
  } catch (error) {
    console.error('Get metrics error:', error);
    return c.json({ error: 'Failed to get metrics' }, 500);
  }
});

// Create organization endpoint
app.post('/api/organizations', async (c) => {
  try {
    const { authMiddleware } = await import("@getmocha/users-service/backend");
    await authMiddleware(c, async () => {});
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const body = await c.req.json();
    
    // Insert organization
    const orgResult = await c.env.DB.prepare(`
      INSERT INTO organizations (name, domain, industry, size, country, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(body.name, body.domain, body.industry, body.size, body.country).run();

    // Link user to organization
    await c.env.DB.prepare(`
      INSERT INTO user_organizations (user_id, organization_id, role, is_primary_dpo, created_at, updated_at)
      VALUES (?, ?, 'admin', 1, datetime('now'), datetime('now'))
    `).bind(user.id, orgResult.meta.last_row_id).run();

    return c.json({ success: true, id: orgResult.meta.last_row_id });
  } catch (error) {
    console.error('Create organization error:', error);
    return c.json({ error: 'Failed to create organization' }, 500);
  }
});

// Service providers endpoint
app.get('/api/service-providers', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM service_providers WHERE status = 'approved'
    `).all();
    return c.json(results);
  } catch (error) {
    console.error('Get service providers error:', error);
    return c.json({ error: 'Failed to get service providers' }, 500);
  }
});

// Check if user is a provider
app.get('/api/user/provider-status', async (c) => {
  try {
    const { authMiddleware } = await import("@getmocha/users-service/backend");
    await authMiddleware(c, async () => {});
    const user = c.get("user");
    
    if (!user) {
      return c.json({ error: "Not authenticated" }, 401);
    }

    const result = await c.env.DB.prepare(`
      SELECT * FROM service_providers WHERE user_id = ?
    `).bind(user.id).first();

    return c.json({ 
      isProvider: !!result, 
      providerData: result || null 
    });
  } catch (error) {
    console.error('Get provider status error:', error);
    return c.json({ error: 'Failed to get provider status' }, 500);
  }
});

// Mount additional routes
app.route('/api/policies', policyRoutes);
app.route('/api/kyc', kycRoutes);
app.route('/api/provider', providerRoutes);

export default {
  fetch: app.fetch,
};
