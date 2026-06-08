import { Hono } from 'hono';
import { createVeriffService } from '../integrations/veriff-service';

const kyc = new Hono<{ Bindings: CloudflareBindings }>();

// KYC status endpoint
kyc.get('/status', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    // Check latest KYC verification for user
    const stmt = c.env.DB.prepare(`
      SELECT 
        id,
        status,
        created_at,
        expires_at,
        verification_session_id
      FROM kyc_verifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    
    const kycRecord = await stmt.bind(user.id).first();
    
    if (!kycRecord) {
      return c.json({ 
        status: 'not_verified',
        message: 'No KYC verification found'
      });
    }

    // Check if expired (7 days from creation)
    const expiryDate = new Date(kycRecord.created_at);
    expiryDate.setDate(expiryDate.getDate() + 7);
    const isExpired = new Date() > expiryDate;

    return c.json({
      id: kycRecord.verification_session_id || kycRecord.id,
      status: isExpired ? 'expired' : kycRecord.status,
      created_at: kycRecord.created_at,
      expires_at: expiryDate.toISOString()
    });

  } catch (error) {
    console.error('KYC status check failed:', error);
    return c.json({ error: 'Failed to check KYC status' }, 500);
  }
});

// Initiate KYC verification
kyc.post('/initiate', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const veriffService = createVeriffService(c.env);
    
    // Create Veriff session
    const session = await veriffService.createSession(
      user.id,
      `${new URL(c.req.url).origin}/api/kyc/webhook`
    );

    // Store KYC verification record
    const stmt = c.env.DB.prepare(`
      INSERT INTO kyc_verifications (
        user_id,
        verification_session_id,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `);

    await stmt.bind(
      user.id,
      session.id,
      'pending'
    ).run();

    return c.json({
      id: session.id,
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      verification_url: session.url
    });

  } catch (error) {
    console.error('KYC initiation failed:', error);
    return c.json({ error: 'Failed to initiate KYC verification' }, 500);
  }
});

// Veriff webhook endpoint
kyc.post('/webhook', async (c) => {
  const signature = c.req.header('x-veriff-signature');
  const body = await c.req.text();
  
  try {
    const veriffService = createVeriffService(c.env);
    
    // Validate webhook signature if configured
    const isValid = veriffService.validateWebhook(signature || '', body, c.env.VERIFF_WEBHOOK_SECRET);
    if (!isValid && c.env.VERIFF_WEBHOOK_SECRET) {
      return c.json({ error: 'Invalid signature' }, 401);
    }

    const payload = JSON.parse(body);
    const webhookData = veriffService.processWebhookPayload(payload);

    // Update KYC verification status
    const stmt = c.env.DB.prepare(`
      UPDATE kyc_verifications 
      SET 
        status = ?,
        verification_data = ?,
        updated_at = datetime('now')
      WHERE verification_session_id = ?
    `);

    await stmt.bind(
      webhookData.status,
      JSON.stringify({
        code: webhookData.code,
        reason: webhookData.reason,
        person: webhookData.person,
        document: webhookData.document,
        timestamp: webhookData.timestamp
      }),
      webhookData.sessionId
    ).run();

    return c.json({ success: true });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

export { kyc };
