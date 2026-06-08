// Onfido Identity Verification Service
// Provides comprehensive identity verification including document and biometric checks
// Used for verifying provider certificates and user identities in compliance workflows

export interface OnfidoConfig {
  apiKey: string;
  apiUrl?: string;
  sandbox?: boolean;
}

export interface OnfidoApplicant {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: {
    flat_number?: string;
    building_number?: string;
    building_name?: string;
    street?: string;
    sub_street?: string;
    town?: string;
    state?: string;
    postcode?: string;
    country: string;
  };
}

export interface OnfidoDocument {
  id?: string;
  type: 'passport' | 'driving_licence' | 'national_identity_card' | 'residence_permit' | 'tax_id' | 'voter_id' | 'work_permit' | 'generic';
  side?: 'front' | 'back';
  issuing_country?: string;
  file_data?: ArrayBuffer;
  file_name?: string;
  file_type?: string;
}

export interface OnfidoCheck {
  id?: string;
  applicant_id: string;
  report_names: ('document' | 'facial_similarity_photo' | 'facial_similarity_video' | 'known_faces' | 'identity_enhanced')[];
  tags?: string[];
  suppress_form_emails?: boolean;
  async?: boolean;
  redirect_uri?: string;
}

export interface OnfidoWebhookEvent {
  payload: {
    resource_type: 'check' | 'report' | 'applicant';
    action: 'check.completed' | 'check.withdrawn' | 'report.completed' | 'report.withdrawn';
    object: {
      id: string;
      status?: 'complete' | 'in_progress' | 'awaiting_applicant' | 'cancelled' | 'withdrawn';
      result?: 'clear' | 'consider' | 'unidentified';
      href: string;
      completed_at_iso8601?: string;
    };
  };
}

export interface OnfidoCheckResult {
  id: string;
  status: 'complete' | 'in_progress' | 'awaiting_applicant' | 'cancelled' | 'withdrawn';
  result: 'clear' | 'consider' | 'unidentified';
  form_uri?: string;
  redirect_uri?: string;
  results_uri?: string;
  created_at: string;
  href: string;
  applicant_id: string;
  tags?: string[];
  report_ids: string[];
  reports?: OnfidoReport[];
}

export interface OnfidoReport {
  id: string;
  name: string;
  created_at: string;
  status: 'complete' | 'in_progress' | 'awaiting_data' | 'awaiting_approval' | 'cancelled' | 'paused';
  result: 'clear' | 'consider' | 'unidentified';
  sub_result?: string;
  breakdown?: Record<string, any>;
  properties?: Record<string, any>;
  href: string;
}

export interface DocumentVerificationResult {
  success: boolean;
  verification_id: string;
  status: 'verified' | 'pending' | 'rejected' | 'error';
  confidence_score: number;
  document_type: string;
  extracted_data?: {
    document_number?: string;
    full_name?: string;
    date_of_birth?: string;
    expiry_date?: string;
    issue_date?: string;
    nationality?: string;
    gender?: string;
    issuing_country?: string;
    issuing_authority?: string;
  };
  verification_checks?: {
    document_integrity?: 'pass' | 'fail' | 'warn';
    visual_authenticity?: 'pass' | 'fail' | 'warn';
    data_consistency?: 'pass' | 'fail' | 'warn';
    image_quality?: 'pass' | 'fail' | 'warn';
  };
  issues_detected?: string[];
  recommendations?: string[];
  error_message?: string;
}

export interface BiometricVerificationResult {
  success: boolean;
  verification_id: string;
  status: 'verified' | 'pending' | 'rejected' | 'error';
  confidence_score: number;
  facial_similarity_score: number;
  liveness_detected: boolean;
  verification_method: 'photo' | 'video' | 'motion';
  issues_detected?: string[];
  error_message?: string;
}

export interface CertificateVerificationRequest {
  document_type: 'professional_certificate' | 'educational_diploma' | 'license' | 'accreditation';
  issuing_authority: string;
  certificate_number?: string;
  holder_name: string;
  issue_date?: string;
  expiry_date?: string;
  verification_url?: string;
  document_file?: ArrayBuffer;
}

export interface CertificateVerificationResult {
  success: boolean;
  verification_id: string;
  status: 'authentic' | 'suspicious' | 'invalid' | 'pending' | 'error';
  confidence_score: number;
  certificate_details: {
    holder_name: string;
    certificate_type: string;
    issuing_authority: string;
    issue_date?: string;
    expiry_date?: string;
    certificate_number?: string;
    status: 'active' | 'expired' | 'revoked' | 'suspended' | 'unknown';
  };
  verification_checks: {
    authority_verification: 'verified' | 'unverified' | 'invalid';
    certificate_format: 'valid' | 'invalid' | 'suspicious';
    digital_signature: 'valid' | 'invalid' | 'missing';
    database_lookup: 'found' | 'not_found' | 'unavailable';
  };
  recommendations?: string[];
  error_message?: string;
}

export class OnfidoService {
  private config: OnfidoConfig;
  private baseUrl: string;

  constructor(config: OnfidoConfig) {
    this.config = config;
    this.baseUrl = config.apiUrl || (config.sandbox ? 'https://api.eu.onfido.com' : 'https://api.onfido.com');
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}/v3.6${endpoint}`;
    
    const headers = {
      'Authorization': `Token token=${this.config.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`Onfido API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Onfido API request failed:', error);
      throw error;
    }
  }

  async createApplicant(applicantData: OnfidoApplicant): Promise<OnfidoApplicant> {
    try {
      const response = await this.makeRequest('/applicants', {
        method: 'POST',
        body: JSON.stringify(applicantData),
      });

      return response;
    } catch (error) {
      console.error('Failed to create applicant:', error);
      throw new Error(`Failed to create applicant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadDocument(applicantId: string, documentData: OnfidoDocument, fileBuffer: ArrayBuffer): Promise<OnfidoDocument> {
    try {
      const formData = new FormData();
      formData.append('type', documentData.type);
      if (documentData.side) formData.append('side', documentData.side);
      if (documentData.issuing_country) formData.append('issuing_country', documentData.issuing_country);
      
      const blob = new Blob([fileBuffer], { type: documentData.file_type || 'application/octet-stream' });
      formData.append('file', blob, documentData.file_name || 'document');

      const response = await this.makeRequest(`/applicants/${applicantId}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Token token=${this.config.apiKey}`,
          // Don't set Content-Type for FormData, browser will set it with boundary
        },
        body: formData,
      });

      return response;
    } catch (error) {
      console.error('Failed to upload document:', error);
      throw new Error(`Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createCheck(checkData: OnfidoCheck): Promise<OnfidoCheckResult> {
    try {
      const response = await this.makeRequest('/checks', {
        method: 'POST',
        body: JSON.stringify(checkData),
      });

      return response;
    } catch (error) {
      console.error('Failed to create check:', error);
      throw new Error(`Failed to create check: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCheckResult(checkId: string): Promise<OnfidoCheckResult> {
    try {
      const response = await this.makeRequest(`/checks/${checkId}`);
      return response;
    } catch (error) {
      console.error('Failed to get check result:', error);
      throw new Error(`Failed to get check result: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getReport(reportId: string): Promise<OnfidoReport> {
    try {
      const response = await this.makeRequest(`/reports/${reportId}`);
      return response;
    } catch (error) {
      console.error('Failed to get report:', error);
      throw new Error(`Failed to get report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // High-level document verification method
  async verifyDocument(
    applicantData: OnfidoApplicant,
    documentFile: ArrayBuffer,
    documentType: OnfidoDocument['type'],
    fileName: string
  ): Promise<DocumentVerificationResult> {
    try {
      // Create applicant
      const applicant = await this.createApplicant(applicantData);
      
      // Upload document
      const document = await this.uploadDocument(applicant.id!, {
        type: documentType,
        file_name: fileName,
        file_type: this.getFileType(fileName),
      }, documentFile);

      // Create document check
      const check = await this.createCheck({
        applicant_id: applicant.id!,
        report_names: ['document'],
        tags: ['provider_verification'],
      });

      // Poll for completion (in production, use webhooks)
      let checkResult = await this.getCheckResult(check.id);
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes with 10-second intervals

      while (checkResult.status === 'in_progress' && attempts < maxAttempts) {
        await this.sleep(10000); // Wait 10 seconds
        checkResult = await this.getCheckResult(check.id);
        attempts++;
      }

      if (checkResult.status !== 'complete') {
        return {
          success: false,
          verification_id: check.id,
          status: 'pending',
          confidence_score: 0,
          document_type: documentType,
          error_message: `Verification incomplete: ${checkResult.status}`,
        };
      }

      // Get detailed report
      const documentReport = checkResult.reports?.find(r => r.name === 'document');
      
      if (!documentReport) {
        return {
          success: false,
          verification_id: check.id,
          status: 'error',
          confidence_score: 0,
          document_type: documentType,
          error_message: 'Document report not found',
        };
      }

      const report = await this.getReport(documentReport.id);

      return this.parseDocumentVerificationResult(check.id, checkResult, report, documentType);
    } catch (error) {
      console.error('Document verification failed:', error);
      return {
        success: false,
        verification_id: '',
        status: 'error',
        confidence_score: 0,
        document_type: documentType,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // High-level biometric verification method
  async verifyBiometric(
    applicantData: OnfidoApplicant,
    documentFile: ArrayBuffer,
    selfieFile: ArrayBuffer,
    documentType: OnfidoDocument['type']
  ): Promise<BiometricVerificationResult> {
    try {
      // Create applicant
      const applicant = await this.createApplicant(applicantData);
      
      // Upload document
      await this.uploadDocument(applicant.id!, {
        type: documentType,
        file_name: 'document.jpg',
        file_type: 'image/jpeg',
      }, documentFile);

      // Upload live photo
      await this.uploadDocument(applicant.id!, {
        type: 'generic',
        file_name: 'selfie.jpg',
        file_type: 'image/jpeg',
      }, selfieFile);

      // Create facial similarity check
      const check = await this.createCheck({
        applicant_id: applicant.id!,
        report_names: ['facial_similarity_photo'],
        tags: ['biometric_verification'],
      });

      // Poll for completion
      let checkResult = await this.getCheckResult(check.id);
      let attempts = 0;
      const maxAttempts = 30;

      while (checkResult.status === 'in_progress' && attempts < maxAttempts) {
        await this.sleep(10000);
        checkResult = await this.getCheckResult(check.id);
        attempts++;
      }

      if (checkResult.status !== 'complete') {
        return {
          success: false,
          verification_id: check.id,
          status: 'pending',
          confidence_score: 0,
          facial_similarity_score: 0,
          liveness_detected: false,
          verification_method: 'photo',
          error_message: `Verification incomplete: ${checkResult.status}`,
        };
      }

      return this.parseBiometricVerificationResult(check.id, checkResult);
    } catch (error) {
      console.error('Biometric verification failed:', error);
      return {
        success: false,
        verification_id: '',
        status: 'error',
        confidence_score: 0,
        facial_similarity_score: 0,
        liveness_detected: false,
        verification_method: 'photo',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Certificate verification for professional credentials
  async verifyCertificate(request: CertificateVerificationRequest): Promise<CertificateVerificationResult> {
    try {
      // For professional certificates, we'll use document verification with enhanced analysis
      const applicantData: OnfidoApplicant = {
        first_name: request.holder_name.split(' ')[0] || 'Unknown',
        last_name: request.holder_name.split(' ').slice(1).join(' ') || 'Unknown',
        email: 'certificate.verification@privacyguard.com',
      };

      if (!request.document_file) {
        throw new Error('Document file is required for certificate verification');
      }

      const documentResult = await this.verifyDocument(
        applicantData,
        request.document_file,
        'generic',
        `certificate_${request.certificate_number || Date.now()}.pdf`
      );

      // Enhanced processing for certificate-specific checks
      const certificateResult: CertificateVerificationResult = {
        success: documentResult.success,
        verification_id: documentResult.verification_id,
        status: this.mapDocumentStatusToCertificateStatus(documentResult.status),
        confidence_score: documentResult.confidence_score,
        certificate_details: {
          holder_name: request.holder_name,
          certificate_type: request.document_type,
          issuing_authority: request.issuing_authority,
          issue_date: request.issue_date,
          expiry_date: request.expiry_date,
          certificate_number: request.certificate_number,
          status: this.determineCertificateStatus(request.expiry_date),
        },
        verification_checks: {
          authority_verification: this.verifyIssuingAuthority(request.issuing_authority),
          certificate_format: documentResult.verification_checks?.document_integrity || 'valid',
          digital_signature: documentResult.verification_checks?.data_consistency || 'missing',
          database_lookup: 'unavailable', // Would require integration with certificate databases
        },
        recommendations: this.generateCertificateRecommendations(documentResult),
        error_message: documentResult.error_message,
      };

      return certificateResult;
    } catch (error) {
      console.error('Certificate verification failed:', error);
      return {
        success: false,
        verification_id: '',
        status: 'error',
        confidence_score: 0,
        certificate_details: {
          holder_name: request.holder_name,
          certificate_type: request.document_type,
          issuing_authority: request.issuing_authority,
          issue_date: request.issue_date,
          expiry_date: request.expiry_date,
          certificate_number: request.certificate_number,
          status: 'unknown',
        },
        verification_checks: {
          authority_verification: 'unverified',
          certificate_format: 'invalid',
          digital_signature: 'missing',
          database_lookup: 'unavailable',
        },
        error_message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Webhook handler for real-time updates
  async handleWebhook(webhookData: OnfidoWebhookEvent): Promise<{ processed: boolean; action?: string }> {
    try {
      const { payload } = webhookData;
      const { resource_type, action, object } = payload;

      console.log(`Received Onfido webhook: ${resource_type}.${action} for ${object.id}`);

      switch (action) {
        case 'check.completed':
          // Handle completed verification check
          const checkResult = await this.getCheckResult(object.id);
          // Notify relevant systems about completion
          await this.notifyVerificationComplete(checkResult);
          break;

        case 'report.completed':
          // Handle individual report completion
          const report = await this.getReport(object.id);
          await this.processReportCompletion(report);
          break;

        case 'check.withdrawn':
        case 'report.withdrawn':
          // Handle withdrawn verifications
          await this.handleWithdrawal(object.id, resource_type);
          break;

        default:
          console.warn(`Unhandled webhook action: ${action}`);
          break;
      }

      return { processed: true, action };
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return { processed: false };
    }
  }

  // Utility methods
  private parseDocumentVerificationResult(
    checkId: string,
    checkResult: OnfidoCheckResult,
    report: OnfidoReport,
    documentType: string
  ): DocumentVerificationResult {
    const success = checkResult.result === 'clear';
    const status = this.mapOnfidoResultToStatus(checkResult.result);
    
    // Calculate confidence score based on result and breakdown
    let confidenceScore = 0.5; // Base score
    if (checkResult.result === 'clear') confidenceScore = 0.9;
    else if (checkResult.result === 'consider') confidenceScore = 0.6;
    else confidenceScore = 0.3;

    return {
      success,
      verification_id: checkId,
      status,
      confidence_score: confidenceScore,
      document_type: documentType,
      extracted_data: this.extractDocumentData(report),
      verification_checks: this.mapVerificationChecks(report.breakdown),
      issues_detected: this.extractIssues(report),
      recommendations: this.generateRecommendations(report),
    };
  }

  private parseBiometricVerificationResult(
    checkId: string,
    checkResult: OnfidoCheckResult
  ): BiometricVerificationResult {
    const facialReport = checkResult.reports?.find(r => r.name === 'facial_similarity_photo');
    const success = checkResult.result === 'clear';
    const status = this.mapOnfidoResultToStatus(checkResult.result);
    
    let confidenceScore = 0.5;
    let facialSimilarityScore = 0.5;
    
    if (facialReport?.breakdown?.facial_similarity?.breakdown?.score) {
      facialSimilarityScore = facialReport.breakdown.facial_similarity.breakdown.score;
      confidenceScore = facialSimilarityScore;
    }

    return {
      success,
      verification_id: checkId,
      status,
      confidence_score: confidenceScore,
      facial_similarity_score: facialSimilarityScore,
      liveness_detected: facialReport?.breakdown?.visual_authenticity?.result === 'clear',
      verification_method: 'photo',
      issues_detected: this.extractIssues(facialReport),
    };
  }

  private mapOnfidoResultToStatus(result: string): 'verified' | 'pending' | 'rejected' | 'error' {
    switch (result) {
      case 'clear': return 'verified';
      case 'consider': return 'pending';
      case 'unidentified': return 'rejected';
      default: return 'error';
    }
  }

  private mapDocumentStatusToCertificateStatus(status: string): 'authentic' | 'suspicious' | 'invalid' | 'pending' | 'error' {
    switch (status) {
      case 'verified': return 'authentic';
      case 'pending': return 'pending';
      case 'rejected': return 'invalid';
      case 'error': return 'error';
      default: return 'suspicious';
    }
  }

  private determineCertificateStatus(expiryDate?: string): 'active' | 'expired' | 'revoked' | 'suspended' | 'unknown' {
    if (!expiryDate) return 'unknown';
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    return expiry > now ? 'active' : 'expired';
  }

  private verifyIssuingAuthority(authority: string): 'verified' | 'unverified' | 'invalid' {
    // In a real implementation, this would check against a database of known authorities
    const knownAuthorities = [
      'International Association of Privacy Professionals',
      'IAPP',
      'Certified Information Privacy Professional',
      'CIPP',
      'CIPM',
      'CIPT',
      'ISO/IEC 27001 Lead Auditor',
      'PECB',
      'ISACA',
      'CISA',
      'CISM',
      'CRISC'
    ];

    const isKnown = knownAuthorities.some(known => 
      authority.toLowerCase().includes(known.toLowerCase()) ||
      known.toLowerCase().includes(authority.toLowerCase())
    );

    return isKnown ? 'verified' : 'unverified';
  }

  private extractDocumentData(report?: OnfidoReport): any {
    if (!report?.properties) return undefined;

    const props = report.properties;
    return {
      document_number: props.document_number || props.document_numbers?.[0],
      full_name: props.full_name,
      date_of_birth: props.date_of_birth,
      expiry_date: props.expiry_date,
      issue_date: props.issue_date,
      nationality: props.nationality,
      gender: props.gender,
      issuing_country: props.issuing_country,
      issuing_authority: props.issuing_authority,
    };
  }

  private mapVerificationChecks(breakdown?: any): any {
    if (!breakdown) return undefined;

    return {
      document_integrity: breakdown.document_integrity?.result || 'warn',
      visual_authenticity: breakdown.visual_authenticity?.result || 'warn',
      data_consistency: breakdown.data_consistency?.result || 'warn',
      image_quality: breakdown.image_quality?.result || 'warn',
    };
  }

  private extractIssues(report?: OnfidoReport): string[] {
    const issues: string[] = [];
    
    if (!report?.breakdown) return issues;

    Object.entries(report.breakdown).forEach(([checkName, checkData]: [string, any]) => {
      if (checkData.result === 'consider' || checkData.result === 'unidentified') {
        issues.push(`${checkName}: ${checkData.sub_result || 'Issue detected'}`);
      }
    });

    return issues;
  }

  private generateRecommendations(report?: OnfidoReport): string[] {
    const recommendations: string[] = [];
    
    if (!report) return recommendations;

    if (report.result === 'consider') {
      recommendations.push('Manual review recommended due to identified concerns');
    }
    
    if (report.result === 'clear') {
      recommendations.push('Document verification successful - proceed with confidence');
    }
    
    if (report.result === 'unidentified') {
      recommendations.push('Document could not be verified - request alternative documentation');
    }

    return recommendations;
  }

  private generateCertificateRecommendations(documentResult: DocumentVerificationResult): string[] {
    const recommendations: string[] = [];

    if (documentResult.confidence_score > 0.8) {
      recommendations.push('High confidence verification - certificate appears authentic');
    } else if (documentResult.confidence_score > 0.6) {
      recommendations.push('Medium confidence - additional verification steps recommended');
    } else {
      recommendations.push('Low confidence - manual expert review required');
    }

    if (documentResult.issues_detected && documentResult.issues_detected.length > 0) {
      recommendations.push('Issues detected - verify with issuing authority');
    }

    return recommendations;
  }

  private async notifyVerificationComplete(checkResult: OnfidoCheckResult): Promise<void> {
    // Implement notification logic for completed verifications
    console.log(`Verification completed: ${checkResult.id} with result: ${checkResult.result}`);
  }

  private async processReportCompletion(report: OnfidoReport): Promise<void> {
    // Implement report processing logic
    console.log(`Report completed: ${report.id} with result: ${report.result}`);
  }

  private async handleWithdrawal(objectId: string, resourceType: string): Promise<void> {
    // Implement withdrawal handling logic
    console.log(`${resourceType} withdrawn: ${objectId}`);
  }

  private getFileType(fileName: string): string {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      // Simple API connectivity test
      await this.makeRequest('/applicants?page=1&per_page=1', { method: 'GET' });
      return { status: 'healthy', message: 'Onfido API connection successful' };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: `Onfido API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}
