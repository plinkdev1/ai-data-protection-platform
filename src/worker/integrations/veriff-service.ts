import { z } from 'zod';

const VeriffConfigSchema = z.object({
  apiKey: z.string(),
  baseUrl: z.string().default('https://stationapi.veriff.com'),
});

export interface VeriffSession {
  id: string;
  url: string;
  host: string;
  status: 'created' | 'started' | 'submitted' | 'approved' | 'declined' | 'expired';
  verification: {
    id: string;
    code: number;
    person?: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
    };
    document?: {
      type: string;
      country: string;
      number: string;
    };
  };
}

export class VeriffService {
  private config: z.infer<typeof VeriffConfigSchema>;

  constructor(config: Partial<z.infer<typeof VeriffConfigSchema>>) {
    this.config = VeriffConfigSchema.parse(config);
  }

  async createSession(userId: string, callback?: string): Promise<VeriffSession> {
    const sessionData = {
      verification: {
        callback: callback || `${this.config.baseUrl}/webhooks/veriff`,
        person: {
          userId: userId,
        },
        document: {
          country: 'US', // Default, can be customized
        },
        lang: 'en',
      },
    };

    const response = await fetch(`${this.config.baseUrl}/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AUTH-CLIENT': this.config.apiKey,
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`Veriff session creation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  async getSessionStatus(sessionId: string): Promise<VeriffSession> {
    const response = await fetch(`${this.config.baseUrl}/v1/sessions/${sessionId}`, {
      headers: {
        'X-AUTH-CLIENT': this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get session status: ${response.statusText}`);
    }

    return response.json();
  }

  async getDecision(sessionId: string): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/v1/sessions/${sessionId}/decision`, {
      headers: {
        'X-AUTH-CLIENT': this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get decision: ${response.statusText}`);
    }

    return response.json();
  }

  validateWebhook(signature: string, payload: string, secret?: string): boolean {
    if (!secret) return true; // Skip validation if no secret configured
    
    // Implement HMAC SHA256 signature validation
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  processWebhookPayload(payload: any) {
    return {
      sessionId: payload.id,
      status: payload.status,
      code: payload.verification?.code,
      reason: payload.verification?.reason,
      person: payload.verification?.person,
      document: payload.verification?.document,
      timestamp: payload.verification?.acceptanceTime,
    };
  }
}

// Factory function for use in Cloudflare Workers
export function createVeriffService(env: any): VeriffService {
  return new VeriffService({
    apiKey: env.VERIFF_API_KEY,
  });
}
