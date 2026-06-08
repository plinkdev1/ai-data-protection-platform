import { register, Counter, Histogram, Gauge } from 'prom-client';
import { Client } from '@elastic/elasticsearch';

export interface ObservabilityEnv {
  PROMETHEUS_API_KEY: string;
  GRAFANA_API_KEY: string;
  ELASTICSEARCH_URL: string;
  JAEGER_ENDPOINT: string;
  DATADOG_API_KEY: string;
  SPLUNK_API_KEY: string;
  PAGERDUTY_API_KEY: string;
}

export class MonitoringStack {
  private metricsRegistry = register;
  private elasticsearchClient: Client | null = null;
  
  // Prometheus metrics
  private httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
  });

  private httpRequestTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  private activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active connections',
  });

  private complianceTasksProcessed = new Counter({
    name: 'compliance_tasks_processed_total',
    help: 'Total number of compliance tasks processed',
    labelNames: ['task_type', 'status'],
  });

  private aiModelInferences = new Counter({
    name: 'ai_model_inferences_total',
    help: 'Total number of AI model inferences',
    labelNames: ['model', 'type'],
  });

  private databaseConnectionPool = new Gauge({
    name: 'database_connection_pool_size',
    help: 'Database connection pool size',
    labelNames: ['database'],
  });

  constructor(private env: ObservabilityEnv) {
    this.initializeElasticsearch();
  }

  private async initializeElasticsearch(): Promise<void> {
    try {
      this.elasticsearchClient = new Client({
        node: this.env.ELASTICSEARCH_URL,
        auth: {
          apiKey: process.env.ELASTICSEARCH_API_KEY || '',
        },
      });
      console.log('Elasticsearch initialized successfully');
    } catch (error) {
      console.error('Elasticsearch initialization failed:', error);
    }
  }

  // Metrics collection
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number): void {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration);
    
    this.httpRequestTotal
      .labels(method, route, statusCode.toString())
      .inc();
  }

  recordComplianceTask(taskType: string, status: 'success' | 'failure'): void {
    this.complianceTasksProcessed
      .labels(taskType, status)
      .inc();
  }

  recordAIInference(model: string, type: string): void {
    this.aiModelInferences
      .labels(model, type)
      .inc();
  }

  updateConnectionCount(count: number): void {
    this.activeConnections.set(count);
  }

  updateDatabasePoolSize(database: string, size: number): void {
    this.databaseConnectionPool
      .labels(database)
      .set(size);
  }

  // Get Prometheus metrics
  async getMetrics(): Promise<string> {
    return this.metricsRegistry.metrics();
  }

  // Structured logging to Elasticsearch
  async logEvent(event: {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    service: string;
    userId?: string;
    organizationId?: string;
    traceId?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    if (!this.elasticsearchClient) {
      console.log('Event Log:', event);
      return;
    }

    const logEntry = {
      ...event,
      timestamp: new Date(),
      '@timestamp': new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };

    try {
      await this.elasticsearchClient.index({
        index: `privacyguard-logs-${new Date().toISOString().slice(0, 7)}`,
        body: logEntry,
      });
    } catch (error) {
      console.error('Failed to log to Elasticsearch:', error);
      console.log('Fallback log:', logEntry);
    }
  }

  // Distributed tracing with Jaeger
  async createSpan(operationName: string, parentSpanId?: string): Promise<string> {
    const spanId = crypto.randomUUID();
    const traceId = parentSpanId ? this.getTraceId(parentSpanId) : crypto.randomUUID();
    
    const span = {
      traceID: traceId,
      spanID: spanId,
      parentSpanID: parentSpanId,
      operationName,
      startTime: Date.now() * 1000, // microseconds
      tags: [
        { key: 'service.name', value: 'privacyguard' },
        { key: 'service.version', value: '1.0.0' },
      ],
    };

    try {
      await fetch(`${this.env.JAEGER_ENDPOINT}/api/traces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spans: [span],
        }),
      });
    } catch (error) {
      console.error('Failed to send span to Jaeger:', error);
    }

    return spanId;
  }

  async finishSpan(spanId: string, tags: Record<string, any> = {}): Promise<void> {
    // Implement span finishing logic
    const additionalTags = Object.entries(tags).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    // Send span completion to Jaeger
    console.log(`Span ${spanId} completed with tags:`, additionalTags);
  }

  private getTraceId(spanId: string): string {
    // Extract trace ID from span ID or generate new one
    return spanId.split('-')[0] || crypto.randomUUID();
  }

  // Datadog integration for application metrics
  async sendToDatadog(metric: {
    name: string;
    value: number;
    type: 'count' | 'gauge' | 'histogram';
    tags?: string[];
  }): Promise<void> {
    try {
      await fetch('https://api.datadoghq.com/api/v1/series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': this.env.DATADOG_API_KEY,
        },
        body: JSON.stringify({
          series: [{
            metric: `privacyguard.${metric.name}`,
            points: [[Math.floor(Date.now() / 1000), metric.value]],
            type: metric.type,
            tags: metric.tags || [],
          }],
        }),
      });
    } catch (error) {
      console.error('Failed to send metric to Datadog:', error);
    }
  }

  // Splunk integration for security monitoring
  async sendToSplunk(event: {
    sourcetype: string;
    source: string;
    event: any;
  }): Promise<void> {
    try {
      await fetch(`${process.env.SPLUNK_HEC_URL}/services/collector/event`, {
        method: 'POST',
        headers: {
          'Authorization': `Splunk ${this.env.SPLUNK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time: Math.floor(Date.now() / 1000),
          ...event,
        }),
      });
    } catch (error) {
      console.error('Failed to send event to Splunk:', error);
    }
  }

  // PagerDuty integration for incident alerting
  async createPagerDutyAlert(alert: {
    summary: string;
    severity: 'critical' | 'error' | 'warning' | 'info';
    source: string;
    component?: string;
    details?: Record<string, any>;
  }): Promise<void> {
    try {
      await fetch('https://events.pagerduty.com/v2/enqueue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routing_key: this.env.PAGERDUTY_API_KEY,
          event_action: 'trigger',
          payload: {
            summary: alert.summary,
            severity: alert.severity,
            source: alert.source,
            component: alert.component || 'privacyguard',
            custom_details: alert.details || {},
          },
        }),
      });
    } catch (error) {
      console.error('Failed to create PagerDuty alert:', error);
    }
  }

  // Grafana dashboard creation
  async createGrafanaDashboard(dashboard: {
    title: string;
    panels: Array<{
      title: string;
      type: 'graph' | 'stat' | 'table';
      query: string;
    }>;
  }): Promise<void> {
    try {
      await fetch(`${process.env.GRAFANA_URL}/api/dashboards/db`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.GRAFANA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dashboard: {
            title: dashboard.title,
            panels: dashboard.panels.map((panel, index) => ({
              id: index + 1,
              title: panel.title,
              type: panel.type,
              targets: [{
                expr: panel.query,
                refId: 'A',
              }],
            })),
          },
          overwrite: true,
        }),
      });
    } catch (error) {
      console.error('Failed to create Grafana dashboard:', error);
    }
  }

  // Health monitoring for all observability services
  async healthCheck(): Promise<{
    prometheus: boolean;
    elasticsearch: boolean;
    jaeger: boolean;
    datadog: boolean;
    splunk: boolean;
    pagerduty: boolean;
    grafana: boolean;
  }> {
    const health = {
      prometheus: true, // Always available locally
      elasticsearch: false,
      jaeger: false,
      datadog: false,
      splunk: false,
      pagerduty: false,
      grafana: false,
    };

    try {
      if (this.elasticsearchClient) {
        await this.elasticsearchClient.ping();
        health.elasticsearch = true;
      }
    } catch {
      // Elasticsearch not available
    }

    try {
      const response = await fetch(`${this.env.JAEGER_ENDPOINT}/api/traces?limit=1`);
      health.jaeger = response.ok;
    } catch {
      // Jaeger not available
    }

    try {
      const response = await fetch('https://api.datadoghq.com/api/v1/validate', {
        headers: {
          'DD-API-KEY': this.env.DATADOG_API_KEY,
        },
      });
      health.datadog = response.ok;
    } catch {
      // Datadog not available
    }

    return health;
  }

  // Cleanup resources
  async cleanup(): Promise<void> {
    try {
      if (this.elasticsearchClient) {
        await this.elasticsearchClient.close();
      }
    } catch (error) {
      console.error('Monitoring stack cleanup error:', error);
    }
  }
}
