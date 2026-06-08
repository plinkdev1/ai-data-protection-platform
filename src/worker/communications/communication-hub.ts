export interface CommunicationEnv {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  SENDGRID_API_KEY: string;
  FRESHCHAT_API_KEY: string;
}

export interface SMSMessage {
  to: string;
  body: string;
  from?: string;
}

export interface EmailMessage {
  to: string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  templateId?: string;
  templateData?: Record<string, any>;
}

export interface ChatMessage {
  userId: string;
  message: string;
  type: 'user' | 'agent' | 'bot';
  conversationId?: string;
}

export class CommunicationHub {
  constructor(private env: CommunicationEnv) {}

  // Twilio integration for SMS and voice communications
  async sendSMS(message: SMSMessage): Promise<string> {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${this.env.TWILIO_ACCOUNT_SID}:${this.env.TWILIO_AUTH_TOKEN}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: message.to,
            From: message.from || process.env.TWILIO_PHONE_NUMBER || '',
            Body: message.body,
          }),
        }
      );

      const data = await response.json();
      return data.sid;
    } catch (error) {
      console.error('Twilio SMS failed:', error);
      throw error;
    }
  }

  async makeVoiceCall(to: string, message: string): Promise<string> {
    try {
      const twimlUrl = await this.createTwiMLUrl(message);
      
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.env.TWILIO_ACCOUNT_SID}/Calls.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${this.env.TWILIO_ACCOUNT_SID}:${this.env.TWILIO_AUTH_TOKEN}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: to,
            From: process.env.TWILIO_PHONE_NUMBER || '',
            Url: twimlUrl,
          }),
        }
      );

      const data = await response.json();
      return data.sid;
    } catch (error) {
      console.error('Twilio voice call failed:', error);
      throw error;
    }
  }

  private async createTwiMLUrl(message: string): Promise<string> {
    // In production, this would be a proper TwiML endpoint
    return `https://api.privacyguard.com/twiml?message=${encodeURIComponent(message)}`;
  }

  // SendGrid integration for email notifications and marketing
  async sendEmail(email: EmailMessage): Promise<string> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: email.to.map(addr => ({ email: addr })),
            dynamic_template_data: email.templateData || {},
          }],
          from: {
            email: email.from || 'noreply@privacyguard.com',
            name: 'PrivacyGuard',
          },
          subject: email.subject,
          content: [
            {
              type: 'text/html',
              value: email.html,
            },
            ...(email.text ? [{
              type: 'text/plain',
              value: email.text,
            }] : []),
          ],
          template_id: email.templateId,
        }),
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.status}`);
      }

      return response.headers.get('X-Message-Id') || 'sent';
    } catch (error) {
      console.error('SendGrid email failed:', error);
      throw error;
    }
  }

  async sendTemplatedEmail(templateId: string, to: string[], templateData: Record<string, any>): Promise<string> {
    return this.sendEmail({
      to,
      subject: '', // Will be set by template
      html: '', // Will be set by template
      templateId,
      templateData,
    });
  }

  // Pre-defined email templates for compliance workflows
  async sendDPIANotification(to: string[], dpiaTitle: string, dueDate: Date): Promise<string> {
    return this.sendTemplatedEmail('dpia-notification', to, {
      dpia_title: dpiaTitle,
      due_date: dueDate.toLocaleDateString(),
      dashboard_url: 'https://app.privacyguard.com/dashboard',
    });
  }

  async sendBreachAlertEmail(to: string[], incidentId: string, severity: string): Promise<string> {
    return this.sendTemplatedEmail('breach-alert', to, {
      incident_id: incidentId,
      severity: severity.toUpperCase(),
      incident_url: `https://app.privacyguard.com/incidents/${incidentId}`,
    });
  }

  async sendComplianceReportEmail(to: string[], reportType: string, reportUrl: string): Promise<string> {
    return this.sendTemplatedEmail('compliance-report', to, {
      report_type: reportType,
      report_url: reportUrl,
      generated_date: new Date().toLocaleDateString(),
    });
  }

  // Freshchat integration for customer support
  async createSupportTicket(ticket: {
    userId: string;
    subject: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'technical' | 'billing' | 'compliance' | 'general';
  }): Promise<string> {
    try {
      const response = await fetch('https://api.freshchat.com/v2/conversations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.FRESHCHAT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: process.env.FRESHCHAT_APP_ID,
          user_id: ticket.userId,
          messages: [{
            message_type: 'normal',
            message_parts: [{
              text: {
                content: ticket.message,
              },
            }],
          }],
          properties: {
            priority: ticket.priority,
            category: ticket.category,
            subject: ticket.subject,
          },
        }),
      });

      const data = await response.json();
      return data.conversation_id;
    } catch (error) {
      console.error('Freshchat ticket creation failed:', error);
      throw error;
    }
  }

  async sendChatMessage(conversationId: string, message: string, type: 'agent' | 'bot' = 'agent'): Promise<void> {
    try {
      await fetch(`https://api.freshchat.com/v2/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.FRESHCHAT_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message_type: 'normal',
          actor_type: type,
          message_parts: [{
            text: {
              content: message,
            },
          }],
        }),
      });
    } catch (error) {
      console.error('Freshchat message failed:', error);
      throw error;
    }
  }

  // Multi-channel notification system
  async sendMultiChannelNotification(notification: {
    userId: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    channels: Array<'email' | 'sms' | 'chat'>;
    userPreferences?: {
      email?: string;
      phone?: string;
      chatId?: string;
    };
  }): Promise<{
    email?: string;
    sms?: string;
    chat?: string;
  }> {
    const results: any = {};

    if (notification.channels.includes('email') && notification.userPreferences?.email) {
      try {
        results.email = await this.sendEmail({
          to: [notification.userPreferences.email],
          subject: notification.title,
          html: `<h2>${notification.title}</h2><p>${notification.message}</p>`,
          text: `${notification.title}\n\n${notification.message}`,
        });
      } catch (error) {
        console.error('Multi-channel email failed:', error);
      }
    }

    if (notification.channels.includes('sms') && notification.userPreferences?.phone) {
      try {
        results.sms = await this.sendSMS({
          to: notification.userPreferences.phone,
          body: `${notification.title}: ${notification.message}`,
        });
      } catch (error) {
        console.error('Multi-channel SMS failed:', error);
      }
    }

    if (notification.channels.includes('chat') && notification.userPreferences?.chatId) {
      try {
        await this.sendChatMessage(
          notification.userPreferences.chatId,
          `🔔 ${notification.title}\n\n${notification.message}`,
          'bot'
        );
        results.chat = 'sent';
      } catch (error) {
        console.error('Multi-channel chat failed:', error);
      }
    }

    return results;
  }

  // Automated compliance notifications
  async scheduleReminderNotifications(reminders: Array<{
    userId: string;
    type: 'dpia_due' | 'policy_review' | 'training_required' | 'audit_preparation';
    dueDate: Date;
    details: Record<string, any>;
  }>): Promise<void> {
    for (const reminder of reminders) {
      const daysUntilDue = Math.ceil((reminder.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      // Schedule notifications at different intervals
      const notificationSchedule = [30, 14, 7, 3, 1]; // days before due date
      
      for (const daysBefore of notificationSchedule) {
        if (daysUntilDue > daysBefore) {
          const notificationDate = new Date(reminder.dueDate.getTime() - (daysBefore * 24 * 60 * 60 * 1000));
          
          // In production, this would be scheduled with a proper job queue
          console.log(`Scheduled ${reminder.type} reminder for ${reminder.userId} on ${notificationDate.toISOString()}`);
        }
      }
    }
  }

  // Health check for communication services
  async healthCheck(): Promise<{
    twilio: boolean;
    sendgrid: boolean;
    freshchat: boolean;
  }> {
    const health = {
      twilio: false,
      sendgrid: false,
      freshchat: false,
    };

    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.env.TWILIO_ACCOUNT_SID}.json`,
        {
          headers: {
            'Authorization': `Basic ${btoa(`${this.env.TWILIO_ACCOUNT_SID}:${this.env.TWILIO_AUTH_TOKEN}`)}`,
          },
        }
      );
      health.twilio = response.ok;
    } catch {
      // Twilio not available
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
        headers: {
          'Authorization': `Bearer ${this.env.SENDGRID_API_KEY}`,
        },
      });
      health.sendgrid = response.ok;
    } catch {
      // SendGrid not available
    }

    try {
      const response = await fetch('https://api.freshchat.com/v2/accounts/me', {
        headers: {
          'Authorization': `Bearer ${this.env.FRESHCHAT_API_KEY}`,
        },
      });
      health.freshchat = response.ok;
    } catch {
      // Freshchat not available
    }

    return health;
  }
}
