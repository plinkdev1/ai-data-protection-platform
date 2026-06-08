import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export interface SecurityEnv {
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH0_DOMAIN: string;
  AZURE_AD_B2C_CLIENT_ID: string;
  AZURE_AD_B2C_CLIENT_SECRET: string;
  HASHICORP_VAULT_TOKEN: string;
  AWS_SECRETS_MANAGER_ACCESS_KEY: string;
}

export interface JWTPayload {
  sub: string;
  aud: string;
  iss: string;
  exp: number;
  iat: number;
  email?: string;
  roles?: string[];
  organizationId?: string;
}

export interface VaultSecret {
  key: string;
  value: string;
  version: number;
  metadata?: Record<string, any>;
}

export class SecurityLayer {
  private vaultToken: string;
  private encryptionKey: Buffer;

  constructor(private env: SecurityEnv) {
    this.vaultToken = env.HASHICORP_VAULT_TOKEN;
    this.encryptionKey = Buffer.from(createHash('sha256').update('privacyguard-key').digest());
  }

  // Auth0 integration for SSO and identity management
  async validateAuth0Token(token: string): Promise<JWTPayload | null> {
    try {
      const response = await fetch(`https://${this.env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const userInfo = await response.json();
      return {
        sub: userInfo.sub,
        aud: this.env.AUTH0_CLIENT_ID,
        iss: `https://${this.env.AUTH0_DOMAIN}/`,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
        email: userInfo.email,
        roles: userInfo['app_metadata']?.roles || [],
        organizationId: userInfo['app_metadata']?.organizationId,
      };
    } catch (error) {
      console.error('Auth0 token validation failed:', error);
      return null;
    }
  }

  async createAuth0User(email: string, password: string, metadata: Record<string, any> = {}): Promise<any> {
    try {
      const managementToken = await this.getAuth0ManagementToken();
      
      const response = await fetch(`https://${this.env.AUTH0_DOMAIN}/api/v2/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          connection: 'Username-Password-Authentication',
          app_metadata: metadata,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Auth0 user creation failed:', error);
      throw error;
    }
  }

  private async getAuth0ManagementToken(): Promise<string> {
    const response = await fetch(`https://${this.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.env.AUTH0_CLIENT_ID,
        client_secret: this.env.AUTH0_CLIENT_SECRET,
        audience: `https://${this.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: 'client_credentials',
      }),
    });

    const data = await response.json();
    return data.access_token;
  }

  // Azure AD B2C integration for enterprise SSO
  async validateAzureADToken(token: string): Promise<JWTPayload | null> {
    try {
      // Implement Azure AD B2C token validation
      const decoded = this.decodeJWT(token);
      
      // Verify token signature against Azure AD B2C keys
      const isValid = await this.verifyAzureADSignature(token, decoded.header);
      
      if (!isValid) {
        return null;
      }

      return decoded.payload as JWTPayload;
    } catch (error) {
      console.error('Azure AD token validation failed:', error);
      return null;
    }
  }

  private decodeJWT(token: string): { header: any; payload: any } {
    const parts = token.split('.');
    return {
      header: JSON.parse(Buffer.from(parts[0], 'base64').toString()),
      payload: JSON.parse(Buffer.from(parts[1], 'base64').toString()),
    };
  }

  private async verifyAzureADSignature(token: string, header: any): Promise<boolean> {
    try {
      // Fetch Azure AD B2C public keys
      const keysResponse = await fetch(`https://login.microsoftonline.com/common/discovery/v2.0/keys`);
      const keys = await keysResponse.json();
      
      // Find matching key and verify signature
      const key = keys.keys.find((k: any) => k.kid === header.kid);
      if (!key) {
        return false;
      }

      // Implement JWT signature verification logic
      return true; // Simplified for example
    } catch {
      return false;
    }
  }

  // HashiCorp Vault integration for secrets management
  async storeSecret(path: string, secret: VaultSecret): Promise<void> {
    try {
      await fetch(`${this.getVaultUrl()}/v1/secret/data/${path}`, {
        method: 'POST',
        headers: {
          'X-Vault-Token': this.vaultToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            [secret.key]: secret.value,
            metadata: secret.metadata || {},
          },
        }),
      });
    } catch (error) {
      console.error('Vault secret storage failed:', error);
      throw error;
    }
  }

  async retrieveSecret(path: string, key: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.getVaultUrl()}/v1/secret/data/${path}`, {
        headers: {
          'X-Vault-Token': this.vaultToken,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.data?.data?.[key] || null;
    } catch (error) {
      console.error('Vault secret retrieval failed:', error);
      return null;
    }
  }

  async rotateSecret(path: string, key: string, newValue: string): Promise<void> {
    // Implement secret rotation logic
    await this.storeSecret(path, {
      key,
      value: newValue,
      version: Date.now(),
      metadata: { rotated_at: new Date().toISOString() },
    });
  }

  private getVaultUrl(): string {
    return process.env.VAULT_URL || 'https://vault.example.com';
  }

  // Field-level encryption for PII/PHI
  encryptField(plaintext: string): { encrypted: string; iv: string } {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted,
      iv: iv.toString('hex'),
    };
  }

  decryptField(encrypted: string, iv: string): string {
    const decipher = createDecipheriv('aes-256-cbc', this.encryptionKey, Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Role-based access control (RBAC)
  checkPermission(userRoles: string[], requiredRole: string): boolean {
    const roleHierarchy = {
      'super_admin': ['admin', 'dpo', 'staff', 'viewer'],
      'admin': ['dpo', 'staff', 'viewer'],
      'dpo': ['staff', 'viewer'],
      'staff': ['viewer'],
      'viewer': [],
    };

    return userRoles.some(role => 
      role === requiredRole || 
      roleHierarchy[role as keyof typeof roleHierarchy]?.includes(requiredRole)
    );
  }

  // Generate secure API keys
  generateAPIKey(): string {
    const prefix = 'pg_';
    const random = randomBytes(32).toString('hex');
    return prefix + random;
  }

  // Hash sensitive data
  hashData(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  // Generate CSRF tokens
  generateCSRFToken(): string {
    return randomBytes(32).toString('hex');
  }

  // Validate request signatures
  validateSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = createHash('sha256')
      .update(payload + secret)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  // Audit logging for security events
  async logSecurityEvent(event: {
    type: 'login' | 'logout' | 'permission_denied' | 'token_refresh' | 'secret_access';
    userId?: string;
    ip?: string;
    userAgent?: string;
    details?: Record<string, any>;
  }): Promise<void> {
    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID(),
    };

    // Send to security audit system
    console.log('Security Event:', logEntry);
    
    // In production, send to SIEM or security monitoring system
  }

  // Health check for security services
  async healthCheck(): Promise<{
    auth0: boolean;
    azureAD: boolean;
    vault: boolean;
    encryption: boolean;
  }> {
    const health = {
      auth0: false,
      azureAD: false,
      vault: false,
      encryption: true, // Always available
    };

    try {
      const response = await fetch(`https://${this.env.AUTH0_DOMAIN}/.well-known/openid_configuration`);
      health.auth0 = response.ok;
    } catch {
      // Auth0 not available
    }

    try {
      const response = await fetch('https://login.microsoftonline.com/common/v2.0/.well-known/openid_configuration');
      health.azureAD = response.ok;
    } catch {
      // Azure AD not available
    }

    try {
      const response = await fetch(`${this.getVaultUrl()}/v1/sys/health`, {
        headers: {
          'X-Vault-Token': this.vaultToken,
        },
      });
      health.vault = response.ok;
    } catch {
      // Vault not available
    }

    return health;
  }
}
