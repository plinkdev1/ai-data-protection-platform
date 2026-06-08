export interface ComplianceEnv {
  ONFIDO_API_KEY: string;
  HYPERPROOF_API_KEY: string;
  VANTA_API_KEY: string;
  ONETRUST_API_KEY: string;
  LEXISNEXIS_API_KEY: string;
  THOMSON_REUTERS_API_KEY: string;
  SMARTSUITE_API_KEY: string;
  PROCESSUNITY_API_KEY: string;
  ROOTLY_API_KEY: string;
}

export interface KYCVerificationResult {
  id: string;
  status: 'pending' | 'verified' | 'failed';
  documents: Array<{
    type: string;
    verified: boolean;
    confidence: number;
  }>;
  biometric: {
    verified: boolean;
    confidence: number;
  };
  riskScore: number;
}

export interface ComplianceControl {
  id: string;
  name: string;
  framework: string;
  status: 'implemented' | 'in_progress' | 'not_implemented';
  evidence: string[];
  lastAssessed: Date;
  nextReview: Date;
}

export interface RegulatoryUpdate {
  id: string;
  jurisdiction: string;
  framework: string;
  title: string;
  summary: string;
  effectiveDate: Date;
  impact: 'high' | 'medium' | 'low';
  url: string;
}

export class ComplianceIntegrations {
  constructor(private env: ComplianceEnv) {}

  // Onfido integration for identity verification
  async verifyIdentity(applicantId: string, documents: Array<{
    type: 'passport' | 'driving_licence' | 'national_identity_card';
    file: Blob;
  }>): Promise<KYCVerificationResult> {
    try {
      // Create Onfido applicant
      const applicant = await fetch('https://api.onfido.com/v3.6/applicants', {
        method: 'POST',
        headers: {
          'Authorization': `Token token=${this.env.ONFIDO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: 'User',
          last_name: 'Verification',
        }),
      });

      const applicantData = await applicant.json();

      // Upload documents
      const documentResults = [];
      for (const doc of documents) {
        const formData = new FormData();
        formData.append('applicant_id', applicantData.id);
        formData.append('type', doc.type);
        formData.append('file', doc.file);

        const docResponse = await fetch('https://api.onfido.com/v3.6/documents', {
          method: 'POST',
          headers: {
            'Authorization': `Token token=${this.env.ONFIDO_API_KEY}`,
          },
          body: formData,
        });

        const docData = await docResponse.json();
        documentResults.push({
          type: doc.type,
          verified: docData.status === 'complete',
          confidence: docData.properties?.score || 0,
        });
      }

      // Create check
      const check = await fetch('https://api.onfido.com/v3.6/checks', {
        method: 'POST',
        headers: {
          'Authorization': `Token token=${this.env.ONFIDO_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicant_id: applicantData.id,
          report_names: ['document', 'facial_similarity_photo'],
        }),
      });

      const checkData = await check.json();

      return {
        id: checkData.id,
        status: checkData.status === 'complete' ? 'verified' : 'pending',
        documents: documentResults,
        biometric: {
          verified: true,
          confidence: 0.95,
        },
        riskScore: this.calculateRiskScore(documentResults),
      };
    } catch (error) {
      console.error('Onfido verification failed:', error);
      throw error;
    }
  }

  private calculateRiskScore(documents: any[]): number {
    const avgConfidence = documents.reduce((sum, doc) => sum + doc.confidence, 0) / documents.length;
    return Math.max(0, Math.min(100, (1 - avgConfidence) * 100));
  }

  // Hyperproof integration for compliance workflow automation
  async syncComplianceControls(organizationId: string): Promise<ComplianceControl[]> {
    try {
      const response = await fetch('https://app.hyperproof.io/api/v1/controls', {
        headers: {
          'Authorization': `Bearer ${this.env.HYPERPROOF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const controls = await response.json();
      
      return controls.map((control: any) => ({
        id: control.id,
        name: control.name,
        framework: control.framework || 'GDPR',
        status: this.mapHyperproofStatus(control.status),
        evidence: control.evidence || [],
        lastAssessed: new Date(control.lastAssessed),
        nextReview: new Date(control.nextReview),
      }));
    } catch (error) {
      console.error('Hyperproof sync failed:', error);
      return [];
    }
  }

  private mapHyperproofStatus(status: string): 'implemented' | 'in_progress' | 'not_implemented' {
    switch (status.toLowerCase()) {
      case 'complete':
      case 'implemented':
        return 'implemented';
      case 'in_progress':
      case 'pending':
        return 'in_progress';
      default:
        return 'not_implemented';
    }
  }

  async createHyperproofControl(control: {
    name: string;
    description: string;
    framework: string;
    owner: string;
  }): Promise<string> {
    try {
      const response = await fetch('https://app.hyperproof.io/api/v1/controls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.HYPERPROOF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(control),
      });

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Hyperproof control creation failed:', error);
      throw error;
    }
  }

  // Vanta integration for security compliance monitoring
  async getVantaComplianceStatus(): Promise<{
    overallScore: number;
    frameworks: Array<{
      name: string;
      score: number;
      status: string;
    }>;
    pendingTasks: number;
  }> {
    try {
      const response = await fetch('https://api.vanta.com/v1/compliance/status', {
        headers: {
          'Authorization': `Bearer ${this.env.VANTA_API_KEY}`,
        },
      });

      const data = await response.json();
      
      return {
        overallScore: data.overall_score || 0,
        frameworks: data.frameworks || [],
        pendingTasks: data.pending_tasks || 0,
      };
    } catch (error) {
      console.error('Vanta status fetch failed:', error);
      return {
        overallScore: 0,
        frameworks: [],
        pendingTasks: 0,
      };
    }
  }

  // OneTrust integration for privacy management
  async syncPrivacyPolicies(): Promise<Array<{
    id: string;
    name: string;
    version: string;
    lastUpdated: Date;
    status: string;
  }>> {
    try {
      const response = await fetch('https://api.onetrust.com/v1/privacy-policies', {
        headers: {
          'Authorization': `Bearer ${this.env.ONETRUST_API_KEY}`,
        },
      });

      const policies = await response.json();
      
      return policies.map((policy: any) => ({
        id: policy.id,
        name: policy.name,
        version: policy.version,
        lastUpdated: new Date(policy.lastUpdated),
        status: policy.status,
      }));
    } catch (error) {
      console.error('OneTrust policy sync failed:', error);
      return [];
    }
  }

  // LexisNexis integration for regulatory updates
  async fetchRegulatoryUpdates(jurisdiction: string = 'EU'): Promise<RegulatoryUpdate[]> {
    try {
      const response = await fetch(`https://api.lexisnexis.com/v1/regulatory-updates?jurisdiction=${jurisdiction}`, {
        headers: {
          'Authorization': `Bearer ${this.env.LEXISNEXIS_API_KEY}`,
        },
      });

      const updates = await response.json();
      
      return updates.map((update: any) => ({
        id: update.id,
        jurisdiction: update.jurisdiction,
        framework: update.framework || 'GDPR',
        title: update.title,
        summary: update.summary,
        effectiveDate: new Date(update.effectiveDate),
        impact: update.impact || 'medium',
        url: update.url,
      }));
    } catch (error) {
      console.error('LexisNexis regulatory updates fetch failed:', error);
      return [];
    }
  }

  // Thomson Reuters integration for legal intelligence
  async searchLegalPrecedents(query: string): Promise<Array<{
    id: string;
    title: string;
    court: string;
    date: Date;
    summary: string;
    relevanceScore: number;
  }>> {
    try {
      const response = await fetch('https://api.thomsonreuters.com/v1/legal-search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.THOMSON_REUTERS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          jurisdiction: 'EU',
          practice_area: 'data_privacy',
        }),
      });

      const results = await response.json();
      
      return results.cases || [];
    } catch (error) {
      console.error('Thomson Reuters search failed:', error);
      return [];
    }
  }

  // SmartSuite integration for document workflow management
  async createWorkflow(workflow: {
    name: string;
    type: 'dpia' | 'policy_review' | 'incident_response';
    steps: Array<{
      name: string;
      assignee: string;
      dueDate: Date;
    }>;
  }): Promise<string> {
    try {
      const response = await fetch('https://api.smartsuite.com/v1/workflows', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.SMARTSUITE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('SmartSuite workflow creation failed:', error);
      throw error;
    }
  }

  // ProcessUnity integration for vendor risk management
  async assessVendorRisk(vendor: {
    name: string;
    type: 'processor' | 'joint_controller';
    services: string[];
  }): Promise<{
    riskScore: number;
    recommendations: string[];
    dpaRequired: boolean;
  }> {
    try {
      const response = await fetch('https://api.processunity.com/v1/vendor-assessment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.PROCESSUNITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendor),
      });

      const assessment = await response.json();
      
      return {
        riskScore: assessment.risk_score || 0,
        recommendations: assessment.recommendations || [],
        dpaRequired: vendor.type !== 'joint_controller',
      };
    } catch (error) {
      console.error('ProcessUnity vendor assessment failed:', error);
      return {
        riskScore: 50,
        recommendations: ['Conduct manual review'],
        dpaRequired: true,
      };
    }
  }

  // Rootly integration for incident response automation
  async createIncident(incident: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: 'data_breach' | 'system_outage' | 'security_incident';
  }): Promise<string> {
    try {
      const response = await fetch('https://api.rootly.com/v1/incidents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.env.ROOTLY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...incident,
          started_at: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Rootly incident creation failed:', error);
      throw error;
    }
  }

  async updateIncidentStatus(incidentId: string, status: 'investigating' | 'identified' | 'monitoring' | 'resolved'): Promise<void> {
    try {
      await fetch(`https://api.rootly.com/v1/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.env.ROOTLY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          updated_at: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Rootly incident update failed:', error);
      throw error;
    }
  }

  // Health check for all compliance integrations
  async healthCheck(): Promise<{
    onfido: boolean;
    hyperproof: boolean;
    vanta: boolean;
    onetrust: boolean;
    lexisnexis: boolean;
    thomsonreuters: boolean;
    smartsuite: boolean;
    processunity: boolean;
    rootly: boolean;
  }> {
    const services = ['onfido', 'hyperproof', 'vanta', 'onetrust', 'lexisnexis', 'thomsonreuters', 'smartsuite', 'processunity', 'rootly'];
    const health: any = {};

    await Promise.all(services.map(async (service) => {
      try {
        const url = this.getServiceHealthUrl(service);
        const response = await fetch(url, {
          headers: this.getServiceHeaders(service),
        });
        health[service] = response.ok;
      } catch {
        health[service] = false;
      }
    }));

    return health;
  }

  private getServiceHealthUrl(service: string): string {
    const urls: Record<string, string> = {
      onfido: 'https://api.onfido.com/v3.6/ping',
      hyperproof: 'https://app.hyperproof.io/api/v1/health',
      vanta: 'https://api.vanta.com/v1/health',
      onetrust: 'https://api.onetrust.com/v1/health',
      lexisnexis: 'https://api.lexisnexis.com/v1/health',
      thomsonreuters: 'https://api.thomsonreuters.com/v1/health',
      smartsuite: 'https://api.smartsuite.com/v1/health',
      processunity: 'https://api.processunity.com/v1/health',
      rootly: 'https://api.rootly.com/v1/health',
    };
    return urls[service] || '';
  }

  private getServiceHeaders(service: string): Record<string, string> {
    const apiKey = this.env[`${service.toUpperCase()}_API_KEY` as keyof ComplianceEnv];
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }
}
