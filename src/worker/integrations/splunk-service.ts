/**
 * Splunk Integration Service for Security Information and Event Management (SIEM)
 * Handles log aggregation, security monitoring, and compliance reporting
 */

export interface SplunkSearchJob {
  sid: string;
  search: string;
  earliest_time?: string;
  latest_time?: string;
  status_buckets: number;
  done_progress: number;
  scan_count: number;
  drop_count: number;
  earliest_time_epoch: number;
  latest_time_epoch: number;
  run_duration: number;
  dispatch_state: 'QUEUED' | 'PARSING' | 'RUNNING' | 'PAUSED' | 'FINALIZING' | 'FAILED' | 'DONE';
  is_done: boolean;
  is_finalized: boolean;
  is_paused: boolean;
  is_saved_search: boolean;
  is_zombie: boolean;
  performance: {
    command: string;
    input_count: number;
    input_lookups: number;
    output_count: number;
    duration_secs: number;
  }[];
}

export interface SplunkSearchResult {
  preview: boolean;
  offset: number;
  lastrow: boolean;
  fields: Array<{
    name: string;
    type?: string;
  }>;
  results: Array<Record<string, any>>;
  highlighted?: Record<string, any>;
  messages?: Array<{
    type: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
    text: string;
  }>;
}

export interface SplunkIndex {
  name: string;
  datatype: 'event' | 'metric';
  currentDBSizeMB: number;
  maxDataSize: string;
  maxHotBuckets: number;
  maxWarmDBSize: string;
  homePath: string;
  coldPath: string;
  thawedPath: string;
  disabled: boolean;
  isInternal: boolean;
  totalEventCount: number;
  minTime: string;
  maxTime: string;
}

export interface SplunkApp {
  name: string;
  label: string;
  version: string;
  author: string;
  description: string;
  disabled: boolean;
  visible: boolean;
  state_change_requires_restart: boolean;
  configured: boolean;
  check_for_updates: boolean;
}

export interface SplunkAlert {
  name: string;
  search: string;
  description?: string;
  disabled: boolean;
  cron_schedule?: string;
  earliest_time?: string;
  latest_time?: string;
  actions: string;
  alert_comparator: 'greater than' | 'less than' | 'equal to' | 'not equal to' | 'rises by' | 'drops by' | 'rises by perc' | 'drops by perc';
  alert_threshold: string;
  alert_type: 'always' | 'once' | 'number of events' | 'number of results' | 'number of hosts' | 'number of sources';
  dispatch: {
    earliest_time: string;
    latest_time: string;
    index_earliest?: string;
    index_latest?: string;
    max_count: number;
    max_time: number;
  };
  triggered_alerts?: number;
  fired_alerts?: number;
}

export interface SplunkEvent {
  _raw: string;
  _time: string;
  host?: string;
  source?: string;
  sourcetype?: string;
  index?: string;
  _indextime?: string;
  splunk_server?: string;
  [key: string]: any;
}

export class SplunkService {
  private apiKey: string;
  private baseUrl: string;
  private username: string;
  private password: string;

  constructor(baseUrl: string, username: string, password: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.username = username;
    this.password = password;
    this.apiKey = apiKey || '';
  }

  private async getSessionKey(): Promise<string> {
    if (this.apiKey) {
      return this.apiKey;
    }

    const response = await fetch(`${this.baseUrl}/services/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: this.username,
        password: this.password,
        output: 'json',
      }),
    });

    if (!response.ok) {
      throw new Error(`Splunk authentication failed: ${response.status}`);
    }

    const data = await response.json();
    return data.sessionKey;
  }

  private async makeRequest(method: string, endpoint: string, data?: any, params?: Record<string, string>): Promise<any> {
    const sessionKey = await this.getSessionKey();
    const url = new URL(`${this.baseUrl}/services${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: Record<string, string> = {
      'Authorization': `Splunk ${sessionKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    let body: string | undefined;
    if (data) {
      if (method === 'POST' || method === 'PUT') {
        body = new URLSearchParams(data).toString();
      }
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.text().catch(() => 'Unknown error');
      throw new Error(`Splunk API error: ${response.status} - ${error}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return response.json();
    } else if (contentType?.includes('application/xml') || contentType?.includes('text/xml')) {
      const text = await response.text();
      // Simple XML parsing for Splunk responses
      return { raw: text };
    } else {
      return response.text();
    }
  }

  /**
   * Create search job
   */
  async createSearchJob(search: string, options?: {
    earliest_time?: string;
    latest_time?: string;
    max_count?: number;
    max_time?: number;
    timeout?: number;
    preview?: boolean;
    auto_cancel?: number;
    auto_pause?: number;
  }): Promise<{ sid: string }> {
    const searchData: any = {
      search,
      output: 'json',
    };

    if (options) {
      Object.assign(searchData, options);
    }

    const result = await this.makeRequest('POST', '/search/jobs', searchData);
    
    // Extract SID from response
    if (typeof result === 'string' && result.includes('<sid>')) {
      const sidMatch = result.match(/<sid>([^<]+)<\/sid>/);
      if (sidMatch) {
        return { sid: sidMatch[1] };
      }
    }
    
    return result;
  }

  /**
   * Get search job status
   */
  async getSearchJobStatus(sid: string): Promise<SplunkSearchJob> {
    return this.makeRequest('GET', `/search/jobs/${sid}`, undefined, { output: 'json' });
  }

  /**
   * Get search results
   */
  async getSearchResults(sid: string, options?: {
    count?: number;
    offset?: number;
    max_lines?: number;
    truncation_mode?: 'abstract' | 'truncate';
    output_mode?: 'json' | 'xml' | 'csv';
  }): Promise<SplunkSearchResult> {
    const params: Record<string, string> = {
      output: options?.output_mode || 'json',
    };

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && key !== 'output_mode') {
          params[key] = String(value);
        }
      });
    }

    return this.makeRequest('GET', `/search/jobs/${sid}/results`, undefined, params);
  }

  /**
   * Delete search job
   */
  async deleteSearchJob(sid: string): Promise<void> {
    await this.makeRequest('DELETE', `/search/jobs/${sid}`);
  }

  /**
   * Execute oneshot search
   */
  async oneshotSearch(search: string, options?: {
    earliest_time?: string;
    latest_time?: string;
    max_count?: number;
    timeout?: number;
  }): Promise<SplunkSearchResult> {
    const searchData: any = {
      search,
      output: 'json',
    };

    if (options) {
      Object.assign(searchData, options);
    }

    return this.makeRequest('POST', '/search/jobs/oneshot', searchData);
  }

  /**
   * Get indexes
   */
  async getIndexes(): Promise<{ entry: SplunkIndex[] }> {
    return this.makeRequest('GET', '/data/indexes', undefined, { output: 'json' });
  }

  /**
   * Create index
   */
  async createIndex(name: string, options?: {
    datatype?: 'event' | 'metric';
    homePath?: string;
    coldPath?: string;
    thawedPath?: string;
    maxDataSize?: string;
    maxHotBuckets?: number;
    maxWarmDBSize?: string;
  }): Promise<SplunkIndex> {
    const indexData: any = { name };
    
    if (options) {
      Object.assign(indexData, options);
    }

    return this.makeRequest('POST', '/data/indexes', indexData);
  }

  /**
   * Submit event to index
   */
  async submitEvent(index: string, event: string | SplunkEvent, options?: {
    source?: string;
    sourcetype?: string;
    host?: string;
    time?: string;
  }): Promise<void> {
    const eventData: any = {};

    if (typeof event === 'string') {
      eventData.event = event;
    } else {
      eventData.event = event._raw || JSON.stringify(event);
      if (event._time) eventData.time = event._time;
      if (event.host) eventData.host = event.host;
      if (event.source) eventData.source = event.source;
      if (event.sourcetype) eventData.sourcetype = event.sourcetype;
    }

    if (options) {
      Object.assign(eventData, options);
    }

    await this.makeRequest('POST', `/receivers/simple?index=${index}`, eventData);
  }

  /**
   * Get saved searches/alerts
   */
  async getSavedSearches(): Promise<{ entry: SplunkAlert[] }> {
    return this.makeRequest('GET', '/saved/searches', undefined, { output: 'json' });
  }

  /**
   * Create saved search/alert
   */
  async createSavedSearch(name: string, search: string, options?: {
    description?: string;
    cron_schedule?: string;
    earliest_time?: string;
    latest_time?: string;
    actions?: string;
    alert_type?: string;
    alert_comparator?: string;
    alert_threshold?: string;
    disabled?: boolean;
  }): Promise<SplunkAlert> {
    const searchData: any = {
      name,
      search,
    };

    if (options) {
      Object.assign(searchData, options);
    }

    return this.makeRequest('POST', '/saved/searches', searchData);
  }

  /**
   * Fire saved search
   */
  async fireSavedSearch(name: string): Promise<{ sid: string }> {
    return this.makeRequest('POST', `/saved/searches/${encodeURIComponent(name)}/dispatch`);
  }

  /**
   * Get apps
   */
  async getApps(): Promise<{ entry: SplunkApp[] }> {
    return this.makeRequest('GET', '/apps/local', undefined, { output: 'json' });
  }

  /**
   * Setup PrivacyGuard monitoring
   */
  async setupPrivacyGuardMonitoring(): Promise<{
    index_created: boolean;
    alerts_created: number;
    dashboards_created: number;
  }> {
    let indexCreated = false;
    let alertsCreated = 0;

    // Create privacy_guard index
    try {
      await this.createIndex('privacy_guard', {
        datatype: 'event',
        maxDataSize: '10GB',
        maxHotBuckets: 3,
        maxWarmDBSize: '5GB'
      });
      indexCreated = true;
    } catch (error) {
      console.log('Index might already exist:', error);
    }

    // Create critical alerts
    const alerts = [
      {
        name: 'PrivacyGuard - High Risk DSAR Response Time',
        search: 'index=privacy_guard sourcetype=dsar | where response_time_hours > 72 | stats count by organization',
        description: 'Alert when DSAR response time exceeds 72 hours (GDPR compliance risk)',
        cron_schedule: '0 */4 * * *', // Every 4 hours
        alert_type: 'number of events',
        alert_comparator: 'greater than',
        alert_threshold: '0',
        actions: 'email'
      },
      {
        name: 'PrivacyGuard - Data Breach Detected',
        search: 'index=privacy_guard sourcetype=breach | eval time_since=now()-_time | where time_since < 900 | stats count by severity',
        description: 'Alert on new data breach incidents',
        cron_schedule: '*/5 * * * *', // Every 5 minutes
        alert_type: 'number of events',
        alert_comparator: 'greater than',
        alert_threshold: '0',
        actions: 'email'
      },
      {
        name: 'PrivacyGuard - Low Compliance Score',
        search: 'index=privacy_guard sourcetype=compliance_score | where score < 70 | stats avg(score) as avg_score by organization',
        description: 'Alert when organization compliance score drops below 70%',
        cron_schedule: '0 9 * * *', // Daily at 9 AM
        alert_type: 'number of events',
        alert_comparator: 'greater than',
        alert_threshold: '0',
        actions: 'email'
      },
      {
        name: 'PrivacyGuard - Failed AI Processing',
        search: 'index=privacy_guard sourcetype=ai_processing | where status="failed" | stats count by error_type',
        description: 'Alert on AI processing failures',
        cron_schedule: '*/15 * * * *', // Every 15 minutes
        alert_type: 'number of events',
        alert_comparator: 'greater than',
        alert_threshold: '5',
        actions: 'email'
      }
    ];

    for (const alert of alerts) {
      try {
        await this.createSavedSearch(alert.name, alert.search, {
          description: alert.description,
          cron_schedule: alert.cron_schedule,
          alert_type: alert.alert_type,
          alert_comparator: alert.alert_comparator,
          alert_threshold: alert.alert_threshold,
          actions: alert.actions,
          earliest_time: '-24h@h',
          latest_time: 'now'
        });
        alertsCreated++;
      } catch (error) {
        console.error(`Failed to create alert ${alert.name}:`, error);
      }
    }

    return {
      index_created: indexCreated,
      alerts_created: alertsCreated,
      dashboards_created: 0 // Would require more complex dashboard creation
    };
  }

  /**
   * Log compliance event
   */
  async logComplianceEvent(data: {
    organization_id: string;
    event_type: 'dsar_received' | 'dsar_completed' | 'breach_detected' | 'policy_updated' | 'training_completed' | 'ai_processing';
    user_id?: string;
    details: Record<string, any>;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    timestamp?: string;
  }): Promise<void> {
    const event: SplunkEvent = {
      _raw: JSON.stringify({
        organization_id: data.organization_id,
        event_type: data.event_type,
        user_id: data.user_id,
        severity: data.severity || 'medium',
        timestamp: data.timestamp || new Date().toISOString(),
        ...data.details
      }),
      _time: data.timestamp || new Date().toISOString(),
      sourcetype: data.event_type,
      source: 'privacy_guard_platform',
      host: 'privacy-guard-api'
    };

    await this.submitEvent('privacy_guard', event);
  }

  /**
   * Search compliance events
   */
  async searchComplianceEvents(query: {
    organization_id?: string;
    event_type?: string;
    severity?: string;
    time_range?: {
      earliest: string;
      latest: string;
    };
    limit?: number;
  }): Promise<SplunkSearchResult> {
    let search = 'index=privacy_guard';
    
    if (query.organization_id) {
      search += ` | where organization_id="${query.organization_id}"`;
    }
    
    if (query.event_type) {
      search += ` | where event_type="${query.event_type}"`;
    }
    
    if (query.severity) {
      search += ` | where severity="${query.severity}"`;
    }

    search += ' | sort -_time';
    
    if (query.limit) {
      search += ` | head ${query.limit}`;
    }

    const options: any = {};
    if (query.time_range) {
      options.earliest_time = query.time_range.earliest;
      options.latest_time = query.time_range.latest;
    }

    return this.oneshotSearch(search, options);
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(organizationId: string, timeRange: {
    earliest: string;
    latest: string;
  }): Promise<{
    summary: {
      total_events: number;
      by_type: Record<string, number>;
      by_severity: Record<string, number>;
    };
    dsar_metrics: {
      total_received: number;
      total_completed: number;
      average_response_time: number;
      overdue_count: number;
    };
    breach_incidents: number;
    compliance_trends: Array<{
      date: string;
      score: number;
    }>;
  }> {
    // Summary search
    const summarySearch = `index=privacy_guard organization_id="${organizationId}" | stats count by event_type, severity`;
    const summaryResult = await this.oneshotSearch(summarySearch, timeRange);

    // DSAR metrics
    const dsarSearch = `index=privacy_guard organization_id="${organizationId}" sourcetype=dsar* | stats count(eval(event_type="dsar_received")) as received, count(eval(event_type="dsar_completed")) as completed, avg(response_time_hours) as avg_response_time, count(eval(response_time_hours > 72)) as overdue`;
    const dsarResult = await this.oneshotSearch(dsarSearch, timeRange);

    // Breach incidents
    const breachSearch = `index=privacy_guard organization_id="${organizationId}" sourcetype=breach_detected | stats count`;
    const breachResult = await this.oneshotSearch(breachSearch, timeRange);

    // Compliance trends
    const trendsSearch = `index=privacy_guard organization_id="${organizationId}" sourcetype=compliance_score | eval date=strftime(_time, "%Y-%m-%d") | stats avg(score) as avg_score by date | sort date`;
    const trendsResult = await this.oneshotSearch(trendsSearch, timeRange);

    // Process results
    const summary = {
      total_events: summaryResult.results?.length || 0,
      by_type: {},
      by_severity: {}
    };

    summaryResult.results?.forEach((result: any) => {
      if (result.event_type) {
        summary.by_type[result.event_type] = parseInt(result.count) || 0;
      }
      if (result.severity) {
        summary.by_severity[result.severity] = parseInt(result.count) || 0;
      }
    });

    const dsarMetrics = dsarResult.results?.[0] || {};
    const complianceTrends = trendsResult.results?.map((result: any) => ({
      date: result.date,
      score: parseFloat(result.avg_score) || 0
    })) || [];

    return {
      summary,
      dsar_metrics: {
        total_received: parseInt(dsarMetrics.received) || 0,
        total_completed: parseInt(dsarMetrics.completed) || 0,
        average_response_time: parseFloat(dsarMetrics.avg_response_time) || 0,
        overdue_count: parseInt(dsarMetrics.overdue) || 0
      },
      breach_incidents: parseInt(breachResult.results?.[0]?.count) || 0,
      compliance_trends: complianceTrends
    };
  }
}
