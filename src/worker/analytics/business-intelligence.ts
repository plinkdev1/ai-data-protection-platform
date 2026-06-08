export interface AnalyticsEnv {
  POWER_BI_API_KEY: string;
  TABLEAU_API_KEY: string;
  LOOKER_API_KEY: string;
  AWS_CLOUDWATCH_ACCESS_KEY: string;
  GOOGLE_CLOUD_VISION_API_KEY: string;
}

export interface ComplianceMetrics {
  totalOrganizations: number;
  activeDPIAs: number;
  pendingDataRequests: number;
  openIncidents: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  trendsMonth: {
    dpiaCreated: number;
    breachesDetected: number;
    requestsProcessed: number;
  };
}

export interface DashboardConfig {
  id: string;
  name: string;
  type: 'executive' | 'operational' | 'technical';
  widgets: Array<{
    type: 'chart' | 'metric' | 'table' | 'map';
    title: string;
    dataSource: string;
    config: Record<string, any>;
  }>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: 'compliance' | 'audit' | 'risk' | 'performance';
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  format: 'pdf' | 'excel' | 'html';
}

export class BusinessIntelligence {
  constructor(private env: AnalyticsEnv) {}

  // Power BI integration for executive dashboards
  async createPowerBIDashboard(config: DashboardConfig): Promise<string> {
    try {
      const response = await fetch('https://api.powerbi.com/v1.0/myorg/dashboards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.POWER_BI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.name,
          embedUrl: 'https://app.privacyguard.com/powerbi-embed',
          tiles: config.widgets.map((widget, index) => ({
            id: `tile_${index}`,
            title: widget.title,
            datasetId: this.getDatasetId(widget.dataSource),
            reportId: this.getReportId(widget.type),
          })),
        }),
      });

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Power BI dashboard creation failed:', error);
      throw error;
    }
  }

  async publishPowerBIReport(reportData: {
    name: string;
    dataSource: string;
    visualizations: Array<{
      type: 'bar' | 'line' | 'pie' | 'table' | 'card';
      title: string;
      data: any[];
    }>;
  }): Promise<string> {
    try {
      // First, upload the dataset
      const datasetResponse = await fetch('https://api.powerbi.com/v1.0/myorg/datasets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.POWER_BI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${reportData.name}_dataset`,
          tables: [{
            name: 'ComplianceData',
            columns: this.inferColumnSchema(reportData.visualizations[0]?.data || []),
          }],
        }),
      });

      const dataset = await datasetResponse.json();

      // Then create the report
      const reportResponse = await fetch('https://api.powerbi.com/v1.0/myorg/reports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.POWER_BI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: reportData.name,
          datasetId: dataset.id,
          pages: [{
            name: 'Main',
            visualizations: reportData.visualizations,
          }],
        }),
      });

      const report = await reportResponse.json();
      return report.id;
    } catch (error) {
      console.error('Power BI report creation failed:', error);
      throw error;
    }
  }

  private inferColumnSchema(data: any[]): Array<{ name: string; dataType: string }> {
    if (!data || data.length === 0) return [];
    
    const sample = data[0];
    return Object.keys(sample).map(key => ({
      name: key,
      dataType: typeof sample[key] === 'number' ? 'Int64' : 'String',
    }));
  }

  private getDatasetId(dataSource: string): string {
    const datasetMap: Record<string, string> = {
      'compliance': 'compliance_dataset_id',
      'incidents': 'incidents_dataset_id',
      'organizations': 'organizations_dataset_id',
    };
    return datasetMap[dataSource] || 'default_dataset_id';
  }

  private getReportId(type: string): string {
    const reportMap: Record<string, string> = {
      'chart': 'chart_report_id',
      'metric': 'metric_report_id',
      'table': 'table_report_id',
    };
    return reportMap[type] || 'default_report_id';
  }

  // Tableau integration for advanced analytics
  async createTableauWorkbook(workbook: {
    name: string;
    projectId: string;
    datasources: Array<{
      name: string;
      connectionType: 'postgresql' | 'mongodb';
      query: string;
    }>;
    sheets: Array<{
      name: string;
      chartType: 'bar' | 'line' | 'scatter' | 'heatmap';
      fields: string[];
    }>;
  }): Promise<string> {
    try {
      // Create datasources first
      const datasourceIds = [];
      for (const ds of workbook.datasources) {
        const dsResponse = await fetch(`https://api.tableau.com/api/3.0/sites/default/datasources`, {
          method: 'POST',
          headers: {
            'X-Tableau-Auth': this.env.TABLEAU_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            datasource: {
              name: ds.name,
              connectionCredentials: {
                connectionType: ds.connectionType,
                serverAddress: process.env.DATABASE_HOST,
                serverPort: '5432',
              },
            },
          }),
        });
        
        const dsData = await dsResponse.json();
        datasourceIds.push(dsData.datasource?.id);
      }

      // Create the workbook
      const response = await fetch(`https://api.tableau.com/api/3.0/sites/default/workbooks`, {
        method: 'POST',
        headers: {
          'X-Tableau-Auth': this.env.TABLEAU_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workbook: {
            name: workbook.name,
            projectId: workbook.projectId,
            sheets: workbook.sheets,
            datasources: datasourceIds,
          },
        }),
      });

      const data = await response.json();
      return data.workbook?.id;
    } catch (error) {
      console.error('Tableau workbook creation failed:', error);
      throw error;
    }
  }

  async publishTableauDashboard(dashboard: {
    name: string;
    workbookId: string;
    layout: Array<{
      sheetId: string;
      position: { x: number; y: number; width: number; height: number };
    }>;
  }): Promise<string> {
    try {
      const response = await fetch(`https://api.tableau.com/api/3.0/sites/default/dashboards`, {
        method: 'POST',
        headers: {
          'X-Tableau-Auth': this.env.TABLEAU_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dashboard: {
            name: dashboard.name,
            workbookId: dashboard.workbookId,
            layout: dashboard.layout,
          },
        }),
      });

      const data = await response.json();
      return data.dashboard?.id;
    } catch (error) {
      console.error('Tableau dashboard creation failed:', error);
      throw error;
    }
  }

  // Looker integration for data exploration
  async createLookerDashboard(dashboard: {
    title: string;
    description: string;
    folderId: string;
    elements: Array<{
      type: 'looker_line' | 'looker_bar' | 'looker_pie' | 'single_value';
      title: string;
      query: {
        model: string;
        explore: string;
        dimensions: string[];
        measures: string[];
        filters?: Record<string, string>;
      };
    }>;
  }): Promise<string> {
    try {
      const response = await fetch('https://api.looker.com/api/4.0/dashboards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.LOOKER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: dashboard.title,
          description: dashboard.description,
          folder_id: dashboard.folderId,
          dashboard_elements: dashboard.elements.map((element, index) => ({
            id: `element_${index}`,
            type: element.type,
            title: element.title,
            query: element.query,
          })),
        }),
      });

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Looker dashboard creation failed:', error);
      throw error;
    }
  }

  async runLookerQuery(query: {
    model: string;
    explore: string;
    dimensions: string[];
    measures: string[];
    filters?: Record<string, string>;
    limit?: number;
  }): Promise<any[]> {
    try {
      const response = await fetch('https://api.looker.com/api/4.0/queries/run/json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.LOOKER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      return await response.json();
    } catch (error) {
      console.error('Looker query failed:', error);
      return [];
    }
  }

  // Google Cloud Vision for document analysis
  async analyzeDocument(imageData: string): Promise<{
    text: string;
    entities: Array<{
      type: 'person' | 'organization' | 'date' | 'email' | 'phone';
      value: string;
      confidence: number;
    }>;
    sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  }> {
    try {
      const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.GOOGLE_CLOUD_VISION_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: imageData,
            },
            features: [
              { type: 'TEXT_DETECTION' },
              { type: 'DOCUMENT_TEXT_DETECTION' },
            ],
          }],
        }),
      });

      const data = await response.json();
      const textAnnotations = data.responses[0]?.textAnnotations || [];
      const extractedText = textAnnotations[0]?.description || '';

      return {
        text: extractedText,
        entities: this.extractEntities(extractedText),
        sensitivity: this.assessDataSensitivity(extractedText),
      };
    } catch (error) {
      console.error('Google Cloud Vision analysis failed:', error);
      return {
        text: '',
        entities: [],
        sensitivity: 'public',
      };
    }
  }

  private extractEntities(text: string): Array<{
    type: 'person' | 'organization' | 'date' | 'email' | 'phone';
    value: string;
    confidence: number;
  }> {
    const entities = [];
    
    // Email pattern
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailRegex) || [];
    emails.forEach(email => {
      entities.push({ type: 'email', value: email, confidence: 0.95 });
    });

    // Phone pattern
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const phones = text.match(phoneRegex) || [];
    phones.forEach(phone => {
      entities.push({ type: 'phone', value: phone, confidence: 0.9 });
    });

    // Date pattern
    const dateRegex = /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g;
    const dates = text.match(dateRegex) || [];
    dates.forEach(date => {
      entities.push({ type: 'date', value: date, confidence: 0.85 });
    });

    return entities;
  }

  private assessDataSensitivity(text: string): 'public' | 'internal' | 'confidential' | 'restricted' {
    const sensitiveKeywords = {
      restricted: ['ssn', 'social security', 'passport', 'driver license', 'credit card'],
      confidential: ['personal data', 'medical', 'financial', 'salary', 'confidential'],
      internal: ['internal', 'employee', 'staff', 'organization'],
    };

    const lowerText = text.toLowerCase();
    
    if (sensitiveKeywords.restricted.some(keyword => lowerText.includes(keyword))) {
      return 'restricted';
    }
    if (sensitiveKeywords.confidential.some(keyword => lowerText.includes(keyword))) {
      return 'confidential';
    }
    if (sensitiveKeywords.internal.some(keyword => lowerText.includes(keyword))) {
      return 'internal';
    }
    
    return 'public';
  }

  // Generate compliance metrics for dashboards
  async generateComplianceMetrics(organizationId?: string): Promise<ComplianceMetrics> {
    try {
      // This would query your actual database
      const baseQuery = organizationId 
        ? `WHERE organization_id = '${organizationId}'`
        : '';

      const metrics = {
        totalOrganizations: await this.queryMetric(`SELECT COUNT(*) FROM organizations ${baseQuery}`),
        activeDPIAs: await this.queryMetric(`SELECT COUNT(*) FROM dpias WHERE status = 'active' ${baseQuery}`),
        pendingDataRequests: await this.queryMetric(`SELECT COUNT(*) FROM data_subject_requests WHERE status = 'pending' ${baseQuery}`),
        openIncidents: await this.queryMetric(`SELECT COUNT(*) FROM data_breaches WHERE status = 'open' ${baseQuery}`),
        complianceScore: await this.calculateComplianceScore(organizationId),
        riskLevel: await this.assessRiskLevel(organizationId),
        trendsMonth: {
          dpiaCreated: await this.queryMetric(`SELECT COUNT(*) FROM dpias WHERE created_at >= date('now', '-1 month') ${baseQuery}`),
          breachesDetected: await this.queryMetric(`SELECT COUNT(*) FROM data_breaches WHERE created_at >= date('now', '-1 month') ${baseQuery}`),
          requestsProcessed: await this.queryMetric(`SELECT COUNT(*) FROM data_subject_requests WHERE status = 'completed' AND updated_at >= date('now', '-1 month') ${baseQuery}`),
        },
      };

      return metrics;
    } catch (error) {
      console.error('Metrics generation failed:', error);
      return this.getDefaultMetrics();
    }
  }

  private async queryMetric(query: string): Promise<number> {
    // This would use your actual database connection
    // For now, return mock data
    return Math.floor(Math.random() * 100);
  }

  private async calculateComplianceScore(organizationId?: string): Promise<number> {
    // Calculate based on completed controls, active policies, etc.
    return Math.floor(Math.random() * 40) + 60; // 60-100 range
  }

  private async assessRiskLevel(organizationId?: string): Promise<'low' | 'medium' | 'high' | 'critical'> {
    const score = await this.calculateComplianceScore(organizationId);
    if (score >= 90) return 'low';
    if (score >= 75) return 'medium';
    if (score >= 60) return 'high';
    return 'critical';
  }

  private getDefaultMetrics(): ComplianceMetrics {
    return {
      totalOrganizations: 0,
      activeDPIAs: 0,
      pendingDataRequests: 0,
      openIncidents: 0,
      complianceScore: 0,
      riskLevel: 'critical',
      trendsMonth: {
        dpiaCreated: 0,
        breachesDetected: 0,
        requestsProcessed: 0,
      },
    };
  }

  // Health check for analytics services
  async healthCheck(): Promise<{
    powerbi: boolean;
    tableau: boolean;
    looker: boolean;
    googleCloudVision: boolean;
  }> {
    const health = {
      powerbi: false,
      tableau: false,
      looker: false,
      googleCloudVision: false,
    };

    try {
      const response = await fetch('https://api.powerbi.com/v1.0/myorg/datasets', {
        headers: {
          'Authorization': `Bearer ${this.env.POWER_BI_API_KEY}`,
        },
      });
      health.powerbi = response.ok;
    } catch {
      // Power BI not available
    }

    try {
      const response = await fetch('https://api.tableau.com/api/3.0/sites', {
        headers: {
          'X-Tableau-Auth': this.env.TABLEAU_API_KEY,
        },
      });
      health.tableau = response.ok;
    } catch {
      // Tableau not available
    }

    try {
      const response = await fetch('https://api.looker.com/api/4.0/user', {
        headers: {
          'Authorization': `Bearer ${this.env.LOOKER_API_KEY}`,
        },
      });
      health.looker = response.ok;
    } catch {
      // Looker not available
    }

    try {
      const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.GOOGLE_CLOUD_VISION_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: { content: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' },
            features: [{ type: 'TEXT_DETECTION' }],
          }],
        }),
      });
      health.googleCloudVision = response.ok;
    } catch {
      // Google Cloud Vision not available
    }

    return health;
  }
}
