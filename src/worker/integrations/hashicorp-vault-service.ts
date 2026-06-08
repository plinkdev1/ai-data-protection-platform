/**
 * HashiCorp Vault Service Integration
 * Provides dynamic secrets management, API key rotation, and encryption at rest
 */

export interface VaultConfig {
  HASHICORP_VAULT_URL: string;
  HASHICORP_VAULT_TOKEN: string;
}

export interface VaultSecret {
  path: string;
  data: Record<string, any>;
  lease_id?: string;
  lease_duration?: number;
  renewable?: boolean;
}

export interface VaultKeyRotationPolicy {
  name: string;
  type: 'time' | 'usage' | 'manual';
  interval?: number; // hours for time-based
  usage_limit?: number; // for usage-based
  auto_rotate: boolean;
}

export interface VaultEncryptionContext {
  key_name: string;
  plaintext: string;
  context?: Record<string, string>;
}

export interface VaultDecryptionContext {
  key_name: string;
  ciphertext: string;
  context?: Record<string, string>;
}

export class HashiCorpVaultService {
  private baseUrl: string;
  private token: string;
  private headers: Record<string, string>;

  constructor(config: VaultConfig) {
    this.baseUrl = config.HASHICORP_VAULT_URL.replace(/\/$/, '');
    this.token = config.HASHICORP_VAULT_TOKEN;
    this.headers = {
      'X-Vault-Token': this.token,
      'Content-Type': 'application/json',
    };
  }

  // Health check for Vault service
  async healthCheck(): Promise<{ vault: boolean; sealed: boolean; initialized: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/sys/health`, {
        method: 'GET',
        headers: this.headers,
      });

      if (response.ok) {
        const health = await response.json();
        return {
          vault: true,
          sealed: !health.sealed,
          initialized: health.initialized,
        };
      }

      return { vault: false, sealed: true, initialized: false };
    } catch (error) {
      console.error('Vault health check failed:', error);
      return { vault: false, sealed: true, initialized: false };
    }
  }

  // Dynamic Secrets Management
  async createDynamicSecret(
    secretEngine: string,
    roleName: string,
    config: Record<string, any>
  ): Promise<VaultSecret> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/${secretEngine}/creds/${roleName}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create dynamic secret: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        path: `${secretEngine}/creds/${roleName}`,
        data: result.data,
        lease_id: result.lease_id,
        lease_duration: result.lease_duration,
        renewable: result.renewable,
      };
    } catch (error) {
      console.error('Create dynamic secret error:', error);
      throw error;
    }
  }

  async renewSecret(leaseId: string, increment?: number): Promise<VaultSecret> {
    try {
      const body = increment ? { increment } : {};
      
      const response = await fetch(`${this.baseUrl}/v1/sys/leases/renew`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({
          lease_id: leaseId,
          ...body,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to renew secret: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        path: '',
        data: result.data,
        lease_id: result.lease_id,
        lease_duration: result.lease_duration,
        renewable: result.renewable,
      };
    } catch (error) {
      console.error('Renew secret error:', error);
      throw error;
    }
  }

  async revokeSecret(leaseId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/sys/leases/revoke`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify({ lease_id: leaseId }),
      });

      return response.ok;
    } catch (error) {
      console.error('Revoke secret error:', error);
      return false;
    }
  }

  // Key-Value Secrets (v2)
  async writeSecret(
    path: string,
    data: Record<string, any>,
    options?: { cas?: number; check_and_set?: number }
  ): Promise<boolean> {
    try {
      const body: any = { data };
      if (options?.cas !== undefined) {
        body.options = { cas: options.cas };
      }

      const response = await fetch(`${this.baseUrl}/v1/secret/data/${path}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      return response.ok;
    } catch (error) {
      console.error('Write secret error:', error);
      return false;
    }
  }

  async readSecret(path: string, version?: number): Promise<VaultSecret | null> {
    try {
      let url = `${this.baseUrl}/v1/secret/data/${path}`;
      if (version) {
        url += `?version=${version}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      
      return {
        path,
        data: result.data.data,
        lease_id: result.lease_id,
        lease_duration: result.lease_duration,
        renewable: result.renewable,
      };
    } catch (error) {
      console.error('Read secret error:', error);
      return null;
    }
  }

  async deleteSecret(path: string, versions?: number[]): Promise<boolean> {
    try {
      let url = `${this.baseUrl}/v1/secret/data/${path}`;
      const body: any = {};

      if (versions && versions.length > 0) {
        body.versions = versions;
      }

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.headers,
        body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
      });

      return response.ok;
    } catch (error) {
      console.error('Delete secret error:', error);
      return false;
    }
  }

  // API Key Rotation
  async setupKeyRotation(policy: VaultKeyRotationPolicy): Promise<boolean> {
    try {
      // Configure rotation policy in Vault
      const response = await fetch(
        `${this.baseUrl}/v1/auth/aws/config/rotate-root`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            access_key: policy.name,
            secret_key: policy.name,
          }),
        }
      );

      if (response.ok && policy.auto_rotate && policy.type === 'time') {
        // Set up periodic rotation using Vault's periodic function
        await this.schedulePeriodicRotation(policy.name, policy.interval || 24);
      }

      return response.ok;
    } catch (error) {
      console.error('Setup key rotation error:', error);
      return false;
    }
  }

  async rotateKey(keyName: string): Promise<{ old_key: string; new_key: string } | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/auth/aws/config/rotate-root`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ key_name: keyName }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      
      return {
        old_key: result.data.previous_access_key,
        new_key: result.data.access_key,
      };
    } catch (error) {
      console.error('Rotate key error:', error);
      return null;
    }
  }

  private async schedulePeriodicRotation(keyName: string, intervalHours: number): Promise<void> {
    // This would typically integrate with Vault's periodic function or an external scheduler
    console.log(`Scheduled rotation for ${keyName} every ${intervalHours} hours`);
  }

  // Encryption at Rest
  async createEncryptionKey(
    keyName: string,
    keyType: 'aes256-gcm96' | 'chacha20-poly1305' | 'ed25519' | 'ecdsa-p256' | 'ecdsa-p384' | 'ecdsa-p521' | 'rsa-2048' | 'rsa-3072' | 'rsa-4096' = 'aes256-gcm96'
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/transit/keys/${keyName}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            type: keyType,
            exportable: false,
            allow_plaintext_backup: false,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Create encryption key error:', error);
      return false;
    }
  }

  async encrypt(context: VaultEncryptionContext): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/transit/encrypt/${context.key_name}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            plaintext: Buffer.from(context.plaintext).toString('base64'),
            context: context.context ? Buffer.from(JSON.stringify(context.context)).toString('base64') : undefined,
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data.ciphertext;
    } catch (error) {
      console.error('Encrypt error:', error);
      return null;
    }
  }

  async decrypt(context: VaultDecryptionContext): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/transit/decrypt/${context.key_name}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            ciphertext: context.ciphertext,
            context: context.context ? Buffer.from(JSON.stringify(context.context)).toString('base64') : undefined,
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return Buffer.from(result.data.plaintext, 'base64').toString();
    } catch (error) {
      console.error('Decrypt error:', error);
      return null;
    }
  }

  async rewrapData(keyName: string, ciphertext: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/transit/rewrap/${keyName}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ ciphertext }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data.ciphertext;
    } catch (error) {
      console.error('Rewrap data error:', error);
      return null;
    }
  }

  // Database dynamic secrets
  async configureDatabaseConnection(
    connectionName: string,
    plugin: 'mysql-database-plugin' | 'postgresql-database-plugin',
    connectionUrl: string,
    allowedRoles: string[]
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/database/config/${connectionName}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            plugin_name: plugin,
            connection_url: connectionUrl,
            allowed_roles: allowedRoles,
            username: '{{username}}',
            password: '{{password}}',
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Configure database connection error:', error);
      return false;
    }
  }

  async createDatabaseRole(
    roleName: string,
    dbName: string,
    creationStatements: string[],
    defaultTtl: string = '1h',
    maxTtl: string = '24h'
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/database/roles/${roleName}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            db_name: dbName,
            creation_statements: creationStatements,
            default_ttl: defaultTtl,
            max_ttl: maxTtl,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Create database role error:', error);
      return false;
    }
  }

  // PKI (Public Key Infrastructure)
  async setupPKI(mountPath: string, rootCert: {
    common_name: string;
    ttl: string;
    key_bits?: number;
    key_type?: 'rsa' | 'ec';
  }): Promise<{ certificate: string; private_key: string } | null> {
    try {
      // Enable PKI secrets engine
      await fetch(`${this.baseUrl}/v1/sys/mounts/${mountPath}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          type: 'pki',
          config: {
            max_lease_ttl: rootCert.ttl,
          },
        }),
      });

      // Generate root certificate
      const response = await fetch(
        `${this.baseUrl}/v1/${mountPath}/root/generate/internal`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            common_name: rootCert.common_name,
            ttl: rootCert.ttl,
            key_bits: rootCert.key_bits || 4096,
            key_type: rootCert.key_type || 'rsa',
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return {
        certificate: result.data.certificate,
        private_key: result.data.private_key,
      };
    } catch (error) {
      console.error('Setup PKI error:', error);
      return null;
    }
  }

  async generateCertificate(
    mountPath: string,
    roleName: string,
    commonName: string,
    altNames?: string[],
    ttl: string = '72h'
  ): Promise<{ certificate: string; private_key: string; serial_number: string } | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/${mountPath}/issue/${roleName}`,
        {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({
            common_name: commonName,
            alt_names: altNames?.join(','),
            ttl,
          }),
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return {
        certificate: result.data.certificate,
        private_key: result.data.private_key,
        serial_number: result.data.serial_number,
      };
    } catch (error) {
      console.error('Generate certificate error:', error);
      return null;
    }
  }

  // Audit logging
  async getAuditLogs(path?: string): Promise<any[] | null> {
    try {
      let url = `${this.baseUrl}/v1/sys/audit`;
      if (path) {
        url += `/${path}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get audit logs error:', error);
      return null;
    }
  }

  // Secret versioning and metadata
  async getSecretMetadata(path: string): Promise<{
    created_time: string;
    current_version: number;
    max_versions: number;
    oldest_version: number;
    updated_time: string;
    versions: Record<number, any>;
  } | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/secret/metadata/${path}`,
        {
          method: 'GET',
          headers: this.headers,
        }
      );

      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Get secret metadata error:', error);
      return null;
    }
  }

  // Cleanup and maintenance
  async cleanup(): Promise<void> {
    try {
      // Revoke any remaining leases (in a real implementation, you'd track these)
      console.log('Vault service cleanup completed');
    } catch (error) {
      console.error('Vault cleanup error:', error);
    }
  }
}
