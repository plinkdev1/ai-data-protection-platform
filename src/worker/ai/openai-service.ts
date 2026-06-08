import OpenAI from 'openai';

export interface PolicyGenerationInput {
  organizationName: string;
  organizationDomain?: string;
  industry: string;
  policyType: 'privacy_policy' | 'cookie_policy' | 'data_retention' | 'security_policy';
  dataCategories?: string[];
  legalBases?: string[];
  retentionPeriods?: string[];
  contactEmail?: string;
  dpoDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface RiskAssessmentInput {
  activityName: string;
  activityPurpose: string;
  dataCategories: string[];
  dataSubjects: string[];
  legalBasis: string;
  thirdPartySharing: boolean;
  internationalTransfers: boolean;
  automatedDecisionMaking: boolean;
  existingSecurityMeasures: string[];
}

export interface DSARResponseInput {
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection' | 'restriction';
  subjectDetails: {
    name?: string;
    email: string;
    requestDetails?: string;
  };
  organizationName: string;
  dataHoldings: string[];
  legalBases: string[];
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  confidence: number;
  reasoning: string;
  requiresHumanReview: boolean;
  error?: string;
}

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  async generatePolicy(input: PolicyGenerationInput): Promise<AIResponse<{ title: string; content: string; version: string }>> {
    try {
      const systemPrompt = this.getPolicySystemPrompt(input.policyType);
      const userPrompt = this.buildPolicyUserPrompt(input);

      const completion = await this.client.chat.completions.create({
        model: 'o4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_completion_tokens: 3000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'policy_generation',
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                version: { type: 'string' },
                confidence: { type: 'number' },
                reasoning: { type: 'string' },
                requiresHumanReview: { type: 'boolean' },
                recommendations: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['title', 'content', 'version', 'confidence', 'reasoning', 'requiresHumanReview'],
              additionalProperties: false
            },
            strict: true
          }
        }
      });

      const result = JSON.parse(completion.choices[0].message.content!);
      
      return {
        success: true,
        data: {
          title: result.title,
          content: result.content,
          version: result.version
        },
        confidence: result.confidence,
        reasoning: result.reasoning,
        requiresHumanReview: result.requiresHumanReview
      };

    } catch (error) {
      console.error('Policy generation error:', error);
      return {
        success: false,
        confidence: 0,
        reasoning: 'Failed to generate policy due to API error',
        requiresHumanReview: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async assessRisk(input: RiskAssessmentInput): Promise<AIResponse<{ riskScore: number; riskLevel: string; risks: string[]; mitigations: string[] }>> {
    try {
      const systemPrompt = `You are an expert data protection and privacy risk assessor specializing in GDPR compliance. 
      Analyze processing activities and provide comprehensive risk assessments with specific mitigation strategies.
      
      Risk scoring should be based on:
      - Likelihood of harm (1-5)
      - Severity of impact (1-5)
      - Risk score = Likelihood × Severity (1-25)
      
      Risk levels:
      - 1-6: Low
      - 7-12: Medium  
      - 13-18: High
      - 19-25: Very High`;

      const userPrompt = `Assess the privacy risk for this processing activity:

Activity: ${input.activityName}
Purpose: ${input.activityPurpose}
Data Categories: ${input.dataCategories.join(', ')}
Data Subjects: ${input.dataSubjects.join(', ')}
Legal Basis: ${input.legalBasis}
Third Party Sharing: ${input.thirdPartySharing ? 'Yes' : 'No'}
International Transfers: ${input.internationalTransfers ? 'Yes' : 'No'}
Automated Decision Making: ${input.automatedDecisionMaking ? 'Yes' : 'No'}
Existing Security Measures: ${input.existingSecurityMeasures.join(', ')}

Provide a detailed risk assessment with specific risks and mitigation measures.`;

      const completion = await this.client.chat.completions.create({
        model: 'o4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_completion_tokens: 2000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'risk_assessment',
            schema: {
              type: 'object',
              properties: {
                riskScore: { type: 'number', minimum: 1, maximum: 25 },
                riskLevel: { type: 'string', enum: ['low', 'medium', 'high', 'very_high'] },
                likelihood: { type: 'number', minimum: 1, maximum: 5 },
                severity: { type: 'number', minimum: 1, maximum: 5 },
                risks: {
                  type: 'array',
                  items: { type: 'string' }
                },
                mitigations: {
                  type: 'array',
                  items: { type: 'string' }
                },
                confidence: { type: 'number' },
                reasoning: { type: 'string' },
                requiresHumanReview: { type: 'boolean' }
              },
              required: ['riskScore', 'riskLevel', 'likelihood', 'severity', 'risks', 'mitigations', 'confidence', 'reasoning', 'requiresHumanReview'],
              additionalProperties: false
            },
            strict: true
          }
        }
      });

      const result = JSON.parse(completion.choices[0].message.content!);
      
      return {
        success: true,
        data: {
          riskScore: result.riskScore,
          riskLevel: result.riskLevel,
          risks: result.risks,
          mitigations: result.mitigations
        },
        confidence: result.confidence,
        reasoning: result.reasoning,
        requiresHumanReview: result.requiresHumanReview
      };

    } catch (error) {
      console.error('Risk assessment error:', error);
      return {
        success: false,
        confidence: 0,
        reasoning: 'Failed to assess risk due to API error',
        requiresHumanReview: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateDSARResponse(input: DSARResponseInput): Promise<AIResponse<{ response: string; attachments: string[]; nextSteps: string[] }>> {
    try {
      const systemPrompt = `You are an expert data protection officer specializing in GDPR data subject access requests (DSARs).
      Generate professional, compliant responses that are clear, comprehensive, and legally accurate.
      
      Response must:
      - Be clear and accessible to the data subject
      - Comply with GDPR requirements
      - Include all necessary legal information
      - Provide practical next steps
      - Maintain professional tone`;

      const userPrompt = `Generate a DSAR response for:

Request Type: ${input.requestType}
Subject Name: ${input.subjectDetails.name || 'Not provided'}
Subject Email: ${input.subjectDetails.email}
Request Details: ${input.subjectDetails.requestDetails || 'Standard request'}
Organization: ${input.organizationName}
Data Holdings: ${input.dataHoldings.join(', ')}
Legal Bases: ${input.legalBases.join(', ')}

Generate a complete response letter with proper GDPR compliance.`;

      const completion = await this.client.chat.completions.create({
        model: 'o4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_completion_tokens: 2500,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'dsar_response',
            schema: {
              type: 'object',
              properties: {
                response: { type: 'string' },
                attachments: {
                  type: 'array',
                  items: { type: 'string' }
                },
                nextSteps: {
                  type: 'array',
                  items: { type: 'string' }
                },
                timeframe: { type: 'string' },
                confidence: { type: 'number' },
                reasoning: { type: 'string' },
                requiresHumanReview: { type: 'boolean' }
              },
              required: ['response', 'attachments', 'nextSteps', 'timeframe', 'confidence', 'reasoning', 'requiresHumanReview'],
              additionalProperties: false
            },
            strict: true
          }
        }
      });

      const result = JSON.parse(completion.choices[0].message.content!);
      
      return {
        success: true,
        data: {
          response: result.response,
          attachments: result.attachments,
          nextSteps: result.nextSteps
        },
        confidence: result.confidence,
        reasoning: result.reasoning,
        requiresHumanReview: result.requiresHumanReview
      };

    } catch (error) {
      console.error('DSAR response generation error:', error);
      return {
        success: false,
        confidence: 0,
        reasoning: 'Failed to generate DSAR response due to API error',
        requiresHumanReview: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async checkCompliance(context: any): Promise<AIResponse<{ issues: string[]; recommendations: string[]; complianceScore: number }>> {
    try {
      const systemPrompt = `You are a GDPR compliance expert. Analyze the provided context and identify compliance gaps, 
      issues, and provide specific recommendations for improvement.
      
      Score compliance on a scale of 0-100 based on:
      - Policy completeness and accuracy
      - Process compliance
      - Documentation quality
      - Risk management
      - Data subject rights implementation`;

      const userPrompt = `Analyze this organization's GDPR compliance status:

Context: ${JSON.stringify(context, null, 2)}

Identify specific compliance issues and provide actionable recommendations.`;

      const completion = await this.client.chat.completions.create({
        model: 'o4-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        max_completion_tokens: 2000,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'compliance_check',
            schema: {
              type: 'object',
              properties: {
                complianceScore: { type: 'number', minimum: 0, maximum: 100 },
                issues: {
                  type: 'array',
                  items: { type: 'string' }
                },
                recommendations: {
                  type: 'array',
                  items: { type: 'string' }
                },
                priorityAreas: {
                  type: 'array',
                  items: { type: 'string' }
                },
                confidence: { type: 'number' },
                reasoning: { type: 'string' },
                requiresHumanReview: { type: 'boolean' }
              },
              required: ['complianceScore', 'issues', 'recommendations', 'priorityAreas', 'confidence', 'reasoning', 'requiresHumanReview'],
              additionalProperties: false
            },
            strict: true
          }
        }
      });

      const result = JSON.parse(completion.choices[0].message.content!);
      
      return {
        success: true,
        data: {
          issues: result.issues,
          recommendations: result.recommendations,
          complianceScore: result.complianceScore
        },
        confidence: result.confidence,
        reasoning: result.reasoning,
        requiresHumanReview: result.requiresHumanReview
      };

    } catch (error) {
      console.error('Compliance check error:', error);
      return {
        success: false,
        confidence: 0,
        reasoning: 'Failed to check compliance due to API error',
        requiresHumanReview: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private getPolicySystemPrompt(policyType: string): string {
    const basePrompt = `You are an expert privacy lawyer and data protection officer specializing in GDPR compliance. 
    Generate comprehensive, legally accurate, and user-friendly privacy policies.`;

    switch (policyType) {
      case 'privacy_policy':
        return `${basePrompt}
        
        Generate a complete GDPR-compliant privacy policy that includes:
        - Clear purpose and scope
        - Data controller information
        - Legal bases for processing
        - Categories of personal data
        - Data subject rights
        - Retention periods
        - Security measures
        - Contact information
        - Regular review procedures
        
        The policy must be clear, accessible, and legally compliant.`;

      case 'cookie_policy':
        return `${basePrompt}
        
        Generate a comprehensive cookie policy that includes:
        - What cookies are and how they work
        - Types of cookies used
        - Purpose for each cookie category
        - Consent mechanisms
        - How to manage cookie preferences
        - Third-party cookies
        - Legal basis for cookie use
        
        Ensure compliance with ePrivacy regulations and GDPR.`;

      case 'data_retention':
        return `${basePrompt}
        
        Generate a data retention policy that includes:
        - Retention schedules by data category
        - Legal requirements and bases
        - Deletion procedures
        - Review and audit processes
        - Roles and responsibilities
        - Exception handling
        - Documentation requirements
        
        Focus on practical implementation and legal compliance.`;

      case 'security_policy':
        return `${basePrompt}
        
        Generate a data security policy that includes:
        - Security principles and objectives
        - Technical and organizational measures
        - Access controls and authentication
        - Data encryption requirements
        - Incident response procedures
        - Staff training requirements
        - Regular security assessments
        - Compliance monitoring
        
        Align with GDPR Article 32 requirements.`;

      default:
        return basePrompt;
    }
  }

  private buildPolicyUserPrompt(input: PolicyGenerationInput): string {
    return `Generate a ${input.policyType.replace('_', ' ')} for:

Organization: ${input.organizationName}
Domain: ${input.organizationDomain || 'Not provided'}
Industry: ${input.industry}
Data Categories: ${input.dataCategories?.join(', ') || 'Standard business data'}
Legal Bases: ${input.legalBases?.join(', ') || 'Contract, Legitimate Interests'}
Contact Email: ${input.contactEmail || 'privacy@' + (input.organizationDomain || 'organization.com')}
${input.dpoDetails ? `DPO: ${input.dpoDetails.name} (${input.dpoDetails.email})` : ''}

Generate a professional, comprehensive policy that is legally compliant and user-friendly.`;
  }
}
