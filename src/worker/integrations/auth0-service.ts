/**
 * Auth0 Integration Service for Identity & Authentication
 * Handles SSO, MFA, RBAC, and user management
 */

export interface Auth0User {
  user_id: string;
  email: string;
  email_verified: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  logins_count: number;
  app_metadata?: any;
  user_metadata?: any;
}

export interface Auth0Role {
  id: string;
  name: string;
  description: string;
  permissions: Auth0Permission[];
}

export interface Auth0Permission {
  permission_name: string;
  description: string;
  resource_server_identifier: string;
}

export interface Auth0Organization {
  id: string;
  name: string;
  display_name: string;
  branding?: {
    logo_url?: string;
    colors?: {
      primary: string;
      page_background: string;
    };
  };
  metadata?: any;
  enabled_connections: string[];
}

export interface MFAEnrollment {
  id: string;
  status: 'pending' | 'confirmed';
  type: 'otp' | 'sms' | 'phone' | 'push-notification' | 'email';
  name?: string;
  phone_number?: string;
  email?: string;
}

export class Auth0Service {
  private apiUrl: string;
  private accessToken: string;
  private domain: string;

  constructor(domain: string, clientId: string, clientSecret: string) {
    this.domain = domain;
    this.apiUrl = `https://${domain}/api/v2`;
    this.accessToken = '';
  }

  /**
   * Initialize service by getting management API token
   */
  async initialize(clientId: string, clientSecret: string): Promise<void> {
    const response = await fetch(`https://${this.domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${this.domain}/api/v2/`,
        grant_type: 'client_credentials'
      })
    });

    if (!response.ok) {
      throw new Error(`Auth0 token request failed: ${response.status}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
  }

  private async makeRequest(method: string, endpoint: string, body?: any): Promise<any> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Auth0 API error: ${response.status} - ${error.message || error.error || 'Request failed'}`);
    }

    return response.json();
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<Auth0User> {
    return this.makeRequest('GET', `/users/${encodeURIComponent(userId)}`);
  }

  /**
   * Get users with pagination and filtering
   */
  async getUsers(options?: {
    q?: string;
    search_engine?: string;
    page?: number;
    per_page?: number;
    include_totals?: boolean;
    sort?: string;
    connection?: string;
    fields?: string;
    include_fields?: boolean;
  }): Promise<{ users: Auth0User[]; total?: number }> {
    const params = new URLSearchParams();
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = `/users${params.toString() ? `?${params.toString()}` : ''}`;
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    password?: string;
    given_name?: string;
    family_name?: string;
    name?: string;
    picture?: string;
    connection: string;
    email_verified?: boolean;
    verify_email?: boolean;
    app_metadata?: any;
    user_metadata?: any;
  }): Promise<Auth0User> {
    return this.makeRequest('POST', '/users', userData);
  }

  /**
   * Update user
   */
  async updateUser(userId: string, userData: {
    given_name?: string;
    family_name?: string;
    name?: string;
    picture?: string;
    email?: string;
    email_verified?: boolean;
    app_metadata?: any;
    user_metadata?: any;
    blocked?: boolean;
  }): Promise<Auth0User> {
    return this.makeRequest('PATCH', `/users/${encodeURIComponent(userId)}`, userData);
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<void> {
    await this.makeRequest('DELETE', `/users/${encodeURIComponent(userId)}`);
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<Auth0Role[]> {
    return this.makeRequest('GET', `/users/${encodeURIComponent(userId)}/roles`);
  }

  /**
   * Assign roles to user
   */
  async assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
    await this.makeRequest('POST', `/users/${encodeURIComponent(userId)}/roles`, {
      roles: roleIds
    });
  }

  /**
   * Remove roles from user
   */
  async removeRolesFromUser(userId: string, roleIds: string[]): Promise<void> {
    await this.makeRequest('DELETE', `/users/${encodeURIComponent(userId)}/roles`, {
      roles: roleIds
    });
  }

  /**
   * Get all roles
   */
  async getRoles(): Promise<Auth0Role[]> {
    return this.makeRequest('GET', '/roles');
  }

  /**
   * Create role
   */
  async createRole(roleData: {
    name: string;
    description: string;
  }): Promise<Auth0Role> {
    return this.makeRequest('POST', '/roles', roleData);
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(userId: string): Promise<Auth0Permission[]> {
    return this.makeRequest('GET', `/users/${encodeURIComponent(userId)}/permissions`);
  }

  /**
   * Assign permissions to user
   */
  async assignPermissionsToUser(userId: string, permissions: Array<{
    permission_name: string;
    resource_server_identifier: string;
  }>): Promise<void> {
    await this.makeRequest('POST', `/users/${encodeURIComponent(userId)}/permissions`, {
      permissions
    });
  }

  /**
   * Get organizations
   */
  async getOrganizations(): Promise<Auth0Organization[]> {
    return this.makeRequest('GET', '/organizations');
  }

  /**
   * Create organization
   */
  async createOrganization(orgData: {
    name: string;
    display_name: string;
    branding?: {
      logo_url?: string;
      colors?: {
        primary: string;
        page_background: string;
      };
    };
    metadata?: any;
    enabled_connections?: Array<{
      connection_id: string;
      assign_membership_on_login?: boolean;
    }>;
  }): Promise<Auth0Organization> {
    return this.makeRequest('POST', '/organizations', orgData);
  }

  /**
   * Add user to organization
   */
  async addUserToOrganization(orgId: string, userId: string): Promise<void> {
    await this.makeRequest('POST', `/organizations/${orgId}/members`, {
      users: [userId]
    });
  }

  /**
   * Get organization members
   */
  async getOrganizationMembers(orgId: string): Promise<Auth0User[]> {
    return this.makeRequest('GET', `/organizations/${orgId}/members`);
  }

  /**
   * Get user's MFA enrollments
   */
  async getUserMFAEnrollments(userId: string): Promise<MFAEnrollment[]> {
    return this.makeRequest('GET', `/users/${encodeURIComponent(userId)}/enrollments`);
  }

  /**
   * Delete MFA enrollment
   */
  async deleteMFAEnrollment(userId: string, enrollmentId: string): Promise<void> {
    await this.makeRequest('DELETE', `/users/${encodeURIComponent(userId)}/enrollments/${enrollmentId}`);
  }

  /**
   * Get authentication methods
   */
  async getAuthenticationMethods(userId: string): Promise<any[]> {
    return this.makeRequest('GET', `/users/${encodeURIComponent(userId)}/authentication-methods`);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, connection: string): Promise<{ ticket: string }> {
    return this.makeRequest('POST', '/tickets/password-change', {
      email,
      connection_id: connection
    });
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(userId: string): Promise<{ ticket: string }> {
    return this.makeRequest('POST', '/tickets/email-verification', {
      user_id: userId
    });
  }

  /**
   * Get user logs
   */
  async getUserLogs(userId: string, options?: {
    page?: number;
    per_page?: number;
    sort?: string;
    include_totals?: boolean;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('q', `user_id:"${userId}"`);
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    return this.makeRequest('GET', `/logs?${params.toString()}`);
  }

  /**
   * Block user
   */
  async blockUser(userId: string): Promise<Auth0User> {
    return this.updateUser(userId, { blocked: true });
  }

  /**
   * Unblock user
   */
  async unblockUser(userId: string): Promise<Auth0User> {
    return this.updateUser(userId, { blocked: false });
  }

  /**
   * Link user accounts
   */
  async linkUserAccounts(primaryUserId: string, secondaryUserData: {
    provider: string;
    user_id?: string;
    connection_id?: string;
    link_with?: string;
  }): Promise<any> {
    return this.makeRequest('POST', `/users/${encodeURIComponent(primaryUserId)}/identities`, secondaryUserData);
  }

  /**
   * Unlink user account
   */
  async unlinkUserAccount(userId: string, provider: string, secondaryUserId: string): Promise<any> {
    return this.makeRequest('DELETE', `/users/${encodeURIComponent(userId)}/identities/${provider}/${secondaryUserId}`);
  }

  /**
   * Get stats
   */
  async getStats(): Promise<{
    logins: number;
    signups: number;
    leaked_passwords: number;
    active_users: number;
  }> {
    return this.makeRequest('GET', '/stats/daily');
  }

  /**
   * Sync with PrivacyGuard organization
   */
  async syncWithPrivacyGuard(privacyGuardOrgId: string, auth0OrgId: string, users: any[]): Promise<{
    synced_users: number;
    role_assignments: number;
    permission_updates: number;
  }> {
    let syncedUsers = 0;
    let roleAssignments = 0;
    let permissionUpdates = 0;

    for (const user of users) {
      try {
        // Check if user exists in Auth0
        const existingUsers = await this.getUsers({ q: `email:"${user.email}"` });
        
        let auth0User: Auth0User;
        if (existingUsers.users.length > 0) {
          // Update existing user
          auth0User = await this.updateUser(existingUsers.users[0].user_id, {
            given_name: user.first_name,
            family_name: user.last_name,
            name: `${user.first_name} ${user.last_name}`,
            app_metadata: {
              privacy_guard_org_id: privacyGuardOrgId,
              privacy_guard_role: user.role
            }
          });
        } else {
          // Create new user
          auth0User = await this.createUser({
            email: user.email,
            given_name: user.first_name,
            family_name: user.last_name,
            name: `${user.first_name} ${user.last_name}`,
            connection: 'Username-Password-Authentication',
            email_verified: true,
            app_metadata: {
              privacy_guard_org_id: privacyGuardOrgId,
              privacy_guard_role: user.role
            }
          });
        }

        // Add to Auth0 organization
        await this.addUserToOrganization(auth0OrgId, auth0User.user_id);

        // Assign appropriate roles based on PrivacyGuard role
        const roleMapping: Record<string, string[]> = {
          'admin': ['org-admin', 'dpo', 'staff'],
          'dpo': ['dpo', 'staff'],
          'staff': ['staff'],
          'viewer': ['viewer']
        };

        const rolesToAssign = roleMapping[user.role] || ['viewer'];
        const allRoles = await this.getRoles();
        const roleIds = allRoles
          .filter(role => rolesToAssign.includes(role.name))
          .map(role => role.id);

        if (roleIds.length > 0) {
          await this.assignRolesToUser(auth0User.user_id, roleIds);
          roleAssignments += roleIds.length;
        }

        syncedUsers++;
        permissionUpdates++;

      } catch (error) {
        console.error(`Failed to sync user ${user.email}:`, error);
      }
    }

    return {
      synced_users: syncedUsers,
      role_assignments: roleAssignments,
      permission_updates: permissionUpdates
    };
  }
}
