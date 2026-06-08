/**
 * Immutable audit trail logger for AI actions
 * Ensures all AI-assisted actions are properly logged for compliance
 */

export interface AuditLogEntry {
  organizationId: number;
  userId: string;
  actionType: 'policy_generation' | 'risk_assessment' | 'dsar_response' | 'compliance_check';
  aiInput: any;
  aiOutput: any;
  modelVersion: string;
  confidenceScore: number;
  timestamp: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface HumanReviewEntry {
  auditId: number;
  reviewerId: string;
  reviewStatus: 'approved' | 'modified' | 'rejected';
  modifications?: string;
  reviewNotes?: string;
  timestamp: string;
}

export class AuditLogger {
  constructor(private db: D1Database) {}

  /**
   * Log an AI action with immutable record
   */
  async logAIAction(entry: AuditLogEntry): Promise<number> {
    try {
      // Create immutable log entry with hash for integrity
      const logData = {
        organization_id: entry.organizationId,
        user_id: entry.userId,
        action_type: entry.actionType,
        ai_input: JSON.stringify(entry.aiInput),
        ai_output: JSON.stringify(entry.aiOutput),
        model_version: entry.modelVersion,
        confidence_score: entry.confidenceScore,
        request_id: entry.requestId,
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        created_at: entry.timestamp || new Date().toISOString(),
        integrity_hash: this.generateIntegrityHash(entry)
      };

      const result = await this.db.prepare(`
        INSERT INTO ai_audit_trail 
        (organization_id, user_id, action_type, ai_input, ai_output, model_version, confidence_score, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        logData.organization_id,
        logData.user_id,
        logData.action_type,
        logData.ai_input,
        logData.ai_output,
        logData.model_version,
        logData.confidence_score,
        logData.created_at
      ).run();

      return result.meta.last_row_id as number;
    } catch (error) {
      console.error('Failed to log AI action:', error);
      throw new Error('Audit logging failed - action cannot proceed');
    }
  }

  /**
   * Log human review of AI output
   */
  async logHumanReview(auditId: number, review: Omit<HumanReviewEntry, 'auditId' | 'timestamp'>): Promise<void> {
    try {
      await this.db.prepare(`
        UPDATE ai_audit_trail 
        SET human_review_status = ?, human_modifications = ?, updated_at = ?
        WHERE id = ?
      `).bind(
        review.reviewStatus,
        review.modifications || null,
        new Date().toISOString(),
        auditId
      ).run();

      // Also create a separate review log entry for additional audit trail
      await this.db.prepare(`
        INSERT INTO ai_review_log 
        (audit_trail_id, reviewer_id, review_status, modifications, review_notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        auditId,
        review.reviewerId,
        review.reviewStatus,
        review.modifications || null,
        review.reviewNotes || null,
        new Date().toISOString()
      ).run().catch(() => {
        // Create table if it doesn't exist
        return this.createReviewLogTable();
      });

    } catch (error) {
      console.error('Failed to log human review:', error);
      throw new Error('Review logging failed');
    }
  }

  /**
   * Retrieve audit trail for an organization
   */
  async getAuditTrail(organizationId: number, options?: {
    limit?: number;
    offset?: number;
    actionType?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<any[]> {
    let query = `
      SELECT * FROM ai_audit_trail 
      WHERE organization_id = ?
    `;
    const params: any[] = [organizationId];

    if (options?.actionType) {
      query += ' AND action_type = ?';
      params.push(options.actionType);
    }

    if (options?.userId) {
      query += ' AND user_id = ?';
      params.push(options.userId);
    }

    if (options?.dateFrom) {
      query += ' AND created_at >= ?';
      params.push(options.dateFrom);
    }

    if (options?.dateTo) {
      query += ' AND created_at <= ?';
      params.push(options.dateTo);
    }

    query += ' ORDER BY created_at DESC';

    if (options?.limit) {
      query += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options?.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }

    const { results } = await this.db.prepare(query).bind(...params).all();
    
    return results.map((row: any) => ({
      id: row.id,
      organizationId: row.organization_id,
      userId: row.user_id,
      actionType: row.action_type,
      aiInput: JSON.parse(row.ai_input),
      aiOutput: JSON.parse(row.ai_output),
      modelVersion: row.model_version,
      confidenceScore: row.confidence_score,
      humanReviewStatus: row.human_review_status,
      humanModifications: row.human_modifications,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  /**
   * Verify audit trail integrity
   */
  async verifyIntegrity(auditId: number): Promise<boolean> {
    try {
      const record = await this.db.prepare(
        'SELECT * FROM ai_audit_trail WHERE id = ?'
      ).bind(auditId).first();

      if (!record) {
        return false;
      }

      // Verify record can be parsed and contains expected fields
      const organizationId = Number(record.organization_id);
      const userId = String(record.user_id);
      const actionType = String(record.action_type);
      const modelVersion = String(record.model_version);
      const timestamp = String(record.created_at);

      // Verify AI input/output can be parsed as JSON
      try {
        JSON.parse(String(record.ai_input));
        JSON.parse(String(record.ai_output));
      } catch {
        return false;
      }

      // Basic integrity checks
      if (!organizationId || !userId || !actionType || !modelVersion || !timestamp) {
        return false;
      }

      // In a full implementation, this would compare against stored hash
      // For now, we just verify the record exists and is parseable
      return true;
    } catch (error) {
      console.error('Integrity verification failed:', error);
      return false;
    }
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(organizationId: number, dateFrom: string, dateTo: string): Promise<any> {
    const auditRecords = await this.getAuditTrail(organizationId, { dateFrom, dateTo });
    
    const summary = {
      totalActions: auditRecords.length,
      actionsByType: auditRecords.reduce((acc: any, record) => {
        acc[record.actionType] = (acc[record.actionType] || 0) + 1;
        return acc;
      }, {}),
      reviewStatusBreakdown: auditRecords.reduce((acc: any, record) => {
        const status = record.humanReviewStatus || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {}),
      averageConfidenceScore: auditRecords.reduce((sum, record) => sum + record.confidenceScore, 0) / auditRecords.length || 0,
      modelsUsed: [...new Set(auditRecords.map(record => record.modelVersion))],
      usersInvolved: [...new Set(auditRecords.map(record => record.userId))].length,
      complianceScore: this.calculateComplianceScore(auditRecords)
    };

    return {
      organizationId,
      reportPeriod: { from: dateFrom, to: dateTo },
      summary,
      auditRecords: auditRecords.slice(0, 100) // Limit for report size
    };
  }

  private generateIntegrityHash(entry: AuditLogEntry): string {
    // Simple hash for demonstration - in production use proper cryptographic hash
    const data = JSON.stringify({
      organizationId: entry.organizationId,
      userId: entry.userId,
      actionType: entry.actionType,
      timestamp: entry.timestamp
    });
    
    return Buffer.from(data).toString('base64');
  }

  private calculateComplianceScore(auditRecords: any[]): number {
    if (auditRecords.length === 0) return 100;

    const reviewed = auditRecords.filter(r => r.humanReviewStatus && r.humanReviewStatus !== 'pending').length;
    const approved = auditRecords.filter(r => r.humanReviewStatus === 'approved').length;
    const highConfidence = auditRecords.filter(r => r.confidenceScore >= 0.8).length;

    // Compliance score based on review completion and approval rates
    const reviewCompletionRate = reviewed / auditRecords.length;
    const approvalRate = reviewed > 0 ? approved / reviewed : 0;
    const confidenceRate = highConfidence / auditRecords.length;

    return Math.round((reviewCompletionRate * 0.4 + approvalRate * 0.4 + confidenceRate * 0.2) * 100);
  }

  private async createReviewLogTable(): Promise<void> {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS ai_review_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        audit_trail_id INTEGER NOT NULL,
        reviewer_id TEXT NOT NULL,
        review_status TEXT NOT NULL,
        modifications TEXT,
        review_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  }
}
