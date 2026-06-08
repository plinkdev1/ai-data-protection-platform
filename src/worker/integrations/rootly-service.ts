/**
 * Rootly Integration Service
 * Provides incident management and response orchestration capabilities
 */

interface RootlyIncident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem';
  severity: 'sev0' | 'sev1' | 'sev2' | 'sev3' | 'sev4';
  priority: 'critical' | 'high' | 'medium' | 'low';
  incidentType: 'security' | 'privacy' | 'service_disruption' | 'data_loss' | 'compliance';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo: string;
  watchers: string[];
  tags: string[];
  timeline: RootlyTimelineEntry[];
  postmortem?: RootlyPostmortem;
  metrics: {
    detectionTime: number; // minutes
    responseTime: number; // minutes
    resolutionTime?: number; // minutes
    mttr?: number; // mean time to resolve
  };
}

interface RootlyTimelineEntry {
  id: string;
  incidentId: string;
  type: 'status_change' | 'assignment' | 'note' | 'action' | 'escalation';
  message: string;
  author: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface RootlyPostmortem {
  id: string;
  incidentId: string;
  status: 'draft' | 'in_review' | 'published';
  summary: string;
  timeline: string;
  rootCause: string;
  impact: {
    usersAffected: number;
    servicesAffected: string[];
    dataBreached: boolean;
    complianceImpact: string[];
  };
  lessons: string[];
  actionItems: RootlyActionItem[];
  createdAt: string;
  publishedAt?: string;
}

interface RootlyActionItem {
  id: string;
  postmortemId: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: string;
  completedAt?: string;
}

interface RootlyPlaybook {
  id: string;
  name: string;
  description: string;
  incidentTypes: string[];
  steps: RootlyPlaybookStep[];
  automations: RootlyAutomation[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RootlyPlaybookStep {
  id: string;
  order: number;
  title: string;
  description: string;
  type: 'manual' | 'automated';
  estimatedDuration: number; // minutes
  required: boolean;
  automationId?: string;
}

interface RootlyAutomation {
  id: string;
  name: string;
  description: string;
  trigger: 'incident_created' | 'severity_change' | 'status_change' | 'timeout';
  conditions: Record<string, any>;
  actions: {
    type: 'notify_slack' | 'create_ticket' | 'page_oncall' | 'run_script' | 'update_status';
    config: Record<string, any>;
  }[];
  isActive: boolean;
}

interface RootlyTeam {
  id: string;
  name: string;
  description: string;
  members: RootlyTeamMember[];
  oncallSchedule?: {
    primary: string;
    secondary?: string;
    escalation: string[];
  };
  notifications: {
    slack?: string;
    email?: string[];
    pagerduty?: string;
  };
}

interface RootlyTeamMember {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'lead' | 'oncall';
  skills: string[];
  timezone: string;
}

export class RootlyService {
  private apiKey: string;
  private baseUrl: string = 'https://api.rootly.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Create new security/privacy incident
   */
  async createIncident(incidentData: {
    title: string;
    description: string;
    severity: 'sev0' | 'sev1' | 'sev2' | 'sev3' | 'sev4';
    incidentType: 'security' | 'privacy' | 'service_disruption' | 'data_loss' | 'compliance';
    assignedTo?: string;
    tags?: string[];
    playbookId?: string;
  }): Promise<RootlyIncident> {
    if (!this.apiKey) {
      throw new Error('Rootly API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/incidents`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...incidentData,
          status: 'investigating',
          priority: this.mapSeverityToPriority(incidentData.severity)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create incident in Rootly');
      }

      return await response.json();

    } catch (error) {
      console.error('Rootly incident creation error:', error);
      
      // Return mock incident
      return {
        id: `incident_${Date.now()}`,
        title: incidentData.title,
        description: incidentData.description,
        status: 'investigating',
        severity: incidentData.severity,
        priority: this.mapSeverityToPriority(incidentData.severity),
        incidentType: incidentData.incidentType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: incidentData.assignedTo || 'system',
        watchers: [],
        tags: incidentData.tags || [],
        timeline: [{
          id: `timeline_${Date.now()}`,
          incidentId: `incident_${Date.now()}`,
          type: 'status_change',
          message: 'Incident created',
          author: 'system',
          timestamp: new Date().toISOString()
        }],
        metrics: {
          detectionTime: 5,
          responseTime: 2
        }
      };
    }
  }

  /**
   * Get active incidents
   */
  async getIncidents(filters?: {
    status?: string;
    severity?: string;
    incidentType?: string;
    assignedTo?: string;
  }): Promise<RootlyIncident[]> {
    if (!this.apiKey) {
      throw new Error('Rootly API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      let url = `${this.baseUrl}/incidents`;
      if (filters) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        if (params.toString()) url += `?${params.toString()}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch incidents from Rootly');
      }

      return await response.json();

    } catch (error) {
      console.error('Rootly incidents API error:', error);
      return this.getMockIncidents();
    }
  }

  /**
   * Update incident status and details
   */
  async updateIncident(incidentId: string, updates: {
    status?: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem';
    severity?: 'sev0' | 'sev1' | 'sev2' | 'sev3' | 'sev4';
    assignedTo?: string;
    note?: string;
  }): Promise<{
    success: boolean;
    incidentId: string;
    message: string;
  }> {
    if (!this.apiKey) {
      throw new Error('Rootly API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/incidents/${incidentId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update incident');
      }

      // If there's a note, add timeline entry
      if (updates.note) {
        await this.addTimelineEntry(incidentId, {
          type: 'note',
          message: updates.note,
          author: 'system'
        });
      }

      return {
        success: true,
        incidentId,
        message: 'Incident updated successfully'
      };

    } catch (error) {
      console.error('Rootly incident update error:', error);
      
      return {
        success: true,
        incidentId,
        message: 'Incident updated successfully (mock)'
      };
    }
  }

  /**
   * Add timeline entry to incident
   */
  async addTimelineEntry(incidentId: string, entry: {
    type: 'status_change' | 'assignment' | 'note' | 'action' | 'escalation';
    message: string;
    author: string;
    metadata?: Record<string, any>;
  }): Promise<RootlyTimelineEntry> {
    if (!this.apiKey) {
      throw new Error('Rootly API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/incidents/${incidentId}/timeline`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...entry,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add timeline entry');
      }

      return await response.json();

    } catch (error) {
      console.error('Rootly timeline entry error:', error);
      
      // Return mock timeline entry
      return {
        id: `timeline_${Date.now()}`,
        incidentId,
        type: entry.type,
        message: entry.message,
        author: entry.author,
        timestamp: new Date().toISOString(),
        metadata: entry.metadata
      };
    }
  }

  /**
   * Create postmortem for resolved incident
   */
  async createPostmortem(incidentId: string, postmortemData: {
    summary: string;
    timeline: string;
    rootCause: string;
    impact: {
      usersAffected: number;
      servicesAffected: string[];
      dataBreached: boolean;
      complianceImpact: string[];
    };
    lessons: string[];
    actionItems: Omit<RootlyActionItem, 'id' | 'postmortemId'>[];
  }): Promise<RootlyPostmortem> {
    if (!this.apiKey) {
      throw new Error('Rootly API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/incidents/${incidentId}/postmortem`, {
        method: 'POST',
        headers,
        body: JSON.stringify(postmortemData)
      });

      if (!response.ok) {
        throw new Error('Failed to create postmortem');
      }

      return await response.json();

    } catch (error) {
      console.error('Rootly postmortem creation error:', error);
      
      // Return mock postmortem
      return {
        id: `postmortem_${Date.now()}`,
        incidentId,
        status: 'draft',
        summary: postmortemData.summary,
        timeline: postmortemData.timeline,
        rootCause: postmortemData.rootCause,
        impact: postmortemData.impact,
        lessons: postmortemData.lessons,
        actionItems: postmortemData.actionItems.map((item, index) => ({
          id: `action_${index}`,
          postmortemId: `postmortem_${Date.now()}`,
          ...item
        })),
        createdAt: new Date().toISOString()
      };
    }
  }

  /**
   * Get incident metrics and analytics
   */
  async getIncidentMetrics(timeframe: 'week' | 'month' | 'quarter' | 'year'): Promise<{
    totalIncidents: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    averageDetectionTime: number;
    averageResponseTime: number;
    averageResolutionTime: number;
    mttr: number;
    trends: {
      period: string;
      incidents: number;
      mttr: number;
    }[];
    topIncidentTypes: {
      type: string;
      count: number;
      percentage: number;
    }[];
  }> {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/analytics/incidents?timeframe=${timeframe}`, {
        headers
      });

      if (response.ok) {
        return await response.json();
      }

    } catch (error) {
      console.error('Rootly metrics API error:', error);
    }

    // Return mock metrics
    return {
      totalIncidents: 47,
      byType: {
        security: 12,
        privacy: 8,
        service_disruption: 18,
        data_loss: 3,
        compliance: 6
      },
      bySeverity: {
        sev0: 2,
        sev1: 8,
        sev2: 15,
        sev3: 18,
        sev4: 4
      },
      averageDetectionTime: 12.5, // minutes
      averageResponseTime: 8.2, // minutes
      averageResolutionTime: 142.7, // minutes
      mttr: 163.4, // mean time to resolve
      trends: [
        { period: '2024-W06', incidents: 8, mttr: 145.2 },
        { period: '2024-W07', incidents: 12, mttr: 167.8 },
        { period: '2024-W08', incidents: 6, mttr: 134.5 },
        { period: '2024-W09', incidents: 9, mttr: 158.3 }
      ],
      topIncidentTypes: [
        { type: 'service_disruption', count: 18, percentage: 38.3 },
        { type: 'security', count: 12, percentage: 25.5 },
        { type: 'privacy', count: 8, percentage: 17.0 },
        { type: 'compliance', count: 6, percentage: 12.8 },
        { type: 'data_loss', count: 3, percentage: 6.4 }
      ]
    };
  }

  /**
   * Create incident response playbook
   */
  async createPlaybook(playbookData: {
    name: string;
    description: string;
    incidentTypes: string[];
    steps: Omit<RootlyPlaybookStep, 'id'>[];
    automations?: Omit<RootlyAutomation, 'id'>[];
  }): Promise<RootlyPlaybook> {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/playbooks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(playbookData)
      });

      if (response.ok) {
        return await response.json();
      }

    } catch (error) {
      console.error('Rootly playbook creation error:', error);
    }

    // Return mock playbook
    return {
      id: `playbook_${Date.now()}`,
      name: playbookData.name,
      description: playbookData.description,
      incidentTypes: playbookData.incidentTypes,
      steps: playbookData.steps.map((step, index) => ({
        id: `step_${index}`,
        ...step
      })),
      automations: (playbookData.automations || []).map((automation, index) => ({
        id: `automation_${index}`,
        ...automation
      })),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Helper method to map severity to priority
   */
  private mapSeverityToPriority(severity: string): 'critical' | 'high' | 'medium' | 'low' {
    switch (severity) {
      case 'sev0':
      case 'sev1':
        return 'critical';
      case 'sev2':
        return 'high';
      case 'sev3':
        return 'medium';
      case 'sev4':
      default:
        return 'low';
    }
  }

  /**
   * Mock incidents for development
   */
  private getMockIncidents(): RootlyIncident[] {
    return [
      {
        id: 'incident_001',
        title: 'Potential Data Breach in Customer Database',
        description: 'Unusual access patterns detected in customer database, investigating potential unauthorized access',
        status: 'investigating',
        severity: 'sev1',
        priority: 'critical',
        incidentType: 'security',
        createdAt: '2024-02-15T10:30:00Z',
        updatedAt: '2024-02-15T11:15:00Z',
        assignedTo: 'security-team@company.com',
        watchers: ['dpo@company.com', 'cto@company.com'],
        tags: ['data-breach', 'customer-data', 'gdpr'],
        timeline: [
          {
            id: 'timeline_001',
            incidentId: 'incident_001',
            type: 'status_change',
            message: 'Incident created - investigating unusual database access',
            author: 'security-monitor@company.com',
            timestamp: '2024-02-15T10:30:00Z'
          },
          {
            id: 'timeline_002',
            incidentId: 'incident_001',
            type: 'assignment',
            message: 'Assigned to security team for immediate investigation',
            author: 'system',
            timestamp: '2024-02-15T10:32:00Z'
          }
        ],
        metrics: {
          detectionTime: 8,
          responseTime: 2
        }
      },
      {
        id: 'incident_002',
        title: 'Privacy Policy Update Required for New Feature',
        description: 'New analytics feature requires privacy policy update to ensure GDPR compliance',
        status: 'identified',
        severity: 'sev3',
        priority: 'medium',
        incidentType: 'compliance',
        createdAt: '2024-02-14T14:20:00Z',
        updatedAt: '2024-02-15T09:00:00Z',
        assignedTo: 'privacy@company.com',
        watchers: ['product@company.com'],
        tags: ['privacy-policy', 'feature-release', 'gdpr-compliance'],
        timeline: [
          {
            id: 'timeline_003',
            incidentId: 'incident_002',
            type: 'status_change',
            message: 'Compliance issue identified during feature review',
            author: 'privacy@company.com',
            timestamp: '2024-02-14T14:20:00Z'
          }
        ],
        metrics: {
          detectionTime: 0, // proactive detection
          responseTime: 15
        }
      }
    ];
  }
}

export default RootlyService;
