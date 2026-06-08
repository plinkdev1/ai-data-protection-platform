/**
 * Anthropic Claude Integration Service for Advanced AI Processing
 * Handles complex document analysis, legal reasoning, and multi-document synthesis
 */

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image';
    text?: string;
    source?: {
      type: 'base64';
      media_type: string;
      data: string;
    };
  }>;
}

export interface ClaudeCompletion {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{
    type: 'text';
    text: string;
  }>;
  model: string;
  stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence';
  stop_sequence?: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface DocumentAnalysisResult {
  document_type: 'privacy_policy' | 'dpa' | 'consent_form' | 'breach_report' | 'dpia' | 'legal_document' | 'other';
  key_findings: string[];
  compliance_issues: Array<{
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
    legal_reference?: string;
  }>;
  risk_assessment: {
    overall_risk: 'low' | 'medium' | 'high' | 'critical';
    risk_factors: string[];
    mitigation_strategies: string[];
  };
  legal_bases: string[];
  data_categories: string[];
  retention_periods: string[];
  third_party_transfers: boolean;
  international_transfers: boolean;
  automated_decision_making: boolean;
  summary: string;
  confidence_score: number;
}

export interface LegalReasoningResult {
  legal_opinion: string;
  applicable_laws: string[];
  compliance_status: 'compliant' | 'non_compliant' | 'unclear' | 'requires_review';
  risk_factors: Array<{
    factor: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'minor' | 'moderate' | 'significant' | 'severe';
    mitigation: string;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    timeline: string;
    resources_required: string[];
  }>;
  precedents: string[];
  confidence_level: number;
}

export interface RegulationSummary {
  regulation_name: string;
  jurisdiction: string;
  key_requirements: string[];
  penalties: string[];
  deadlines: Array<{
    requirement: string;
    deadline: string;
    status: 'upcoming' | 'current' | 'overdue';
  }>;
  recent_updates: Array<{
    update: string;
    date: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  implementation_guidance: string[];
  related_frameworks: string[];
}

export class ClaudeService {
  private apiKey: string;
  private apiUrl = 'https://api.anthropic.com/v1';
  private model = 'claude-3-5-sonnet-20241022';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`Claude API error: ${response.status} - ${error.error?.message || 'Request failed'}`);
    }

    return response.json();
  }

  /**
   * Create completion
   */
  async createCompletion(data: {
    messages: ClaudeMessage[];
    max_tokens: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    stop_sequences?: string[];
    stream?: boolean;
    system?: string;
  }): Promise<ClaudeCompletion> {
    return this.makeRequest('/messages', {
      model: this.model,
      messages: data.messages,
      max_tokens: data.max_tokens,
      temperature: data.temperature || 0.3,
      top_p: data.top_p,
      top_k: data.top_k,
      stop_sequences: data.stop_sequences,
      stream: data.stream || false,
      system: data.system,
    });
  }

  /**
   * Analyze legal document
   */
  async analyzeDocument(documentContent: string, documentType?: string): Promise<DocumentAnalysisResult> {
    const systemPrompt = `You are an expert privacy lawyer and data protection officer with deep knowledge of GDPR, CCPA, PIPL, LGPD, and other global privacy regulations. Analyze the provided document thoroughly and provide a comprehensive assessment.

Focus on:
1. Document classification and key findings
2. Compliance gaps and legal issues
3. Risk assessment and mitigation strategies
4. Data processing activities and legal bases
5. International transfers and automated decision-making
6. Practical recommendations

Be precise, detailed, and cite specific legal references when applicable.`;

    const userPrompt = `Please analyze this ${documentType || 'legal'} document and provide a comprehensive privacy and compliance assessment:

${documentContent}

Provide your analysis in the following JSON format:
{
  "document_type": "string",
  "key_findings": ["string"],
  "compliance_issues": [
    {
      "issue": "string",
      "severity": "low|medium|high|critical",
      "recommendation": "string",
      "legal_reference": "string"
    }
  ],
  "risk_assessment": {
    "overall_risk": "low|medium|high|critical",
    "risk_factors": ["string"],
    "mitigation_strategies": ["string"]
  },
  "legal_bases": ["string"],
  "data_categories": ["string"],
  "retention_periods": ["string"],
  "third_party_transfers": boolean,
  "international_transfers": boolean,
  "automated_decision_making": boolean,
  "summary": "string",
  "confidence_score": number
}`;

    const completion = await this.createCompletion({
      messages: [
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.2,
      system: systemPrompt
    });

    try {
      const analysis = JSON.parse(completion.content[0].text);
      return analysis;
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        document_type: 'other',
        key_findings: ['Document analysis completed'],
        compliance_issues: [],
        risk_assessment: {
          overall_risk: 'medium',
          risk_factors: ['Manual review required'],
          mitigation_strategies: ['Conduct detailed legal review']
        },
        legal_bases: [],
        data_categories: [],
        retention_periods: [],
        third_party_transfers: false,
        international_transfers: false,
        automated_decision_making: false,
        summary: completion.content[0].text,
        confidence_score: 0.5
      };
    }
  }

  /**
   * Provide legal reasoning and analysis
   */
  async provideLegalReasoning(query: string, context?: {
    jurisdiction?: string;
    regulations?: string[];
    case_facts?: string;
    precedents?: string[];
  }): Promise<LegalReasoningResult> {
    const systemPrompt = `You are a senior privacy and data protection lawyer with expertise in global privacy regulations including GDPR, CCPA, PIPL, LGPD, PIPEDA, and sector-specific regulations. Provide thorough legal analysis with practical recommendations.

Consider:
1. Applicable laws and regulations
2. Legal precedents and guidance
3. Risk assessment and compliance status
4. Practical implementation steps
5. Resource requirements and timelines

Be precise, cite authorities, and provide actionable guidance.`;

    const contextInfo = context ? `
Context:
- Jurisdiction: ${context.jurisdiction || 'Not specified'}
- Applicable Regulations: ${context.regulations?.join(', ') || 'Not specified'}
- Case Facts: ${context.case_facts || 'Not provided'}
- Relevant Precedents: ${context.precedents?.join(', ') || 'None provided'}
` : '';

    const userPrompt = `Please provide comprehensive legal reasoning and analysis for the following query:

${query}

${contextInfo}

Provide your analysis in JSON format:
{
  "legal_opinion": "string",
  "applicable_laws": ["string"],
  "compliance_status": "compliant|non_compliant|unclear|requires_review",
  "risk_factors": [
    {
      "factor": "string",
      "likelihood": "low|medium|high",
      "impact": "minor|moderate|significant|severe",
      "mitigation": "string"
    }
  ],
  "recommendations": [
    {
      "action": "string",
      "priority": "low|medium|high|critical",
      "timeline": "string",
      "resources_required": ["string"]
    }
  ],
  "precedents": ["string"],
  "confidence_level": number
}`;

    const completion = await this.createCompletion({
      messages: [
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      temperature: 0.1,
      system: systemPrompt
    });

    try {
      return JSON.parse(completion.content[0].text);
    } catch (error) {
      return {
        legal_opinion: completion.content[0].text,
        applicable_laws: [],
        compliance_status: 'requires_review',
        risk_factors: [],
        recommendations: [],
        precedents: [],
        confidence_level: 0.5
      };
    }
  }

  /**
   * Summarize complex regulations
   */
  async summarizeRegulation(regulationText: string, jurisdiction: string): Promise<RegulationSummary> {
    const systemPrompt = `You are an expert legal analyst specializing in privacy and data protection regulations. Create comprehensive, actionable summaries of complex legal texts that help organizations understand compliance requirements.`;

    const userPrompt = `Please summarize this regulation from ${jurisdiction}:

${regulationText}

Provide a comprehensive summary in JSON format:
{
  "regulation_name": "string",
  "jurisdiction": "string",
  "key_requirements": ["string"],
  "penalties": ["string"],
  "deadlines": [
    {
      "requirement": "string",
      "deadline": "string",
      "status": "upcoming|current|overdue"
    }
  ],
  "recent_updates": [
    {
      "update": "string",
      "date": "string",
      "impact": "low|medium|high"
    }
  ],
  "implementation_guidance": ["string"],
  "related_frameworks": ["string"]
}`;

    const completion = await this.createCompletion({
      messages: [
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 3000,
      temperature: 0.2,
      system: systemPrompt
    });

    try {
      return JSON.parse(completion.content[0].text);
    } catch (error) {
      return {
        regulation_name: 'Unknown Regulation',
        jurisdiction: jurisdiction,
        key_requirements: [],
        penalties: [],
        deadlines: [],
        recent_updates: [],
        implementation_guidance: [],
        related_frameworks: []
      };
    }
  }

  /**
   * Compare multiple documents
   */
  async compareDocuments(documents: Array<{
    title: string;
    content: string;
    type?: string;
  }>): Promise<{
    similarities: string[];
    differences: string[];
    compliance_gaps: string[];
    recommendations: string[];
    risk_assessment: {
      overall_risk: 'low' | 'medium' | 'high' | 'critical';
      key_risks: string[];
    };
  }> {
    const systemPrompt = `You are an expert privacy lawyer conducting a comparative analysis of legal documents. Identify key similarities, differences, compliance gaps, and provide practical recommendations.`;

    const documentSummaries = documents.map((doc, index) => 
      `Document ${index + 1}: ${doc.title} (${doc.type || 'unspecified type'})
Content: ${doc.content.substring(0, 2000)}...`
    ).join('\n\n');

    const userPrompt = `Please compare these documents and provide a comprehensive analysis:

${documentSummaries}

Provide your analysis in JSON format:
{
  "similarities": ["string"],
  "differences": ["string"],
  "compliance_gaps": ["string"],
  "recommendations": ["string"],
  "risk_assessment": {
    "overall_risk": "low|medium|high|critical",
    "key_risks": ["string"]
  }
}`;

    const completion = await this.createCompletion({
      messages: [
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 3000,
      system: systemPrompt
    });

    try {
      return JSON.parse(completion.content[0].text);
    } catch (error) {
      return {
        similarities: [],
        differences: [],
        compliance_gaps: [],
        recommendations: ['Manual review recommended due to analysis error'],
        risk_assessment: {
          overall_risk: 'medium',
          key_risks: ['Unable to complete automated analysis']
        }
      };
    }
  }

  /**
   * Generate comprehensive DPIA
   */
  async generateDPIA(processingActivity: {
    name: string;
    purpose: string;
    data_categories: string[];
    data_subjects: string[];
    legal_basis: string;
    recipients: string[];
    retention_period: string;
    security_measures: string[];
    international_transfers: boolean;
    automated_decision_making: boolean;
  }): Promise<{
    necessity_assessment: string;
    proportionality_assessment: string;
    risk_identification: Array<{
      risk: string;
      likelihood: 'low' | 'medium' | 'high';
      impact: 'low' | 'medium' | 'high';
      risk_score: number;
    }>;
    mitigation_measures: string[];
    consultation_requirements: string[];
    conclusion: string;
    recommendations: string[];
  }> {
    const systemPrompt = `You are an expert data protection officer conducting a Data Protection Impact Assessment (DPIA) under GDPR Article 35. Provide thorough analysis of necessity, proportionality, and risks.`;

    const userPrompt = `Please conduct a comprehensive DPIA for this processing activity:

Name: ${processingActivity.name}
Purpose: ${processingActivity.purpose}
Data Categories: ${processingActivity.data_categories.join(', ')}
Data Subjects: ${processingActivity.data_subjects.join(', ')}
Legal Basis: ${processingActivity.legal_basis}
Recipients: ${processingActivity.recipients.join(', ')}
Retention Period: ${processingActivity.retention_period}
Security Measures: ${processingActivity.security_measures.join(', ')}
International Transfers: ${processingActivity.international_transfers ? 'Yes' : 'No'}
Automated Decision Making: ${processingActivity.automated_decision_making ? 'Yes' : 'No'}

Provide a comprehensive DPIA in JSON format:
{
  "necessity_assessment": "string",
  "proportionality_assessment": "string",
  "risk_identification": [
    {
      "risk": "string",
      "likelihood": "low|medium|high",
      "impact": "low|medium|high",
      "risk_score": number
    }
  ],
  "mitigation_measures": ["string"],
  "consultation_requirements": ["string"],
  "conclusion": "string",
  "recommendations": ["string"]
}`;

    const completion = await this.createCompletion({
      messages: [
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 4000,
      system: systemPrompt
    });

    try {
      return JSON.parse(completion.content[0].text);
    } catch (error) {
      return {
        necessity_assessment: 'Assessment requires manual review',
        proportionality_assessment: 'Assessment requires manual review',
        risk_identification: [],
        mitigation_measures: [],
        consultation_requirements: [],
        conclusion: 'Manual DPIA review required',
        recommendations: ['Conduct manual DPIA assessment']
      };
    }
  }

  /**
   * Analyze breach impact
   */
  async analyzeBreachImpact(breachDetails: {
    incident_type: string;
    affected_data_types: string[];
    estimated_affected_count: number;
    circumstances: string;
    current_measures: string[];
  }): Promise<{
    severity_assessment: 'low' | 'medium' | 'high' | 'critical';
    notification_requirements: {
      authority_notification_required: boolean;
      authority_deadline: string;
      individual_notification_required: boolean;
      individual_deadline: string;
    };
    impact_analysis: {
      financial_impact: string;
      reputational_impact: string;
      operational_impact: string;
      regulatory_impact: string;
    };
    immediate_actions: string[];
    remediation_plan: string[];
    communication_strategy: string[];
  }> {
    const systemPrompt = `You are an expert incident response coordinator specializing in data breach analysis under GDPR and other privacy regulations. Assess the severity and provide comprehensive response guidance.`;

    const userPrompt = `Please analyze this data breach incident:

Incident Type: ${breachDetails.incident_type}
Affected Data Types: ${breachDetails.affected_data_types.join(', ')}
Estimated Affected Count: ${breachDetails.estimated_affected_count}
Circumstances: ${breachDetails.circumstances}
Current Security Measures: ${breachDetails.current_measures.join(', ')}

Provide comprehensive breach impact analysis in JSON format:
{
  "severity_assessment": "low|medium|high|critical",
  "notification_requirements": {
    "authority_notification_required": boolean,
    "authority_deadline": "string",
    "individual_notification_required": boolean,
    "individual_deadline": "string"
  },
  "impact_analysis": {
    "financial_impact": "string",
    "reputational_impact": "string",
    "operational_impact": "string",
    "regulatory_impact": "string"
  },
  "immediate_actions": ["string"],
  "remediation_plan": ["string"],
  "communication_strategy": ["string"]
}`;

    const completion = await this.createCompletion({
      messages: [
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 3000,
      system: systemPrompt
    });

    try {
      return JSON.parse(completion.content[0].text);
    } catch (error) {
      return {
        severity_assessment: 'high',
        notification_requirements: {
          authority_notification_required: true,
          authority_deadline: '72 hours',
          individual_notification_required: true,
          individual_deadline: 'Without undue delay'
        },
        impact_analysis: {
          financial_impact: 'Requires assessment',
          reputational_impact: 'Requires assessment',
          operational_impact: 'Requires assessment',
          regulatory_impact: 'Requires assessment'
        },
        immediate_actions: ['Contain the breach', 'Assess the scope', 'Document the incident'],
        remediation_plan: ['Conduct thorough investigation'],
        communication_strategy: ['Prepare breach notifications']
      };
    }
  }
}
