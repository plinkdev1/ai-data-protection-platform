/**
 * Datadog Integration Service for Monitoring & Observability
 * Handles metrics, logs, traces, and alerts for PrivacyGuard platform
 */

export interface DatadogMetric {
  metric: string;
  points: Array<[number, number]>; // [timestamp, value]
  type?: 'count' | 'rate' | 'gauge';
  host?: string;
  tags?: string[];
  interval?: number;
}

export interface DatadogEvent {
  title: string;
  text: string;
  date_happened?: number;
  priority?: 'normal' | 'low';
  host?: string;
  tags?: string[];
  alert_type?: 'error' | 'warning' | 'info' | 'success';
  aggregation_key?: string;
  source_type_name?: string;
  related_event_id?: number;
}

export interface DatadogLog {
  message: string;
  timestamp?: number;
  level?: 'debug' | 'info' | 'warn' | 'error';
  service?: string;
  source?: string;
  host?: string;
  tags?: string[];
  attributes?: Record<string, any>;
}

export interface DatadogAlert {
  id: number;
  name: string;
  message: string;
  query: string;
  type: 'metric alert' | 'service check' | 'event alert' | 'process alert' | 'log alert' | 'synthetics alert' | 'rum alert';
  options: {
    thresholds: {
      critical?: number;
      warning?: number;
      ok?: number;
      critical_recovery?: number;
      warning_recovery?: number;
    };
    notify_audit: boolean;
    require_full_window: boolean;
    notify_no_data: boolean;
    renotify_interval?: number;
    timeout_h?: number;
    evaluation_delay?: number;
    new_host_delay?: number;
    include_tags: boolean;
  };
  state: 'OK' | 'Alert' | 'Warn' | 'No Data';
  overall_state: 'OK' | 'Alert' | 'Warn' | 'No Data';
  created: string;
  modified: string;
  created_at: number;
  creator: {
    id: number;
    name: string;
    email: string;
  };
  tags: string[];
}

export interface DatadogDashboard {
  id: string;
  title: string;
  description: string;
  author_handle: string;
  author_name: string;
  created_at: string;
  modified_at: string;
  url: string;
  layout_type: 'ordered' | 'free';
  is_read_only: boolean;
  notify_list: string[];
  template_variables: Array<{
    name: string;
    default: string;
    prefix?: string;
    available_values?: string[];
  }>;
  widgets: Array<{
    id: number;
    definition: any;
    layout?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}

export interface DatadogServiceCheck {
  check: string;
  host_name: string;
  status: 0 | 1 | 2 | 3; // OK, WARNING, CRITICAL, UNKNOWN
  timestamp?: number;
  message?: string;
  tags?: string[];
}

export class DatadogService {
  private apiKey: string;
  private appKey: string;
  private apiUrl = 'https://api.datadoghq.com/api/v1';
  private apiV2Url = 'https://api.datadoghq.com/api/v2';

  constructor(apiKey: string, appKey: string) {
    this.apiKey = apiKey;
    this.appKey = appKey;
  }

  private async makeRequest(method: string, endpoint: string, data?: any, useV2 = false): Promise<any> {
    const baseUrl = useV2 ? this.apiV2Url : this.apiUrl;
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'DD-API-KEY': this.apiKey,
        'DD-APPLICATION-KEY': this.appKey,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Datadog API error: ${response.status} - ${error.error || error.message || 'Request failed'}`);
    }

    return response.json();
  }

  /**
   * Submit metrics
   */
  async submitMetrics(metrics: DatadogMetric[]): Promise<{ status: string }> {
    const series = metrics.map(metric => ({
      metric: metric.metric,
      points: metric.points,
      type: metric.type || 'gauge',
      host: metric.host,
      tags: metric.tags,
      interval: metric.interval,
    }));

    return this.makeRequest('POST', '/series', { series });
  }

  /**
   * Submit single metric
   */
  async submitMetric(metric: DatadogMetric): Promise<{ status: string }> {
    return this.submitMetrics([metric]);
  }

  /**
   * Query metrics
   */
  async queryMetrics(query: string, from: number, to: number): Promise<{
    status: string;
    res_type: string;
    series: Array<{
      metric: string;
      attributes: any;
      display_name: string;
      unit: any;
      pointlist: Array<[number, number]>;
      expression: string;
      scope: string;
      interval: number;
      length: number;
      start: number;
      end: number;
      aggr: string;
    }>;
    from_date: number;
    to_date: number;
    group_by: string[];
    message: string;
  }> {
    const params = new URLSearchParams({
      query,
      from: String(from),
      to: String(to),
    });

    return this.makeRequest('GET', `/query?${params.toString()}`);
  }

  /**
   * Create event
   */
  async createEvent(event: DatadogEvent): Promise<{
    status: string;
    event: {
      id: number;
      title: string;
      text: string;
      date_happened: number;
      handle: string;
      priority: string;
      related_event_id: number;
      tags: string[];
      url: string;
    };
  }> {
    return this.makeRequest('POST', '/events', {
      title: event.title,
      text: event.text,
      date_happened: event.date_happened || Math.floor(Date.now() / 1000),
      priority: event.priority || 'normal',
      host: event.host,
      tags: event.tags,
      alert_type: event.alert_type,
      aggregation_key: event.aggregation_key,
      source_type_name: event.source_type_name,
      related_event_id: event.related_event_id,
    });
  }

  /**
   * Get events
   */
  async getEvents(start: number, end: number, options?: {
    priority?: 'normal' | 'low';
    sources?: string;
    tags?: string;
    unaggregated?: boolean;
  }): Promise<{
    events: Array<{
      id: number;
      title: string;
      text: string;
      date_happened: number;
      priority: string;
      tags: string[];
      alert_type: string;
    }>;
  }> {
    const params = new URLSearchParams({
      start: String(start),
      end: String(end),
    });

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    return this.makeRequest('GET', `/events?${params.toString()}`);
  }

  /**
   * Submit logs
   */
  async submitLogs(logs: DatadogLog[]): Promise<{ status: string }> {
    const logEntries = logs.map(log => ({
      message: log.message,
      timestamp: log.timestamp || Date.now(),
      level: log.level || 'info',
      service: log.service,
      source: log.source || 'privacy-guard',
      host: log.host,
      tags: log.tags,
      attributes: log.attributes,
    }));

    return this.makeRequest('POST', '/logs', logEntries, true);
  }

  /**
   * Submit service check
   */
  async submitServiceCheck(check: DatadogServiceCheck): Promise<{ status: string }> {
    return this.makeRequest('POST', '/check_run', {
      check: check.check,
      host_name: check.host_name,
      status: check.status,
      timestamp: check.timestamp || Math.floor(Date.now() / 1000),
      message: check.message,
      tags: check.tags,
    });
  }

  /**
   * Create monitor/alert
   */
  async createMonitor(monitor: {
    type: 'metric alert' | 'service check' | 'event alert' | 'process alert' | 'log alert';
    query: string;
    name: string;
    message: string;
    tags?: string[];
    options?: {
      thresholds?: {
        critical?: number;
        warning?: number;
        ok?: number;
        critical_recovery?: number;
        warning_recovery?: number;
      };
      notify_audit?: boolean;
      require_full_window?: boolean;
      notify_no_data?: boolean;
      renotify_interval?: number;
      timeout_h?: number;
      evaluation_delay?: number;
      new_host_delay?: number;
      include_tags?: boolean;
    };
  }): Promise<DatadogAlert> {
    return this.makeRequest('POST', '/monitor', monitor);
  }

  /**
   * Get monitor
   */
  async getMonitor(monitorId: number): Promise<DatadogAlert> {
    return this.makeRequest('GET', `/monitor/${monitorId}`);
  }

  /**
   * List monitors
   */
  async listMonitors(options?: {
    group_states?: string[];
    name?: string;
    tags?: string[];
    monitor_tags?: string[];
    with_downtimes?: boolean;
  }): Promise<DatadogAlert[]> {
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

    const endpoint = params.toString() ? `/monitor?${params.toString()}` : '/monitor';
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Update monitor
   */
  async updateMonitor(monitorId: number, updates: Partial<{
    type: string;
    query: string;
    name: string;
    message: string;
    tags: string[];
    options: any;
  }>): Promise<DatadogAlert> {
    return this.makeRequest('PUT', `/monitor/${monitorId}`, updates);
  }

  /**
   * Delete monitor
   */
  async deleteMonitor(monitorId: number): Promise<{ deleted_monitor_id: number }> {
    return this.makeRequest('DELETE', `/monitor/${monitorId}`);
  }

  /**
   * Create dashboard
   */
  async createDashboard(dashboard: {
    title: string;
    description: string;
    layout_type: 'ordered' | 'free';
    widgets: any[];
    template_variables?: Array<{
      name: string;
      default: string;
      prefix?: string;
      available_values?: string[];
    }>;
    notify_list?: string[];
    is_read_only?: boolean;
  }): Promise<DatadogDashboard> {
    return this.makeRequest('POST', '/dashboard', dashboard);
  }

  /**
   * Get dashboard
   */
  async getDashboard(dashboardId: string): Promise<DatadogDashboard> {
    return this.makeRequest('GET', `/dashboard/${dashboardId}`);
  }

  /**
   * List dashboards
   */
  async listDashboards(): Promise<{ dashboards: Array<{ id: string; title: string; url: string; }> }> {
    return this.makeRequest('GET', '/dashboard');
  }

  /**
   * Setup PrivacyGuard monitoring
   */
  async setupPrivacyGuardMonitoring(): Promise<{
    dashboard_id: string;
    monitors_created: number;
    metrics_configured: string[];
  }> {
    // Create compliance dashboard
    const dashboard = await this.createDashboard({
      title: 'PrivacyGuard Compliance Monitoring',
      description: 'Real-time monitoring of GDPR compliance metrics and system health',
      layout_type: 'ordered',
      widgets: [
        {
          definition: {
            type: 'timeseries',
            requests: [
              {
                q: 'avg:privacy_guard.dsar.response_time{*}',
                display_type: 'line',
                style: {
                  palette: 'dog_classic',
                  line_type: 'solid',
                  line_width: 'normal'
                }
              }
            ],
            title: 'DSAR Response Time',
            show_legend: false,
            legend_size: '0'
          }
        },
        {
          definition: {
            type: 'query_value',
            requests: [
              {
                q: 'sum:privacy_guard.breach.incidents{*}',
                aggregator: 'sum'
              }
            ],
            title: 'Data Breach Incidents (24h)',
            precision: 0
          }
        },
        {
          definition: {
            type: 'toplist',
            requests: [
              {
                q: 'top(avg:privacy_guard.compliance.score{*} by {organization}, 10, \'mean\', \'desc\')'
              }
            ],
            title: 'Top Organizations by Compliance Score'
          }
        }
      ],
      template_variables: [
        {
          name: 'organization',
          default: '*',
          prefix: 'organization'
        }
      ]
    });

    // Create critical monitors
    const monitors = [
      {
        type: 'metric alert' as const,
        query: 'avg(last_5m):avg:privacy_guard.dsar.response_time{*} > 72',
        name: 'DSAR Response Time SLA Breach',
        message: 'DSAR response time has exceeded 72 hours. Immediate action required to maintain GDPR compliance. @slack-compliance-alerts',
        options: {
          thresholds: {
            critical: 72,
            warning: 48
          },
          notify_audit: true,
          require_full_window: true,
          notify_no_data: false,
          renotify_interval: 60,
          include_tags: true
        },
        tags: ['service:privacy-guard', 'severity:critical', 'compliance:gdpr']
      },
      {
        type: 'metric alert' as const,
        query: 'sum(last_1h):sum:privacy_guard.breach.incidents{*} > 0',
        name: 'Data Breach Detected',
        message: 'A data breach incident has been detected. Immediate incident response required. @slack-security-alerts @pagerduty',
        options: {
          thresholds: {
            critical: 0
          },
          notify_audit: true,
          require_full_window: false,
          notify_no_data: false,
          include_tags: true
        },
        tags: ['service:privacy-guard', 'severity:critical', 'security:breach']
      },
      {
        type: 'metric alert' as const,
        query: 'avg(last_1d):avg:privacy_guard.compliance.score{*} < 70',
        name: 'Low Compliance Score',
        message: 'Organization compliance score has dropped below 70%. Review and remediation required. @slack-compliance-alerts',
        options: {
          thresholds: {
            critical: 70,
            warning: 80
          },
          notify_audit: true,
          require_full_window: true,
          notify_no_data: true,
          include_tags: true
        },
        tags: ['service:privacy-guard', 'severity:warning', 'compliance:score']
      }
    ];

    let monitorsCreated = 0;
    for (const monitor of monitors) {
      try {
        await this.createMonitor(monitor);
        monitorsCreated++;
      } catch (error) {
        console.error('Failed to create monitor:', monitor.name, error);
      }
    }

    // Setup basic metrics
    const metricsConfigured = [
      'privacy_guard.dsar.received',
      'privacy_guard.dsar.completed',
      'privacy_guard.dsar.response_time',
      'privacy_guard.breach.incidents',
      'privacy_guard.compliance.score',
      'privacy_guard.ai.requests',
      'privacy_guard.ai.confidence_score',
      'privacy_guard.users.active',
      'privacy_guard.organizations.count'
    ];

    return {
      dashboard_id: dashboard.id,
      monitors_created: monitorsCreated,
      metrics_configured: metricsConfigured
    };
  }

  /**
   * Track compliance metrics for PrivacyGuard
   */
  async trackComplianceMetrics(data: {
    organization_id: string;
    metrics: {
      dsar_count?: number;
      dsar_response_time?: number;
      compliance_score?: number;
      active_breaches?: number;
      dpias_completed?: number;
      ai_requests?: number;
      ai_confidence?: number;
    };
    timestamp?: number;
  }): Promise<{ metrics_submitted: number }> {
    const timestamp = data.timestamp || Math.floor(Date.now() / 1000);
    const tags = [`organization:${data.organization_id}`];
    
    const metrics: DatadogMetric[] = [];

    Object.entries(data.metrics).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        metrics.push({
          metric: `privacy_guard.${key}`,
          points: [[timestamp, value]],
          type: key.includes('count') || key.includes('requests') ? 'count' : 'gauge',
          tags: tags
        });
      }
    });

    if (metrics.length > 0) {
      await this.submitMetrics(metrics);
    }

    return { metrics_submitted: metrics.length };
  }

  /**
   * Log compliance event
   */
  async logComplianceEvent(data: {
    organization_id: string;
    event_type: 'dsar_received' | 'dsar_completed' | 'breach_detected' | 'policy_updated' | 'training_completed';
    severity: 'info' | 'warning' | 'error';
    description: string;
    user_id?: string;
    metadata?: Record<string, any>;
  }): Promise<{ event_id: number }> {
    const event = await this.createEvent({
      title: `Compliance Event: ${data.event_type}`,
      text: data.description,
      alert_type: data.severity === 'error' ? 'error' : data.severity === 'warning' ? 'warning' : 'info',
      tags: [
        `organization:${data.organization_id}`,
        `event_type:${data.event_type}`,
        `severity:${data.severity}`,
        ...(data.user_id ? [`user:${data.user_id}`] : [])
      ],
      source_type_name: 'privacy-guard'
    });

    // Also submit as log
    await this.submitLogs([{
      message: `${data.event_type}: ${data.description}`,
      level: data.severity === 'error' ? 'error' : data.severity === 'warning' ? 'warn' : 'info',
      service: 'privacy-guard',
      source: 'compliance',
      tags: [
        `organization:${data.organization_id}`,
        `event_type:${data.event_type}`
      ],
      attributes: {
        organization_id: data.organization_id,
        event_type: data.event_type,
        user_id: data.user_id,
        ...data.metadata
      }
    }]);

    return { event_id: event.event.id };
  }

  /**
   * Check system health
   */
  async checkSystemHealth(components: Array<{
    name: string;
    endpoint?: string;
    expected_response_time?: number;
  }>): Promise<{
    overall_status: 'healthy' | 'degraded' | 'unhealthy';
    components: Array<{
      name: string;
      status: 'ok' | 'warning' | 'critical';
      response_time?: number;
      message?: string;
    }>;
  }> {
    const results = [];
    let healthyCount = 0;

    for (const component of components) {
      let status: 'ok' | 'warning' | 'critical' = 'ok';
      let responseTime: number | undefined;
      let message: string | undefined;

      if (component.endpoint) {
        try {
          const startTime = Date.now();
          const response = await fetch(component.endpoint, { method: 'HEAD' });
          responseTime = Date.now() - startTime;

          if (!response.ok) {
            status = 'critical';
            message = `HTTP ${response.status}`;
          } else if (component.expected_response_time && responseTime > component.expected_response_time) {
            status = 'warning';
            message = `Slow response: ${responseTime}ms`;
          } else {
            healthyCount++;
          }
        } catch (error) {
          status = 'critical';
          message = error instanceof Error ? error.message : 'Connection failed';
        }
      } else {
        healthyCount++;
      }

      results.push({
        name: component.name,
        status,
        response_time: responseTime,
        message
      });

      // Submit service check
      await this.submitServiceCheck({
        check: `privacy_guard.${component.name.toLowerCase().replace(/\s+/g, '_')}`,
        host_name: 'privacy-guard-platform',
        status: status === 'ok' ? 0 : status === 'warning' ? 1 : 2,
        message,
        tags: [`component:${component.name}`]
      });
    }

    const healthPercentage = healthyCount / components.length;
    const overallStatus = healthPercentage >= 0.8 ? 'healthy' : healthPercentage >= 0.5 ? 'degraded' : 'unhealthy';

    return {
      overall_status: overallStatus,
      components: results
    };
  }
}
