/**
 * Twilio Integration Service for SMS, Voice, and Notifications
 * Handles incident alerts, verification codes, and notifications
 */

export interface TwilioMessage {
  sid: string;
  account_sid: string;
  from: string;
  to: string;
  body: string;
  status: 'queued' | 'failed' | 'sent' | 'delivered' | 'undelivered' | 'receiving' | 'received' | 'accepted' | 'scheduled' | 'read' | 'partially_delivered';
  direction: 'inbound' | 'outbound-api' | 'outbound-call' | 'outbound-reply';
  date_created: string;
  date_sent?: string;
  date_updated: string;
  error_code?: number;
  error_message?: string;
  messaging_service_sid?: string;
  num_segments: string;
  num_media: string;
  price?: string;
  price_unit?: string;
  uri: string;
}

export interface TwilioCall {
  sid: string;
  account_sid: string;
  from: string;
  to: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled';
  start_time?: string;
  end_time?: string;
  duration?: string;
  direction: 'inbound' | 'outbound-api' | 'outbound-dial';
  answered_by?: string;
  forwarded_from?: string;
  caller_name?: string;
  uri: string;
  date_created: string;
  date_updated: string;
}

export interface TwilioVerification {
  sid: string;
  service_sid: string;
  account_sid: string;
  to: string;
  channel: 'sms' | 'call' | 'email' | 'whatsapp';
  status: 'pending' | 'approved' | 'canceled' | 'max_attempts_reached';
  valid: boolean;
  lookup: {
    carrier?: {
      mobile_country_code?: string;
      mobile_network_code?: string;
      name?: string;
      type?: string;
      error_code?: string;
    };
  };
  amount?: string;
  payee?: string;
  send_code_attempts: Array<{
    time: string;
    channel: string;
    attempt_sid: string;
  }>;
  date_created: string;
  date_updated: string;
  url: string;
}

export interface TwilioPhoneNumber {
  sid: string;
  account_sid: string;
  friendly_name: string;
  phone_number: string;
  voice_url?: string;
  voice_method?: string;
  voice_fallback_url?: string;
  voice_fallback_method?: string;
  status_callback?: string;
  status_callback_method?: string;
  voice_caller_id_lookup?: boolean;
  date_created: string;
  date_updated: string;
  sms_url?: string;
  sms_method?: string;
  sms_fallback_url?: string;
  sms_fallback_method?: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
    fax: boolean;
  };
}

export class TwilioService {
  private accountSid: string;
  private authToken: string;
  private apiUrl: string;

  constructor(accountSid: string, authToken: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}`;
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.apiUrl}${endpoint}`;
    const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    const body = data ? new URLSearchParams(data).toString() : undefined;

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`Twilio API error: ${response.status} - ${error.message || error.detail || 'Request failed'}`);
    }

    return response.json();
  }

  /**
   * Send SMS message
   */
  async sendSMS(data: {
    to: string;
    from: string;
    body: string;
    messagingServiceSid?: string;
    mediaUrl?: string[];
    statusCallback?: string;
    maxPrice?: string;
    provideFeedback?: boolean;
    attempt?: number;
    validityPeriod?: number;
    forceDelivery?: boolean;
    contentRetention?: 'retain' | 'discard';
    addressRetention?: 'retain' | 'discard';
    smartEncoded?: boolean;
    persistentAction?: string[];
    shortenUrls?: boolean;
    scheduleType?: 'fixed';
    sendAt?: string;
    sendAsMms?: boolean;
    contentVariables?: string;
  }): Promise<TwilioMessage> {
    const payload: any = {
      To: data.to,
      Body: data.body,
    };

    if (data.messagingServiceSid) {
      payload.MessagingServiceSid = data.messagingServiceSid;
    } else {
      payload.From = data.from;
    }

    if (data.mediaUrl) {
      data.mediaUrl.forEach((url, index) => {
        payload[`MediaUrl[${index}]`] = url;
      });
    }

    if (data.statusCallback) payload.StatusCallback = data.statusCallback;
    if (data.maxPrice) payload.MaxPrice = data.maxPrice;
    if (data.provideFeedback) payload.ProvideFeedback = data.provideFeedback;
    if (data.attempt) payload.Attempt = data.attempt;
    if (data.validityPeriod) payload.ValidityPeriod = data.validityPeriod;

    return this.makeRequest('POST', '/Messages.json', payload);
  }

  /**
   * Get message details
   */
  async getMessage(messageSid: string): Promise<TwilioMessage> {
    return this.makeRequest('GET', `/Messages/${messageSid}.json`);
  }

  /**
   * List messages
   */
  async listMessages(options?: {
    to?: string;
    from?: string;
    dateSent?: string;
    dateSentBefore?: string;
    dateSentAfter?: string;
    pageSize?: number;
    page?: number;
  }): Promise<{ messages: TwilioMessage[]; next_page_uri?: string }> {
    const params: any = {};
    if (options) {
      if (options.to) params.To = options.to;
      if (options.from) params.From = options.from;
      if (options.dateSent) params.DateSent = options.dateSent;
      if (options.dateSentBefore) params['DateSent<'] = options.dateSentBefore;
      if (options.dateSentAfter) params['DateSent>'] = options.dateSentAfter;
      if (options.pageSize) params.PageSize = options.pageSize;
      if (options.page) params.Page = options.page;
    }

    return this.makeRequest('GET', '/Messages.json', params);
  }

  /**
   * Make voice call
   */
  async makeCall(data: {
    to: string;
    from: string;
    url?: string;
    twiml?: string;
    method?: 'GET' | 'POST';
    statusCallback?: string;
    statusCallbackEvent?: string[];
    statusCallbackMethod?: 'GET' | 'POST';
    fallbackUrl?: string;
    fallbackMethod?: 'GET' | 'POST';
    timeout?: number;
    record?: boolean;
    recordingChannels?: 'mono' | 'dual';
    recordingStatusCallback?: string;
    recordingStatusCallbackMethod?: 'GET' | 'POST';
    trim?: 'trim-silence' | 'do-not-trim';
    callerIdName?: string;
    machineDetection?: 'Enable' | 'DetectMessageEnd';
    machineDetectionTimeout?: number;
    recordingStatusCallbackEvent?: string[];
    trim_silence?: boolean;
  }): Promise<TwilioCall> {
    const payload: any = {
      To: data.to,
      From: data.from,
    };

    if (data.url) payload.Url = data.url;
    if (data.twiml) payload.Twiml = data.twiml;
    if (data.method) payload.Method = data.method;
    if (data.statusCallback) payload.StatusCallback = data.statusCallback;
    if (data.timeout) payload.Timeout = data.timeout;
    if (data.record) payload.Record = data.record;

    return this.makeRequest('POST', '/Calls.json', payload);
  }

  /**
   * Get call details
   */
  async getCall(callSid: string): Promise<TwilioCall> {
    return this.makeRequest('GET', `/Calls/${callSid}.json`);
  }

  /**
   * List calls
   */
  async listCalls(options?: {
    to?: string;
    from?: string;
    status?: string;
    startTime?: string;
    startTimeBefore?: string;
    startTimeAfter?: string;
    parentCallSid?: string;
    pageSize?: number;
    page?: number;
  }): Promise<{ calls: TwilioCall[]; next_page_uri?: string }> {
    const params: any = {};
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params[key.charAt(0).toUpperCase() + key.slice(1)] = value;
        }
      });
    }

    return this.makeRequest('GET', '/Calls.json', params);
  }

  /**
   * Create verification service
   */
  async createVerificationService(data: {
    friendlyName: string;
    codeLength?: number;
    lookupEnabled?: boolean;
    psd2Enabled?: boolean;
    skipSmsToLandlines?: boolean;
    dtmfInputRequired?: boolean;
    ttsName?: string;
    doNotShareWarningEnabled?: boolean;
    customCodeEnabled?: boolean;
    pushNotifications?: {
      apnCredentialSid?: string;
      fcmCredentialSid?: string;
      includeDate?: boolean;
      ttl?: number;
    };
  }): Promise<any> {
    const verifyUrl = `https://verify.twilio.com/v2/Services`;
    const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    const payload: any = {
      FriendlyName: data.friendlyName,
    };

    if (data.codeLength) payload.CodeLength = data.codeLength;
    if (data.lookupEnabled) payload.LookupEnabled = data.lookupEnabled;

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload).toString(),
    });

    if (!response.ok) {
      throw new Error(`Verification service creation failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Start verification
   */
  async startVerification(serviceSid: string, data: {
    to: string;
    channel: 'sms' | 'call' | 'email' | 'whatsapp';
    customCode?: string;
    amount?: string;
    payee?: string;
    rateLimits?: {
      [key: string]: number;
    };
  }): Promise<TwilioVerification> {
    const verifyUrl = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;
    const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    const payload: any = {
      To: data.to,
      Channel: data.channel,
    };

    if (data.customCode) payload.CustomCode = data.customCode;
    if (data.amount) payload.Amount = data.amount;
    if (data.payee) payload.Payee = data.payee;

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload).toString(),
    });

    if (!response.ok) {
      throw new Error(`Verification start failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Check verification
   */
  async checkVerification(serviceSid: string, data: {
    to: string;
    code: string;
  }): Promise<TwilioVerification> {
    const verifyUrl = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`;
    const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: data.to,
        Code: data.code,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Verification check failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Send incident alert via SMS
   */
  async sendIncidentAlert(data: {
    to: string[];
    from: string;
    incidentTitle: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    incidentId: string;
    dashboardUrl: string;
  }): Promise<{ sent: number; failed: number; message_sids: string[] }> {
    const message = `🚨 INCIDENT ALERT 🚨

Severity: ${data.severity.toUpperCase()}
Title: ${data.incidentTitle}

${data.description}

Incident ID: ${data.incidentId}
Dashboard: ${data.dashboardUrl}

Please respond immediately.`;

    let sent = 0;
    let failed = 0;
    const messageSids: string[] = [];

    for (const phoneNumber of data.to) {
      try {
        const result = await this.sendSMS({
          to: phoneNumber,
          from: data.from,
          body: message,
        });
        
        messageSids.push(result.sid);
        sent++;
      } catch (error) {
        console.error(`Failed to send incident alert to ${phoneNumber}:`, error);
        failed++;
      }
    }

    return { sent, failed, message_sids: messageSids };
  }

  /**
   * Send compliance reminder
   */
  async sendComplianceReminder(data: {
    to: string;
    from: string;
    organizationName: string;
    taskType: 'dpia_review' | 'policy_update' | 'training_due' | 'breach_report';
    dueDate: string;
    dashboardUrl: string;
  }): Promise<TwilioMessage> {
    const taskMessages = {
      dpia_review: 'DPIA review is due',
      policy_update: 'Policy update required',
      training_due: 'Compliance training is due',
      breach_report: 'Data breach report due'
    };

    const message = `📋 COMPLIANCE REMINDER

${data.organizationName}
${taskMessages[data.taskType]}

Due: ${data.dueDate}
Action required: ${data.dashboardUrl}

Stay compliant with PrivacyGuard.`;

    return this.sendSMS({
      to: data.to,
      from: data.from,
      body: message,
    });
  }

  /**
   * Send verification code for sensitive operations
   */
  async sendVerificationCode(serviceSid: string, data: {
    to: string;
    channel: 'sms' | 'call';
    operation: string;
  }): Promise<TwilioVerification> {
    return this.startVerification(serviceSid, {
      to: data.to,
      channel: data.channel,
    });
  }

  /**
   * Send data breach notification
   */
  async sendBreachNotification(data: {
    to: string[];
    from: string;
    organizationName: string;
    breachType: string;
    affectedCount: number;
    reportUrl: string;
  }): Promise<{ sent: number; failed: number; message_sids: string[] }> {
    const message = `🔒 DATA BREACH NOTIFICATION

${data.organizationName} has detected a ${data.breachType}.

Estimated affected individuals: ${data.affectedCount}

Full report: ${data.reportUrl}

We are taking immediate action to secure your data.`;

    let sent = 0;
    let failed = 0;
    const messageSids: string[] = [];

    for (const phoneNumber of data.to) {
      try {
        const result = await this.sendSMS({
          to: phoneNumber,
          from: data.from,
          body: message,
        });
        
        messageSids.push(result.sid);
        sent++;
      } catch (error) {
        console.error(`Failed to send breach notification to ${phoneNumber}:`, error);
        failed++;
      }
    }

    return { sent, failed, message_sids: messageSids };
  }

  /**
   * Get phone number info
   */
  async getPhoneNumber(phoneNumberSid: string): Promise<TwilioPhoneNumber> {
    return this.makeRequest('GET', `/IncomingPhoneNumbers/${phoneNumberSid}.json`);
  }

  /**
   * List phone numbers
   */
  async listPhoneNumbers(): Promise<{ incoming_phone_numbers: TwilioPhoneNumber[] }> {
    return this.makeRequest('GET', '/IncomingPhoneNumbers.json');
  }

  /**
   * Sync with PrivacyGuard notifications
   */
  async syncWithPrivacyGuard(data: {
    user_phone: string;
    organization_preferences: {
      incident_alerts: boolean;
      compliance_reminders: boolean;
      breach_notifications: boolean;
      verification_required: boolean;
    };
    from_number: string;
  }): Promise<{
    verification_service_sid?: string;
    phone_verified: boolean;
    notification_preferences_updated: boolean;
  }> {
    let verificationServiceSid: string | undefined;
    let phoneVerified = false;

    if (data.organization_preferences.verification_required) {
      try {
        // Create verification service for this organization
        const service = await this.createVerificationService({
          friendlyName: 'PrivacyGuard Verification',
          codeLength: 6,
          lookupEnabled: true,
        });
        
        verificationServiceSid = service.sid;

        // Start verification process
        await this.startVerification(service.sid, {
          to: data.user_phone,
          channel: 'sms',
        });

        phoneVerified = true;
      } catch (error) {
        console.error('Failed to set up verification:', error);
      }
    }

    return {
      verification_service_sid: verificationServiceSid,
      phone_verified: phoneVerified,
      notification_preferences_updated: true,
    };
  }
}
