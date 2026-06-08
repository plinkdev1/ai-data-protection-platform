/**
 * Microsoft Power BI Integration Service for Business Intelligence
 * Handles dashboards, reports, and data visualization for compliance metrics
 */

export interface PowerBIWorkspace {
  id: string;
  name: string;
  type: 'PersonalGroup' | 'Group';
  state: 'Active' | 'Deleted' | 'Removing' | 'ProvisioningAccount';
  isReadOnly: boolean;
  isOnDedicatedCapacity: boolean;
  capacityId?: string;
  defaultDatasetStorageFormat?: 'Small' | 'Large';
}

export interface PowerBIReport {
  id: string;
  reportType: 'PowerBIReport' | 'PaginatedReport' | 'Excel';
  name: string;
  webUrl: string;
  embedUrl: string;
  isFromPbix: boolean;
  isOwnedByMe: boolean;
  datasetId: string;
  datasetWorkspaceId?: string;
  users?: PowerBIUser[];
  subscriptions?: PowerBISubscription[];
  createdDateTime: string;
  modifiedDateTime: string;
  modifiedBy: string;
  createdBy: string;
}

export interface PowerBIDataset {
  id: string;
  name: string;
  addRowsAPIEnabled: boolean;
  configuredBy: string;
  isRefreshable: boolean;
  isEffectiveIdentityRequired: boolean;
  isEffectiveIdentityRolesRequired: boolean;
  isOnPremGatewayRequired: boolean;
  targetStorageMode: 'Import' | 'DirectQuery' | 'Composite';
  createdDate: string;
  createReportEmbedURL: string;
  qnaEmbedURL: string;
  upstreamDatasets: any[];
  users: PowerBIUser[];
  webUrl: string;
}

export interface PowerBIDashboard {
  id: string;
  displayName: string;
  isReadOnly: boolean;
  embedUrl: string;
  webUrl: string;
  tiles: PowerBITile[];
  users: PowerBIUser[];
  subscriptions: PowerBISubscription[];
}

export interface PowerBITile {
  id: string;
  title: string;
  embedUrl: string;
  embedData: string;
  rowSpan: number;
  colSpan: number;
  reportId?: string;
  datasetId?: string;
}

export interface PowerBIUser {
  identifier: string;
  principalType: 'User' | 'Group' | 'App';
  displayName?: string;
  emailAddress?: string;
  graphId?: string;
  userType?: 'Member' | 'Admin';
}

export interface PowerBISubscription {
  id: string;
  title: string;
  artifactId: string;
  artifactDisplayName: string;
  subArtifactDisplayName?: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  startDate: string;
  endDate?: string;
  linkToContent: boolean;
  previewImage: boolean;
  attachmentFormat: 'PDF' | 'PNG' | 'PPTX';
  users: Array<{
    emailAddress: string;
    displayName?: string;
  }>;
}

export interface PowerBIEmbedToken {
  token: string;
  tokenId: string;
  expiration: string;
}

export class PowerBIService {
  private accessToken: string;
  private apiUrl = 'https://api.powerbi.com/v1.0/myorg';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`Power BI API error: ${response.status} - ${error.error?.message || 'Request failed'}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  /**
   * Get workspaces
   */
  async getWorkspaces(): Promise<{ value: PowerBIWorkspace[] }> {
    return this.makeRequest('GET', '/groups');
  }

  /**
   * Create workspace
   */
  async createWorkspace(name: string): Promise<PowerBIWorkspace> {
    return this.makeRequest('POST', '/groups', { name });
  }

  /**
   * Get reports in workspace
   */
  async getReports(workspaceId?: string): Promise<{ value: PowerBIReport[] }> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/reports` : '/reports';
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Get specific report
   */
  async getReport(reportId: string, workspaceId?: string): Promise<PowerBIReport> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/reports/${reportId}` : `/reports/${reportId}`;
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Clone report
   */
  async cloneReport(reportId: string, data: {
    name: string;
    targetWorkspaceId?: string;
    targetModelId?: string;
  }, workspaceId?: string): Promise<PowerBIReport> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/reports/${reportId}/Clone` : `/reports/${reportId}/Clone`;
    return this.makeRequest('POST', endpoint, data);
  }

  /**
   * Export report
   */
  async exportReport(reportId: string, format: 'PDF' | 'PNG' | 'PPTX' | 'XLSX', workspaceId?: string): Promise<{
    id: string;
    createdDateTime: string;
    reportId: string;
    reportName: string;
    status: 'NotStarted' | 'Running' | 'Succeeded' | 'Failed';
    percentComplete: number;
    resourceLocation?: string;
    expirationTime: string;
  }> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/reports/${reportId}/ExportTo` : `/reports/${reportId}/ExportTo`;
    return this.makeRequest('POST', endpoint, { format });
  }

  /**
   * Get datasets
   */
  async getDatasets(workspaceId?: string): Promise<{ value: PowerBIDataset[] }> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/datasets` : '/datasets';
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Create dataset
   */
  async createDataset(dataset: {
    name: string;
    tables: Array<{
      name: string;
      columns: Array<{
        name: string;
        dataType: 'Int64' | 'Double' | 'Boolean' | 'DateTime' | 'String';
      }>;
    }>;
  }, workspaceId?: string): Promise<PowerBIDataset> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/datasets` : '/datasets';
    return this.makeRequest('POST', endpoint, dataset);
  }

  /**
   * Refresh dataset
   */
  async refreshDataset(datasetId: string, workspaceId?: string): Promise<void> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
    await this.makeRequest('POST', endpoint);
  }

  /**
   * Get dataset refresh history
   */
  async getDatasetRefreshHistory(datasetId: string, workspaceId?: string): Promise<{
    value: Array<{
      requestId: string;
      id: number;
      refreshType: 'ViaApi' | 'ViaXmla' | 'Scheduled' | 'OnDemand';
      startTime: string;
      endTime?: string;
      status: 'Unknown' | 'Completed' | 'Failed' | 'Disabled';
      serviceExceptionJson?: string;
    }>;
  }> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/datasets/${datasetId}/refreshes` : `/datasets/${datasetId}/refreshes`;
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Add rows to dataset table
   */
  async addRowsToTable(datasetId: string, tableName: string, rows: any[], workspaceId?: string): Promise<void> {
    const endpoint = workspaceId 
      ? `/groups/${workspaceId}/datasets/${datasetId}/tables/${tableName}/rows`
      : `/datasets/${datasetId}/tables/${tableName}/rows`;
    
    await this.makeRequest('POST', endpoint, { rows });
  }

  /**
   * Get dashboards
   */
  async getDashboards(workspaceId?: string): Promise<{ value: PowerBIDashboard[] }> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/dashboards` : '/dashboards';
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Get dashboard
   */
  async getDashboard(dashboardId: string, workspaceId?: string): Promise<PowerBIDashboard> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/dashboards/${dashboardId}` : `/dashboards/${dashboardId}`;
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Get dashboard tiles
   */
  async getDashboardTiles(dashboardId: string, workspaceId?: string): Promise<{ value: PowerBITile[] }> {
    const endpoint = workspaceId 
      ? `/groups/${workspaceId}/dashboards/${dashboardId}/tiles`
      : `/dashboards/${dashboardId}/tiles`;
    return this.makeRequest('GET', endpoint);
  }

  /**
   * Generate embed token for report
   */
  async generateReportEmbedToken(reportId: string, data: {
    accessLevel: 'View' | 'Edit' | 'Create';
    datasetIds?: string[];
    identities?: Array<{
      username: string;
      roles?: string[];
      datasets?: string[];
    }>;
  }, workspaceId?: string): Promise<PowerBIEmbedToken> {
    const endpoint = workspaceId 
      ? `/groups/${workspaceId}/reports/${reportId}/GenerateToken`
      : `/reports/${reportId}/GenerateToken`;
    
    return this.makeRequest('POST', endpoint, data);
  }

  /**
   * Generate embed token for dashboard
   */
  async generateDashboardEmbedToken(dashboardId: string, data: {
    accessLevel: 'View';
    identities?: Array<{
      username: string;
      roles?: string[];
      datasets?: string[];
    }>;
  }, workspaceId?: string): Promise<PowerBIEmbedToken> {
    const endpoint = workspaceId 
      ? `/groups/${workspaceId}/dashboards/${dashboardId}/GenerateToken`
      : `/dashboards/${dashboardId}/GenerateToken`;
    
    return this.makeRequest('POST', endpoint, data);
  }

  /**
   * Create subscription
   */
  async createSubscription(data: {
    artifactId: string;
    artifactType: 'Report' | 'Dashboard';
    title: string;
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    startDate: string;
    endDate?: string;
    linkToContent: boolean;
    previewImage: boolean;
    attachmentFormat: 'PDF' | 'PNG' | 'PPTX';
    users: Array<{
      emailAddress: string;
      displayName?: string;
    }>;
  }, workspaceId?: string): Promise<PowerBISubscription> {
    const endpoint = workspaceId ? `/groups/${workspaceId}/subscriptions` : '/subscriptions';
    return this.makeRequest('POST', endpoint, data);
  }

  /**
   * Setup PrivacyGuard compliance dashboard
   */
  async setupComplianceDashboard(workspaceId: string, organizationName: string): Promise<{
    workspace_id: string;
    dataset_id: string;
    dashboard_id: string;
    reports_created: string[];
  }> {
    // Create compliance dataset
    const dataset = await this.createDataset({
      name: `${organizationName} - Compliance Metrics`,
      tables: [
        {
          name: 'DSARMetrics',
          columns: [
            { name: 'Date', dataType: 'DateTime' },
            { name: 'Received', dataType: 'Int64' },
            { name: 'Completed', dataType: 'Int64' },
            { name: 'Pending', dataType: 'Int64' },
            { name: 'AverageResponseTime', dataType: 'Double' },
            { name: 'ComplianceRate', dataType: 'Double' }
          ]
        },
        {
          name: 'ComplianceScore',
          columns: [
            { name: 'Date', dataType: 'DateTime' },
            { name: 'OverallScore', dataType: 'Double' },
            { name: 'PolicyScore', dataType: 'Double' },
            { name: 'ProcessScore', dataType: 'Double' },
            { name: 'DocumentationScore', dataType: 'Double' },
            { name: 'TrainingScore', dataType: 'Double' }
          ]
        },
        {
          name: 'RiskMetrics',
          columns: [
            { name: 'Date', dataType: 'DateTime' },
            { name: 'HighRiskActivities', dataType: 'Int64' },
            { name: 'MediumRiskActivities', dataType: 'Int64' },
            { name: 'LowRiskActivities', dataType: 'Int64' },
            { name: 'ActiveDPIAs', dataType: 'Int64' },
            { name: 'CompletedDPIAs', dataType: 'Int64' }
          ]
        },
        {
          name: 'BreachIncidents',
          columns: [
            { name: 'Date', dataType: 'DateTime' },
            { name: 'IncidentType', dataType: 'String' },
            { name: 'Severity', dataType: 'String' },
            { name: 'AffectedCount', dataType: 'Int64' },
            { name: 'ResponseTime', dataType: 'Double' },
            { name: 'Status', dataType: 'String' }
          ]
        },
        {
          name: 'AIMetrics',
          columns: [
            { name: 'Date', dataType: 'DateTime' },
            { name: 'AIRequests', dataType: 'Int64' },
            { name: 'PolicyGenerated', dataType: 'Int64' },
            { name: 'RiskAssessments', dataType: 'Int64' },
            { name: 'AverageConfidence', dataType: 'Double' },
            { name: 'HumanReviewRate', dataType: 'Double' }
          ]
        }
      ]
    }, workspaceId);

    // Initial data population
    const today = new Date().toISOString();
    const sampleData = {
      DSARMetrics: [{
        Date: today,
        Received: 0,
        Completed: 0,
        Pending: 0,
        AverageResponseTime: 0,
        ComplianceRate: 100
      }],
      ComplianceScore: [{
        Date: today,
        OverallScore: 85,
        PolicyScore: 90,
        ProcessScore: 80,
        DocumentationScore: 85,
        TrainingScore: 80
      }],
      RiskMetrics: [{
        Date: today,
        HighRiskActivities: 0,
        MediumRiskActivities: 0,
        LowRiskActivities: 0,
        ActiveDPIAs: 0,
        CompletedDPIAs: 0
      }],
      AIMetrics: [{
        Date: today,
        AIRequests: 0,
        PolicyGenerated: 0,
        RiskAssessments: 0,
        AverageConfidence: 0,
        HumanReviewRate: 0
      }]
    };

    // Add initial data to tables
    for (const [tableName, rows] of Object.entries(sampleData)) {
      await this.addRowsToTable(dataset.id, tableName, rows, workspaceId);
    }

    return {
      workspace_id: workspaceId,
      dataset_id: dataset.id,
      dashboard_id: '', // Would be created after reports
      reports_created: []
    };
  }

  /**
   * Update compliance metrics
   */
  async updateComplianceMetrics(datasetId: string, data: {
    dsar_metrics?: {
      received: number;
      completed: number;
      pending: number;
      average_response_time: number;
      compliance_rate: number;
    };
    compliance_scores?: {
      overall: number;
      policy: number;
      process: number;
      documentation: number;
      training: number;
    };
    risk_metrics?: {
      high_risk: number;
      medium_risk: number;
      low_risk: number;
      active_dpias: number;
      completed_dpias: number;
    };
    ai_metrics?: {
      requests: number;
      policies_generated: number;
      risk_assessments: number;
      average_confidence: number;
      human_review_rate: number;
    };
  }, workspaceId?: string): Promise<{ tables_updated: number }> {
    let tablesUpdated = 0;
    const today = new Date().toISOString();

    if (data.dsar_metrics) {
      await this.addRowsToTable(datasetId, 'DSARMetrics', [{
        Date: today,
        Received: data.dsar_metrics.received,
        Completed: data.dsar_metrics.completed,
        Pending: data.dsar_metrics.pending,
        AverageResponseTime: data.dsar_metrics.average_response_time,
        ComplianceRate: data.dsar_metrics.compliance_rate
      }], workspaceId);
      tablesUpdated++;
    }

    if (data.compliance_scores) {
      await this.addRowsToTable(datasetId, 'ComplianceScore', [{
        Date: today,
        OverallScore: data.compliance_scores.overall,
        PolicyScore: data.compliance_scores.policy,
        ProcessScore: data.compliance_scores.process,
        DocumentationScore: data.compliance_scores.documentation,
        TrainingScore: data.compliance_scores.training
      }], workspaceId);
      tablesUpdated++;
    }

    if (data.risk_metrics) {
      await this.addRowsToTable(datasetId, 'RiskMetrics', [{
        Date: today,
        HighRiskActivities: data.risk_metrics.high_risk,
        MediumRiskActivities: data.risk_metrics.medium_risk,
        LowRiskActivities: data.risk_metrics.low_risk,
        ActiveDPIAs: data.risk_metrics.active_dpias,
        CompletedDPIAs: data.risk_metrics.completed_dpias
      }], workspaceId);
      tablesUpdated++;
    }

    if (data.ai_metrics) {
      await this.addRowsToTable(datasetId, 'AIMetrics', [{
        Date: today,
        AIRequests: data.ai_metrics.requests,
        PolicyGenerated: data.ai_metrics.policies_generated,
        RiskAssessments: data.ai_metrics.risk_assessments,
        AverageConfidence: data.ai_metrics.average_confidence,
        HumanReviewRate: data.ai_metrics.human_review_rate
      }], workspaceId);
      tablesUpdated++;
    }

    return { tables_updated: tablesUpdated };
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(reportId: string, format: 'PDF' | 'PPTX' = 'PDF', workspaceId?: string): Promise<{
    export_id: string;
    download_url?: string;
    status: string;
  }> {
    const exportJob = await this.exportReport(reportId, format, workspaceId);
    
    return {
      export_id: exportJob.id,
      download_url: exportJob.resourceLocation,
      status: exportJob.status
    };
  }
}
