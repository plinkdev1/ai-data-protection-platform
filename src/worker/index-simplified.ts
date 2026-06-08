import { Hono } from "hono";
import { cors } from "hono/cors";
import { 
  authMiddleware,
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME
} from "@getmocha/users-service/backend";
import { getCookie, setCookie } from "hono/cookie";

interface Env {
  DB: D1Database;
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

// Authentication endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  try {
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

app.post("/api/sessions", async (c) => {
  try {
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

app.get("/api/users/me", authMiddleware, async (c) => {
  try {
    return c.json(c.get("user"));
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: "Failed to get user" }, 500);
  }
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

// Organizations endpoints
app.get('/api/organizations', authMiddleware, async (c) => {
  try {
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
  } catch (error) {
    console.error('Get organizations error:', error);
    return c.json({ error: 'Failed to get organizations' }, 500);
  }
});

app.post('/api/organizations', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const body = await c.req.json();
    
    // Basic validation
    if (!body.name) {
      return c.json({ error: 'Organization name is required' }, 400);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO organizations (name, domain, industry, size, country, gdpr_applicable, dpo_required)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.name,
      body.domain || null,
      body.industry || null,
      body.size || null,
      body.country || null,
      body.gdpr_applicable ? 1 : 0,
      body.dpo_required ? 1 : 0
    ).run();

    // Add user as admin
    await c.env.DB.prepare(`
      INSERT INTO user_organizations (user_id, organization_id, role, is_primary_dpo)
      VALUES (?, ?, 'admin', ?)
    `).bind(
      user.id,
      result.meta.last_row_id,
      body.dpo_required ? 1 : 0
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

// Policy catalog endpoints
app.get('/api/policies/catalog', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM policy_catalog 
      WHERE is_active = 1 
      ORDER BY category, title
    `).all();

    return c.json(results);
  } catch (error) {
    console.error('Get policy catalog error:', error);
    return c.json({ error: 'Failed to get policy catalog' }, 500);
  }
});

// Database query endpoint for development
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

export default {
  fetch: app.fetch,
};
