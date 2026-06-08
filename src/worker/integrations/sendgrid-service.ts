/**
 * SendGrid Integration Service for Email Communications
 * Handles transactional emails, notifications, and marketing communications
 */

export interface SendGridEmail {
  to: Array<{
    email: string;
    name?: string;
  }>;
  from: {
    email: string;
    name?: string;
  };
  subject: string;
  content: Array<{
    type: 'text/plain' | 'text/html';
    value: string;
  }>;
  reply_to?: {
    email: string;
    name?: string;
  };
  attachments?: Array<{
    content: string; // Base64 encoded
    filename: string;
    type?: string;
    disposition?: 'inline' | 'attachment';
    content_id?: string;
  }>;
  headers?: Record<string, string>;
  categories?: string[];
  custom_args?: Record<string, string>;
  send_at?: number;
  batch_id?: string;
  asm?: {
    group_id: number;
    groups_to_display?: number[];
  };
  ip_pool_name?: string;
  mail_settings?: {
    bcc?: {
      enable: boolean;
      email?: string;
    };
    bypass_list_management?: {
      enable: boolean;
    };
    footer?: {
      enable: boolean;
      text?: string;
      html?: string;
    };
    sandbox_mode?: {
      enable: boolean;
    };
    spam_check?: {
      enable: boolean;
      threshold?: number;
      post_to_url?: string;
    };
  };
  tracking_settings?: {
    click_tracking?: {
      enable: boolean;
      enable_text?: boolean;
    };
    open_tracking?: {
      enable: boolean;
      substitution_tag?: string;
    };
    subscription_tracking?: {
      enable: boolean;
      text?: string;
      html?: string;
      substitution_tag?: string;
    };
    ganalytics?: {
      enable: boolean;
      utm_source?: string;
      utm_medium?: string;
      utm_term?: string;
      utm_content?: string;
      utm_campaign?: string;
    };
  };
}

export interface SendGridTemplate {
  id: string;
  name: string;
  generation: 'legacy' | 'dynamic';
  updated_at: string;
  versions: Array<{
    id: string;
    name: string;
    active: number;
    updated_at: string;
    subject: string;
    html_content?: string;
    plain_content?: string;
    test_data?: string;
  }>;
}

export interface SendGridContact {
  id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  line_1?: string;
  line_2?: string;
  city?: string;
  state_province_region?: string;
  postal_code?: string;
  country?: string;
  custom_fields?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface SendGridList {
  id: string;
  name: string;
  contact_count: number;
  created_at: string;
  updated_at: string;
}

export interface SendGridStats {
  date: string;
  stats: Array<{
    metrics: {
      blocks: number;
      bounce_drops: number;
      bounces: number;
      clicks: number;
      deferred: number;
      delivered: number;
      invalid_emails: number;
      opens: number;
      processed: number;
      requests: number;
      spam_report_drops: number;
      spam_reports: number;
      unique_clicks: number;
      unique_opens: number;
      unsubscribe_drops: number;
      unsubscribes: number;
    };
  }>;
}

export class SendGridService {
  private apiKey: string;
  private apiUrl = 'https://api.sendgrid.com/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ errors: [{ message: 'Unknown error' }] }));
      const errorMessage = error.errors?.[0]?.message || error.message || 'Request failed';
      throw new Error(`SendGrid API error: ${response.status} - ${errorMessage}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  /**
   * Send email
   */
  async sendEmail(emailData: SendGridEmail): Promise<{ message_id: string }> {
    const response = await this.makeRequest('POST', '/mail/send', emailData);
    
    // SendGrid returns 202 with no body on success, but includes message ID in headers
    return {
      message_id: response?.message_id || `sg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Send email using template
   */
  async sendTemplateEmail(data: {
    to: Array<{
      email: string;
      name?: string;
      substitutions?: Record<string, string>;
    }>;
    from: {
      email: string;
      name?: string;
    };
    template_id: string;
    dynamic_template_data?: Record<string, any>;
    categories?: string[];
    custom_args?: Record<string, string>;
    send_at?: number;
    asm?: {
      group_id: number;
    };
  }): Promise<{ message_id: string }> {
    const emailData: any = {
      personalizations: data.to.map(recipient => ({
        to: [{ email: recipient.email, name: recipient.name }],
        dynamic_template_data: {
          ...data.dynamic_template_data,
          ...recipient.substitutions,
        },
      })),
      from: data.from,
      template_id: data.template_id,
    };

    if (data.categories) emailData.categories = data.categories;
    if (data.custom_args) emailData.custom_args = data.custom_args;
    if (data.send_at) emailData.send_at = data.send_at;
    if (data.asm) emailData.asm = data.asm;

    return this.sendEmail(emailData);
  }

  /**
   * Get templates
   */
  async getTemplates(generation?: 'legacy' | 'dynamic'): Promise<{ templates: SendGridTemplate[] }> {
    const params = generation ? `?generations=${generation}` : '';
    return this.makeRequest('GET', `/templates${params}`);
  }

  /**
   * Get template
   */
  async getTemplate(templateId: string): Promise<SendGridTemplate> {
    return this.makeRequest('GET', `/templates/${templateId}`);
  }

  /**
   * Create template
   */
  async createTemplate(templateData: {
    name: string;
    generation: 'legacy' | 'dynamic';
  }): Promise<SendGridTemplate> {
    return this.makeRequest('POST', '/templates', templateData);
  }

  /**
   * Create template version
   */
  async createTemplateVersion(templateId: string, versionData: {
    name: string;
    subject: string;
    html_content?: string;
    plain_content?: string;
    active: 0 | 1;
    test_data?: string;
  }): Promise<any> {
    return this.makeRequest('POST', `/templates/${templateId}/versions`, versionData);
  }

  /**
   * Add contacts
   */
  async addContacts(contacts: SendGridContact[]): Promise<{ job_id: string }> {
    return this.makeRequest('PUT', '/marketing/contacts', { contacts });
  }

  /**
   * Get contact by email
   */
  async getContactByEmail(email: string): Promise<{ contact: SendGridContact }> {
    return this.makeRequest('POST', '/marketing/contacts/search', {
      query: `email LIKE '${email}'`
    });
  }

  /**
   * Delete contacts
   */
  async deleteContacts(contactIds: string[]): Promise<{ job_id: string }> {
    return this.makeRequest('DELETE', '/marketing/contacts', { ids: contactIds });
  }

  /**
   * Create list
   */
  async createList(name: string): Promise<SendGridList> {
    return this.makeRequest('POST', '/marketing/lists', { name });
  }

  /**
   * Get lists
   */
  async getLists(): Promise<{ result: SendGridList[] }> {
    return this.makeRequest('GET', '/marketing/lists');
  }

  /**
   * Add contacts to list
   */
  async addContactsToList(listId: string, contactIds: string[]): Promise<{ job_id: string }> {
    return this.makeRequest('PUT', `/marketing/lists/${listId}/contacts`, { contact_ids: contactIds });
  }

  /**
   * Get email stats
   */
  async getStats(options?: {
    start_date?: string;
    end_date?: string;
    aggregated_by?: 'day' | 'week' | 'month';
    categories?: string[];
  }): Promise<SendGridStats[]> {
    const params = new URLSearchParams();
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const endpoint = `/stats?${params.toString()}`;
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Get bounces
   */
  async getBounces(options?: {
    start_time?: number;
    end_time?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ bounces: any[] }> {
    const params = new URLSearchParams();
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    return this.makeRequest('GET', `/suppression/bounces?${params.toString()}`);
  }

  /**
   * Delete bounce
   */
  async deleteBounce(email: string): Promise<void> {
    await this.makeRequest('DELETE', `/suppression/bounces/${encodeURIComponent(email)}`);
  }

  /**
   * Get unsubscribes
   */
  async getUnsubscribes(options?: {
    start_time?: number;
    end_time?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ unsubscribes: any[] }> {
    const params = new URLSearchParams();
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    return this.makeRequest('GET', `/suppression/unsubscribes?${params.toString()}`);
  }

  /**
   * Send data breach notification email
   */
  async sendDataBreachNotification(data: {
    to: Array<{ email: string; name?: string; }>;
    organizationName: string;
    breachType: string;
    affectedDataTypes: string[];
    estimatedAffectedCount: number;
    discoveryDate: string;
    containmentDate?: string;
    contactEmail: string;
    reportUrl?: string;
  }): Promise<{ message_id: string }> {
    const subject = `Important Security Notice from ${data.organizationName}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #dc3545; margin: 0;">Security Incident Notification</h1>
        </div>
        
        <div style="padding: 20px; background: white; border-radius: 8px; border: 1px solid #dee2e6;">
          <p>Dear Valued Customer,</p>
          
          <p>We are writing to inform you of a security incident that may have involved your personal information.</p>
          
          <h3 style="color: #495057;">Incident Details:</h3>
          <ul>
            <li><strong>Incident Type:</strong> ${data.breachType}</li>
            <li><strong>Discovery Date:</strong> ${data.discoveryDate}</li>
            ${data.containmentDate ? `<li><strong>Containment Date:</strong> ${data.containmentDate}</li>` : ''}
            <li><strong>Estimated Affected Individuals:</strong> ${data.estimatedAffectedCount}</li>
          </ul>
          
          <h3 style="color: #495057;">Information Involved:</h3>
          <ul>
            ${data.affectedDataTypes.map(type => `<li>${type}</li>`).join('')}
          </ul>
          
          <h3 style="color: #495057;">What We Are Doing:</h3>
          <ul>
            <li>We have taken immediate steps to secure the affected systems</li>
            <li>We are working with cybersecurity experts to investigate the incident</li>
            <li>We have notified appropriate authorities as required by law</li>
            <li>We are implementing additional security measures to prevent similar incidents</li>
          </ul>
          
          <h3 style="color: #495057;">What You Should Do:</h3>
          <ul>
            <li>Monitor your accounts for any suspicious activity</li>
            <li>Consider changing passwords for any accounts that may be affected</li>
            <li>Review your credit reports and financial statements regularly</li>
            <li>Report any suspicious activity immediately</li>
          </ul>
          
          ${data.reportUrl ? `
          <div style="background: #e9ecef; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Full Incident Report:</strong></p>
            <p><a href="${data.reportUrl}" style="color: #007bff;">View Complete Report</a></p>
          </div>
          ` : ''}
          
          <p>We sincerely apologize for this incident and any inconvenience it may cause. The security of your personal information is of utmost importance to us.</p>
          
          <p>If you have any questions or concerns, please contact us at <a href="mailto:${data.contactEmail}">${data.contactEmail}</a>.</p>
          
          <p>Sincerely,<br/>
          The ${data.organizationName} Security Team</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
          <p>This notification is required by applicable data protection laws.</p>
        </div>
      </div>
    `;

    const plainContent = `
Security Incident Notification

Dear Valued Customer,

We are writing to inform you of a security incident that may have involved your personal information.

Incident Details:
- Incident Type: ${data.breachType}
- Discovery Date: ${data.discoveryDate}
${data.containmentDate ? `- Containment Date: ${data.containmentDate}` : ''}
- Estimated Affected Individuals: ${data.estimatedAffectedCount}

Information Involved:
${data.affectedDataTypes.map(type => `- ${type}`).join('\n')}

What We Are Doing:
- We have taken immediate steps to secure the affected systems
- We are working with cybersecurity experts to investigate the incident
- We have notified appropriate authorities as required by law
- We are implementing additional security measures to prevent similar incidents

What You Should Do:
- Monitor your accounts for any suspicious activity
- Consider changing passwords for any accounts that may be affected
- Review your credit reports and financial statements regularly
- Report any suspicious activity immediately

${data.reportUrl ? `Full Incident Report: ${data.reportUrl}` : ''}

We sincerely apologize for this incident and any inconvenience it may cause. The security of your personal information is of utmost importance to us.

If you have any questions or concerns, please contact us at ${data.contactEmail}.

Sincerely,
The ${data.organizationName} Security Team
    `;

    return this.sendEmail({
      to: data.to,
      from: {
        email: data.contactEmail,
        name: data.organizationName,
      },
      subject,
      content: [
        { type: 'text/plain', value: plainContent },
        { type: 'text/html', value: htmlContent },
      ],
      categories: ['security', 'breach-notification'],
      custom_args: {
        incident_type: data.breachType,
        organization: data.organizationName,
      },
    });
  }

  /**
   * Send compliance reminder email
   */
  async sendComplianceReminder(data: {
    to: Array<{ email: string; name?: string; }>;
    organizationName: string;
    taskType: 'dpia_review' | 'policy_update' | 'training_due' | 'breach_report';
    taskTitle: string;
    dueDate: string;
    dashboardUrl: string;
    assignedBy?: string;
  }): Promise<{ message_id: string }> {
    const taskTypeNames = {
      dpia_review: 'DPIA Review',
      policy_update: 'Policy Update',
      training_due: 'Compliance Training',
      breach_report: 'Data Breach Report'
    };

    const subject = `${taskTypeNames[data.taskType]} Due - ${data.organizationName}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #007bff; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">📋 Compliance Reminder</h1>
        </div>
        
        <div style="padding: 20px; background: white; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hello,</p>
          
          <p>This is a reminder that you have a compliance task due for <strong>${data.organizationName}</strong>.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #495057;">${data.taskTitle}</h3>
            <p style="margin: 0;"><strong>Type:</strong> ${taskTypeNames[data.taskType]}</p>
            <p style="margin: 5px 0 0 0;"><strong>Due Date:</strong> ${data.dueDate}</p>
            ${data.assignedBy ? `<p style="margin: 5px 0 0 0;"><strong>Assigned by:</strong> ${data.assignedBy}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.dashboardUrl}" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
              Complete Task
            </a>
          </div>
          
          <p>Please complete this task as soon as possible to maintain compliance. If you have any questions, please contact your DPO or compliance team.</p>
          
          <p>Best regards,<br/>
          PrivacyGuard Compliance System</p>
        </div>
      </div>
    `;

    const plainContent = `
Compliance Reminder

Hello,

This is a reminder that you have a compliance task due for ${data.organizationName}.

Task Details:
- Title: ${data.taskTitle}
- Type: ${taskTypeNames[data.taskType]}
- Due Date: ${data.dueDate}
${data.assignedBy ? `- Assigned by: ${data.assignedBy}` : ''}

Please complete this task as soon as possible to maintain compliance.

Dashboard: ${data.dashboardUrl}

If you have any questions, please contact your DPO or compliance team.

Best regards,
PrivacyGuard Compliance System
    `;

    return this.sendEmail({
      to: data.to,
      from: {
        email: 'compliance@privacyguard.com',
        name: 'PrivacyGuard Compliance',
      },
      subject,
      content: [
        { type: 'text/plain', value: plainContent },
        { type: 'text/html', value: htmlContent },
      ],
      categories: ['compliance', 'reminder'],
      custom_args: {
        task_type: data.taskType,
        organization: data.organizationName,
      },
    });
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(data: {
    to: { email: string; name?: string; };
    organizationName?: string;
    dashboardUrl: string;
    setupTasks?: string[];
  }): Promise<{ message_id: string }> {
    const subject = `Welcome to PrivacyGuard ${data.organizationName ? `- ${data.organizationName}` : ''}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0;">🛡️ Welcome to PrivacyGuard</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your GDPR compliance journey starts here</p>
        </div>
        
        <div style="padding: 30px; background: white; border: 1px solid #dee2e6; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hello ${data.to.name || 'there'},</p>
          
          <p>Welcome to PrivacyGuard! We're excited to help you navigate GDPR compliance with confidence.</p>
          
          ${data.organizationName ? `<p>You've been added to <strong>${data.organizationName}</strong>'s privacy management workspace.</p>` : ''}
          
          <h3 style="color: #495057;">What you can do with PrivacyGuard:</h3>
          <ul style="color: #6c757d;">
            <li>🤖 AI-powered policy generation and risk assessment</li>
            <li>📊 Comprehensive compliance dashboard</li>
            <li>📋 DPIA management and automation</li>
            <li>📧 Data subject request handling</li>
            <li>🚨 Incident response and breach management</li>
            <li>👥 Expert DPO marketplace access</li>
          </ul>
          
          ${data.setupTasks && data.setupTasks.length > 0 ? `
          <h3 style="color: #495057;">Getting Started Checklist:</h3>
          <ul style="color: #6c757d;">
            ${data.setupTasks.map(task => `<li>${task}</li>`).join('')}
          </ul>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.dashboardUrl}" 
               style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; font-size: 16px;">
              Get Started
            </a>
          </div>
          
          <p>If you need any help getting started, our support team is here to assist you. Just reply to this email or visit our help center.</p>
          
          <p>Best regards,<br/>
          The PrivacyGuard Team</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 14px;">
          <p>Need help? Visit our <a href="https://privacyguard.com/support" style="color: #007bff;">Support Center</a></p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: [data.to],
      from: {
        email: 'welcome@privacyguard.com',
        name: 'PrivacyGuard Team',
      },
      subject,
      content: [
        { type: 'text/html', value: htmlContent },
      ],
      categories: ['welcome', 'onboarding'],
      custom_args: {
        organization: data.organizationName || 'personal',
      },
    });
  }

  /**
   * Sync with PrivacyGuard notifications
   */
  async syncWithPrivacyGuard(data: {
    user_email: string;
    organization_preferences: {
      incident_alerts: boolean;
      compliance_reminders: boolean;
      breach_notifications: boolean;
      weekly_reports: boolean;
    };
    user_name?: string;
  }): Promise<{
    contact_id?: string;
    lists_added: string[];
    preferences_updated: boolean;
  }> {
    try {
      // Add or update contact
      const contacts = await this.addContacts([{
        email: data.user_email,
        first_name: data.user_name?.split(' ')[0],
        last_name: data.user_name?.split(' ').slice(1).join(' '),
        custom_fields: {
          incident_alerts: data.organization_preferences.incident_alerts,
          compliance_reminders: data.organization_preferences.compliance_reminders,
          breach_notifications: data.organization_preferences.breach_notifications,
          weekly_reports: data.organization_preferences.weekly_reports,
        }
      }]);

      // Create lists for different notification types if they don't exist
      const listsToCreate = [
        'PrivacyGuard - Incident Alerts',
        'PrivacyGuard - Compliance Reminders',
        'PrivacyGuard - Breach Notifications',
        'PrivacyGuard - Weekly Reports'
      ];

      const listsAdded: string[] = [];

      for (const listName of listsToCreate) {
        try {
          const list = await this.createList(listName);
          listsAdded.push(list.id);
        } catch (error) {
          // List might already exist, that's okay
          console.log(`List ${listName} might already exist`);
        }
      }

      return {
        contact_id: contacts.job_id,
        lists_added: listsAdded,
        preferences_updated: true,
      };
    } catch (error) {
      console.error('Failed to sync with SendGrid:', error);
      return {
        lists_added: [],
        preferences_updated: false,
      };
    }
  }
}
