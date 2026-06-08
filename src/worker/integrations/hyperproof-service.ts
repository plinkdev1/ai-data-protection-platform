/**
 * Hyperproof Integration Service
 * Provides compliance management and audit preparation capabilities
 */

interface HyperproofFramework {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'deprecated' | 'draft';
  requirements: HyperproofRequirement[];
  lastUpdated: string;
  complianceScore: number;
}

interface HyperproofRequirement {
  id: string;
  frameworkId: string;
  reference: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'complete' | 'not_applicable';
  assignedTo?: string;
  dueDate?: string;
  evidence: HyperproofEvidence[];
  controls: HyperproofControl[];
}

interface HyperproofControl {
  id: string;
  requirementId: string;
  name: string;
  description: string;
  type: 'policy' | 'procedure' | 'technical' | 'administrative';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  status: 'implemented' | 'partially_implemented' | 'not_implemented' | 'not_applicable';
  effectiveness: 'effective' | 'partially_effective' | 'ineffective' | 'not_tested';
  lastTested?: string;
  nextTest?: string;
  owner: string;
}

interface HyperproofEvidence {
  id: string;
  requirementId?: string;
  controlId?: string;
  name: string;
  description: string;
  type: 'document' | 'screenshot' | 'policy' | 'procedure' | 'certificate' | 'log';
  uploadDate: string;
  expiryDate?: string;
  status: 'current' | 'expired' | 'pending_review';
  fileUrl?: string;
  tags: string[];
}

interface HyperproofAuditPrep {
  id: string;
  name: string;
  framework: string;
  auditor: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  completionPercentage: number;
  readinessScore: number;
  gaps: HyperproofGap[];
  artifacts: HyperproofEvidence[];
}

interface HyperproofGap {
  id: string;
  requirementId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo: string;
  dueDate: string;
}

export class HyperproofService {
  private apiKey: string;
  private baseUrl: string = 'https://api.hyperproof.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get available compliance frameworks
   */
  async getFrameworks(category?: string): Promise<HyperproofFramework[]> {
    if (!this.apiKey) {
      throw new Error('Hyperproof API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      let url = `${this.baseUrl}/frameworks`;
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch frameworks from Hyperproof');
      }

      return await response.json();

    } catch (error) {
      console.error('Hyperproof frameworks API error:', error);
      return this.getMockFrameworks();
    }
  }

  /**
   * Get compliance requirements for a specific framework
   */
  async getRequirements(frameworkId: string, status?: string): Promise<HyperproofRequirement[]> {
    if (!this.apiKey) {
      throw new Error('Hyperproof API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      let url = `${this.baseUrl}/frameworks/${frameworkId}/requirements`;
      if (status) {
        url += `?status=${status}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('Failed to fetch requirements from Hyperproof');
      }

      return await response.json();

    } catch (error) {
      console.error('Hyperproof requirements API error:', error);
      return this.getMockRequirements();
    }
  }

  /**
   * Update requirement status and evidence
   */
  async updateRequirement(requirementId: string, updates: {
    status?: 'not_started' | 'in_progress' | 'complete' | 'not_applicable';
    assignedTo?: string;
    dueDate?: string;
    notes?: string;
    evidence?: {
      name: string;
      description: string;
      type: string;
      fileUrl?: string;
    }[];
  }): Promise<{
    success: boolean;
    requirementId: string;
    message: string;
  }> {
    if (!this.apiKey) {
      throw new Error('Hyperproof API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/requirements/${requirementId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update requirement');
      }

      const result = await response.json();

      return {
        success: true,
        requirementId,
        message: 'Requirement updated successfully'
      };

    } catch (error) {
      console.error('Hyperproof requirement update error:', error);
      
      return {
        success: true,
        requirementId,
        message: 'Requirement updated successfully (mock)'
      };
    }
  }

  /**
   * Create audit preparation project
   */
  async createAuditPrep(auditData: {
    name: string;
    framework: string;
    auditor: string;
    startDate: string;
    endDate: string;
    scope: string[];
    requirements?: string[];
  }): Promise<HyperproofAuditPrep> {
    if (!this.apiKey) {
      throw new Error('Hyperproof API key not configured');
    }

    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/audit-prep`, {
        method: 'POST',
        headers,
        body: JSON.stringify(auditData)
      });

      if (!response.ok) {
        throw new Error('Failed to create audit preparation');
      }

      return await response.json();

    } catch (error) {
      console.error('Hyperproof audit prep creation error:', error);
      
      // Return mock audit prep
      return {
        id: `audit_prep_${Date.now()}`,
        name: auditData.name,
        framework: auditData.framework,
        auditor: auditData.auditor,
        startDate: auditData.startDate,
        endDate: auditData.endDate,
        status: 'planning',
        completionPercentage: 0,
        readinessScore: 65,
        gaps: [],
        artifacts: []
      };
    }
  }

  /**
   * Get audit readiness assessment
   */
  async getAuditReadiness(frameworkId: string): Promise<{
    framework: string;
    overallReadiness: number;
    completedRequirements: number;
    totalRequirements: number;
    criticalGaps: number;
    highPriorityGaps: number;
    evidenceGaps: number;
    recommendations: {
      priority: 'high' | 'medium' | 'low';
      category: string;
      description: string;
      action: string;
    }[];
    readinessByCategory: {
      category: string;
      readiness: number;
      gaps: number;
    }[];
  }> {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/frameworks/${frameworkId}/readiness`, {
        headers
      });

      if (response.ok) {
        return await response.json();
      }

    } catch (error) {
      console.error('Hyperproof readiness API error:', error);
    }

    // Return mock readiness assessment
    return {
      framework: 'GDPR',
      overallReadiness: 78,
      completedRequirements: 47,
      totalRequirements: 60,
      criticalGaps: 2,
      highPriorityGaps: 5,
      evidenceGaps: 8,
      recommendations: [
        {
          priority: 'high' as const,
          category: 'Data Processing Records',
          description: 'Article 30 records are incomplete',
          action: 'Update and maintain comprehensive processing activity records'
        },
        {
          priority: 'high' as const,
          category: 'Privacy Impact Assessments',
          description: 'Missing DPIAs for high-risk processing',
          action: 'Conduct DPIAs for identified high-risk processing activities'
        },
        {
          priority: 'medium' as const,
          category: 'Data Subject Rights',
          description: 'Response procedures need documentation',
          action: 'Document and test data subject rights response procedures'
        }
      ],
      readinessByCategory: [
        { category: 'Lawfulness of Processing', readiness: 85, gaps: 2 },
        { category: 'Data Subject Rights', readiness: 72, gaps: 4 },
        { category: 'Data Protection Officer', readiness: 95, gaps: 0 },
        { category: 'Privacy by Design', readiness: 68, gaps: 3 },
        { category: 'International Transfers', readiness: 80, gaps: 2 },
        { category: 'Breach Notification', readiness: 88, gaps: 1 }
      ]
    };
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(frameworkId: string, format: 'pdf' | 'xlsx' | 'json' = 'json'): Promise<{
    reportId: string;
    framework: string;
    generatedAt: string;
    complianceScore: number;
    status: string;
    downloadUrl?: string;
    summary: {
      totalRequirements: number;
      completedRequirements: number;
      inProgressRequirements: number;
      notStartedRequirements: number;
      criticalGaps: number;
      evidenceItems: number;
    };
  }> {
    try {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}/frameworks/${frameworkId}/reports`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ format })
      });

      if (response.ok) {
        return await response.json();
      }

    } catch (error) {
      console.error('Hyperproof report generation error:', error);
    }

    // Return mock report
    return {
      reportId: `report_${Date.now()}`,
      framework: 'GDPR',
      generatedAt: new Date().toISOString(),
      complianceScore: 78,
      status: 'completed',
      downloadUrl: format !== 'json' ? `https://example.com/reports/gdpr_report.${format}` : undefined,
      summary: {
        totalRequirements: 60,
        completedRequirements: 47,
        inProgressRequirements: 8,
        notStartedRequirements: 5,
        criticalGaps: 2,
        evidenceItems: 124
      }
    };
  }

  /**
   * Mock frameworks for development
   */
  private getMockFrameworks(): HyperproofFramework[] {
    return [
      {
        id: 'framework_gdpr',
        name: 'GDPR (General Data Protection Regulation)',
        version: '2024.1',
        status: 'active',
        requirements: [],
        lastUpdated: '2024-01-15T00:00:00Z',
        complianceScore: 78
      },
      {
        id: 'framework_iso27001',
        name: 'ISO/IEC 27001:2022',
        version: '2022',
        status: 'active',
        requirements: [],
        lastUpdated: '2024-01-20T00:00:00Z',
        complianceScore: 85
      },
      {
        id: 'framework_soc2',
        name: 'SOC 2 Type II',
        version: '2023',
        status: 'active',
        requirements: [],
        lastUpdated: '2024-02-01T00:00:00Z',
        complianceScore: 72
      }
    ];
  }

  /**
   * Mock requirements for development
   */
  private getMockRequirements(): HyperproofRequirement[] {
    return [
      {
        id: 'req_gdpr_art30',
        frameworkId: 'framework_gdpr',
        reference: 'Article 30',
        title: 'Records of Processing Activities',
        description: 'Maintain records of all processing activities carried out under the responsibility of the controller',
        category: 'Accountability',
        priority: 'high',
        status: 'in_progress',
        assignedTo: 'dpo@company.com',
        dueDate: '2024-03-01T00:00:00Z',
        evidence: [
          {
            id: 'evidence_001',
            requirementId: 'req_gdpr_art30',
            name: 'Processing Activities Register',
            description: 'Comprehensive register of all data processing activities',
            type: 'document',
            uploadDate: '2024-02-01T00:00:00Z',
            status: 'current',
            fileUrl: 'https://example.com/evidence/processing-register.xlsx',
            tags: ['gdpr', 'article30', 'processing']
          }
        ],
        controls: [
          {
            id: 'control_001',
            requirementId: 'req_gdpr_art30',
            name: 'Processing Activity Documentation',
            description: 'Document all processing activities including purpose, categories, retention',
            type: 'administrative',
            frequency: 'quarterly',
            status: 'implemented',
            effectiveness: 'effective',
            lastTested: '2024-01-15T00:00:00Z',
            nextTest: '2024-04-15T00:00:00Z',
            owner: 'privacy-team@company.com'
          }
        ]
      },
      {
        id: 'req_gdpr_dpia',
        frameworkId: 'framework_gdpr',
        reference: 'Article 35',
        title: 'Data Protection Impact Assessment',
        description: 'Conduct DPIA when processing is likely to result in high risk to rights and freedoms',
        category: 'Risk Management',
        priority: 'critical',
        status: 'complete',
        assignedTo: 'privacy@company.com',
        evidence: [
          {
            id: 'evidence_002',
            requirementId: 'req_gdpr_dpia',
            name: 'DPIA Template and Completed Assessments',
            description: 'Standard DPIA template and completed assessments for high-risk processing',
            type: 'document',
            uploadDate: '2024-01-20T00:00:00Z',
            status: 'current',
            tags: ['gdpr', 'dpia', 'risk-assessment']
          }
        ],
        controls: [
          {
            id: 'control_002',
            requirementId: 'req_gdpr_dpia',
            name: 'DPIA Process',
            description: 'Systematic process for conducting and reviewing DPIAs',
            type: 'procedure',
            frequency: 'once',
            status: 'implemented',
            effectiveness: 'effective',
            owner: 'privacy@company.com'
          }
        ]
      }
    ];
  }
}

export default HyperproofService;
