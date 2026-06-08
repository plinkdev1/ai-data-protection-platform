import { MochaUser } from '@getmocha/users-service/shared';

interface Context {
  user?: MochaUser;
  env: Env;
}

type GraphQLResolverArgs<T = any> = T;

export const resolvers: any = {
  User: {
    __resolveReference: async (user: { id: string }) => {
      return { id: user.id };
    },
    organizations: async (user: { id: string }, _args: GraphQLResolverArgs, context: Context) => {
      const { results } = await context.env.DB.prepare(
        `SELECT uo.*, o.name as organization_name 
         FROM user_organizations uo 
         JOIN organizations o ON uo.organization_id = o.id 
         WHERE uo.user_id = ?`
      ).bind(user.id).all();
      
      return results.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        organizationId: row.organization_id,
        role: row.role.toUpperCase(),
        isPrimaryDpo: Boolean(row.is_primary_dpo),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },
  },

  Organization: {
    __resolveReference: async (org: { id: string }, _args: GraphQLResolverArgs, context: Context) => {
      const result = await context.env.DB.prepare(
        'SELECT * FROM organizations WHERE id = ?'
      ).bind(org.id).first();
      
      if (!result) return null;
      
      return {
        id: result.id,
        name: result.name,
        domain: result.domain,
        industry: result.industry,
        size: result.size,
        country: result.country,
        gdprApplicable: Boolean(result.gdpr_applicable),
        dpoRequired: Boolean(result.dpo_required),
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };
    },
    processingActivities: async (org: { id: string }, _args: GraphQLResolverArgs, context: Context) => {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM processing_activities WHERE organization_id = ? ORDER BY created_at DESC'
      ).bind(org.id).all();
      
      return results.map((row: any) => ({
        id: row.id,
        organizationId: row.organization_id,
        name: row.name,
        purpose: row.purpose,
        legalBasis: row.legal_basis.toUpperCase(),
        dataCategories: JSON.parse(row.data_categories || '[]'),
        dataSubjects: JSON.parse(row.data_subjects || '[]'),
        recipients: JSON.parse(row.recipients || '[]'),
        retentionPeriod: row.retention_period,
        securityMeasures: row.security_measures,
        riskLevel: row.risk_level.toUpperCase(),
        status: row.status.toUpperCase(),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },
    dpias: async (org: { id: string }, _args: GraphQLResolverArgs, context: Context) => {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM dpias WHERE organization_id = ? ORDER BY created_at DESC'
      ).bind(org.id).all();
      
      return results.map((row: any) => ({
        id: row.id,
        organizationId: row.organization_id,
        processingActivityId: row.processing_activity_id,
        title: row.title,
        description: row.description,
        riskAssessment: JSON.parse(row.risk_assessment || '{}'),
        mitigationMeasures: JSON.parse(row.mitigation_measures || '[]'),
        necessityProportionality: row.necessity_proportionality,
        consultationDetails: row.consultation_details,
        status: row.status.toUpperCase(),
        riskScore: row.risk_score,
        reviewedBy: row.reviewed_by,
        reviewedAt: row.reviewed_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },
    dataSubjectRequests: async (org: { id: string }, _args: GraphQLResolverArgs, context: Context) => {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM data_subject_requests WHERE organization_id = ? ORDER BY created_at DESC'
      ).bind(org.id).all();
      
      return results.map((row: any) => ({
        id: row.id,
        organizationId: row.organization_id,
        requestType: row.request_type.toUpperCase(),
        subjectEmail: row.subject_email,
        subjectName: row.subject_name,
        requestDetails: row.request_details,
        verificationStatus: row.verification_status.toUpperCase(),
        status: row.status.toUpperCase(),
        responseDueDate: row.response_due_date,
        responseSentAt: row.response_sent_at,
        assignedTo: row.assigned_to,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },
    dataBreaches: async (org: { id: string }, _args: GraphQLResolverArgs, context: Context) => {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM data_breaches WHERE organization_id = ? ORDER BY created_at DESC'
      ).bind(org.id).all();
      
      return results.map((row: any) => ({
        id: row.id,
        organizationId: row.organization_id,
        incidentType: row.incident_type.toUpperCase(),
        severity: row.severity.toUpperCase(),
        description: row.description,
        affectedDataTypes: JSON.parse(row.affected_data_types || '[]'),
        affectedIndividualsCount: row.affected_individuals_count,
        detectionDate: row.detection_date,
        containmentDate: row.containment_date,
        notificationRequired: Boolean(row.notification_required),
        authorityNotifiedAt: row.authority_notified_at,
        subjectsNotifiedAt: row.subjects_notified_at,
        rootCause: row.root_cause,
        remediationActions: JSON.parse(row.remediation_actions || '[]'),
        status: row.status.toUpperCase(),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },
    compliancePolicies: async (org: { id: string }, _args: GraphQLResolverArgs, context: Context) => {
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM compliance_policies WHERE organization_id = ? ORDER BY created_at DESC'
      ).bind(org.id).all();
      
      return results.map((row: any) => ({
        id: row.id,
        organizationId: row.organization_id,
        policyType: row.policy_type.toUpperCase(),
        title: row.title,
        content: row.content,
        version: row.version,
        status: row.status.toUpperCase(),
        effectiveDate: row.effective_date,
        reviewDate: row.review_date,
        approvedBy: row.approved_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },
    dashboardMetrics: async (org: { id: string }, _args: GraphQLResolverArgs, context: Context) => {
      // Get basic counts
      const [activitiesCount, dpiasCount, dsarsCount, breachesCount] = await Promise.all([
        context.env.DB.prepare('SELECT COUNT(*) as count FROM processing_activities WHERE organization_id = ?').bind(org.id).first(),
        context.env.DB.prepare('SELECT COUNT(*) as count FROM dpias WHERE organization_id = ? AND status != "approved"').bind(org.id).first(),
        context.env.DB.prepare('SELECT COUNT(*) as count FROM data_subject_requests WHERE organization_id = ? AND status != "completed"').bind(org.id).first(),
        context.env.DB.prepare('SELECT COUNT(*) as count FROM data_breaches WHERE organization_id = ? AND status != "resolved"').bind(org.id).first(),
      ]);
      
      // Calculate compliance score (simplified)
      const totalItems = Number(activitiesCount?.count || 0) + Number(dpiasCount?.count || 0);
      const completedItems = Number(activitiesCount?.count || 0);
      const complianceScore = totalItems > 0 ? (completedItems / totalItems) * 100 : 100;
      
      return {
        totalProcessingActivities: Number(activitiesCount?.count || 0),
        activeDPIAs: Number(dpiasCount?.count || 0),
        pendingDSARs: Number(dsarsCount?.count || 0),
        openBreaches: Number(breachesCount?.count || 0),
        complianceScore,
        riskTrends: [], // Would be populated with actual trend data
        dsarTrends: [], // Would be populated with actual trend data
      };
    },
  },

  UserOrganization: {
    organization: async (userOrg: { organizationId: string }, _args: GraphQLResolverArgs, context: Context) => {
      const result = await context.env.DB.prepare(
        'SELECT * FROM organizations WHERE id = ?'
      ).bind(userOrg.organizationId).first();
      
      if (!result) return null;
      
      return {
        id: result.id,
        name: result.name,
        domain: result.domain,
        industry: result.industry,
        size: result.size,
        country: result.country,
        gdprApplicable: Boolean(result.gdpr_applicable),
        dpoRequired: Boolean(result.dpo_required),
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };
    },
  },

  Query: {
    organization: async (_parent: any, { id }: { id: string }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const result = await context.env.DB.prepare(
        'SELECT * FROM organizations WHERE id = ?'
      ).bind(id).first();
      
      if (!result) return null;
      
      return {
        id: result.id,
        name: result.name,
        domain: result.domain,
        industry: result.industry,
        size: result.size,
        country: result.country,
        gdprApplicable: Boolean(result.gdpr_applicable),
        dpoRequired: Boolean(result.dpo_required),
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };
    },
    
    organizations: async (_parent: any, _args: GraphQLResolverArgs, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const { results } = await context.env.DB.prepare(`
        SELECT o.* FROM organizations o 
        JOIN user_organizations uo ON o.id = uo.organization_id 
        WHERE uo.user_id = ?
      `).bind(context.user.id).all();
      
      return results.map((row: any) => ({
        id: row.id,
        name: row.name,
        domain: row.domain,
        industry: row.industry,
        size: row.size,
        country: row.country,
        gdprApplicable: Boolean(row.gdpr_applicable),
        dpoRequired: Boolean(row.dpo_required),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },

    userOrganizations: async (_parent: any, _args: GraphQLResolverArgs, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM user_organizations WHERE user_id = ?'
      ).bind(context.user.id).all();
      
      return results.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        organizationId: row.organization_id,
        role: row.role.toUpperCase(),
        isPrimaryDpo: Boolean(row.is_primary_dpo),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },

    aiAuditTrail: async (_parent: any, { organizationId }: { organizationId: string }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const { results } = await context.env.DB.prepare(
        'SELECT * FROM ai_audit_trail WHERE organization_id = ? ORDER BY created_at DESC'
      ).bind(organizationId).all();
      
      return results.map((row: any) => ({
        id: row.id,
        organizationId: row.organization_id,
        userId: row.user_id,
        actionType: row.action_type.toUpperCase(),
        aiInput: row.ai_input,
        aiOutput: row.ai_output,
        humanReviewStatus: row.human_review_status.toUpperCase(),
        humanModifications: row.human_modifications,
        finalDecision: row.final_decision,
        confidenceScore: row.confidence_score,
        modelVersion: row.model_version,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    },
  },

  Mutation: {
    createOrganization: async (_parent: any, { input }: { input: any }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const result = await context.env.DB.prepare(`
        INSERT INTO organizations (name, domain, industry, size, country, gdpr_applicable, dpo_required)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        input.name,
        input.domain,
        input.industry,
        input.size,
        input.country,
        input.gdprApplicable ? 1 : 0,
        input.dpoRequired ? 1 : 0
      ).run();
      
      // Add user as admin
      await context.env.DB.prepare(`
        INSERT INTO user_organizations (user_id, organization_id, role, is_primary_dpo)
        VALUES (?, ?, 'admin', ?)
      `).bind(
        context.user!.id,
        result.meta.last_row_id,
        input.dpoRequired ? 1 : 0
      ).run();
      
      const org = await context.env.DB.prepare(
        'SELECT * FROM organizations WHERE id = ?'
      ).bind(result.meta.last_row_id).first() as any;
      
      return {
        id: org.id,
        name: org.name,
        domain: org.domain,
        industry: org.industry,
        size: org.size,
        country: org.country,
        gdprApplicable: Boolean(org.gdpr_applicable),
        dpoRequired: Boolean(org.dpo_required),
        createdAt: org.created_at,
        updatedAt: org.updated_at,
      };
    },

    createProcessingActivity: async (_parent: any, { organizationId, input }: { organizationId: string; input: any }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const result = await context.env.DB.prepare(`
        INSERT INTO processing_activities 
        (organization_id, name, purpose, legal_basis, data_categories, data_subjects, recipients, retention_period, security_measures, risk_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        organizationId,
        input.name,
        input.purpose,
        input.legalBasis.toLowerCase(),
        JSON.stringify(input.dataCategories),
        JSON.stringify(input.dataSubjects),
        JSON.stringify(input.recipients),
        input.retentionPeriod,
        input.securityMeasures,
        input.riskLevel.toLowerCase()
      ).run();
      
      const activity = await context.env.DB.prepare(
        'SELECT * FROM processing_activities WHERE id = ?'
      ).bind(result.meta.last_row_id).first() as any;
      
      return {
        id: activity.id,
        organizationId: activity.organization_id,
        name: activity.name,
        purpose: activity.purpose,
        legalBasis: activity.legal_basis.toUpperCase(),
        dataCategories: JSON.parse(activity.data_categories || '[]'),
        dataSubjects: JSON.parse(activity.data_subjects || '[]'),
        recipients: JSON.parse(activity.recipients || '[]'),
        retentionPeriod: activity.retention_period,
        securityMeasures: activity.security_measures,
        riskLevel: activity.risk_level.toUpperCase(),
        status: activity.status.toUpperCase(),
        createdAt: activity.created_at,
        updatedAt: activity.updated_at,
      };
    },

    createDPIA: async (_parent: any, { organizationId, input }: { organizationId: string; input: any }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      // Calculate risk score based on likelihood and impact
      const riskLevels = { low: 1, medium: 2, high: 3, very_high: 4 };
      const likelihood = riskLevels[input.riskAssessment.likelihood.toLowerCase() as keyof typeof riskLevels] || 2;
      const impact = riskLevels[input.riskAssessment.impact.toLowerCase() as keyof typeof riskLevels] || 2;
      const riskScore = likelihood * impact;
      
      const result = await context.env.DB.prepare(`
        INSERT INTO dpias 
        (organization_id, processing_activity_id, title, description, risk_assessment, mitigation_measures, necessity_proportionality, consultation_details, risk_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        organizationId,
        input.processingActivityId,
        input.title,
        input.description,
        JSON.stringify(input.riskAssessment),
        JSON.stringify(input.mitigationMeasures),
        input.necessityProportionality,
        input.consultationDetails,
        riskScore
      ).run();
      
      const dpia = await context.env.DB.prepare(
        'SELECT * FROM dpias WHERE id = ?'
      ).bind(result.meta.last_row_id).first() as any;
      
      return {
        id: dpia.id,
        organizationId: dpia.organization_id,
        processingActivityId: dpia.processing_activity_id,
        title: dpia.title,
        description: dpia.description,
        riskAssessment: JSON.parse(dpia.risk_assessment || '{}'),
        mitigationMeasures: JSON.parse(dpia.mitigation_measures || '[]'),
        necessityProportionality: dpia.necessity_proportionality,
        consultationDetails: dpia.consultation_details,
        status: dpia.status.toUpperCase(),
        riskScore: dpia.risk_score,
        reviewedBy: dpia.reviewed_by,
        reviewedAt: dpia.reviewed_at,
        createdAt: dpia.created_at,
        updatedAt: dpia.updated_at,
      };
    },

    createDataSubjectRequest: async (_parent: any, { organizationId, input }: { organizationId: string; input: any }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      // Calculate response due date (30 days from now)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      const result = await context.env.DB.prepare(`
        INSERT INTO data_subject_requests 
        (organization_id, request_type, subject_email, subject_name, request_details, response_due_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        organizationId,
        input.requestType.toLowerCase(),
        input.subjectEmail,
        input.subjectName,
        input.requestDetails,
        dueDate.toISOString().split('T')[0]
      ).run();
      
      const dsar = await context.env.DB.prepare(
        'SELECT * FROM data_subject_requests WHERE id = ?'
      ).bind(result.meta.last_row_id).first() as any;
      
      return {
        id: dsar.id,
        organizationId: dsar.organization_id,
        requestType: dsar.request_type.toUpperCase(),
        subjectEmail: dsar.subject_email,
        subjectName: dsar.subject_name,
        requestDetails: dsar.request_details,
        verificationStatus: dsar.verification_status.toUpperCase(),
        status: dsar.status.toUpperCase(),
        responseDueDate: dsar.response_due_date,
        responseSentAt: dsar.response_sent_at,
        assignedTo: dsar.assigned_to,
        createdAt: dsar.created_at,
        updatedAt: dsar.updated_at,
      };
    },

    createDataBreach: async (_parent: any, { organizationId, input }: { organizationId: string; input: any }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const result = await context.env.DB.prepare(`
        INSERT INTO data_breaches 
        (organization_id, incident_type, severity, description, affected_data_types, affected_individuals_count, detection_date, containment_date, notification_required, root_cause, remediation_actions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        organizationId,
        input.incidentType.toLowerCase(),
        input.severity.toLowerCase(),
        input.description,
        JSON.stringify(input.affectedDataTypes),
        input.affectedIndividualsCount,
        input.detectionDate,
        input.containmentDate,
        input.notificationRequired ? 1 : 0,
        input.rootCause,
        JSON.stringify(input.remediationActions)
      ).run();
      
      const breach = await context.env.DB.prepare(
        'SELECT * FROM data_breaches WHERE id = ?'
      ).bind(result.meta.last_row_id).first() as any;
      
      return {
        id: breach.id,
        organizationId: breach.organization_id,
        incidentType: breach.incident_type.toUpperCase(),
        severity: breach.severity.toUpperCase(),
        description: breach.description,
        affectedDataTypes: JSON.parse(breach.affected_data_types || '[]'),
        affectedIndividualsCount: breach.affected_individuals_count,
        detectionDate: breach.detection_date,
        containmentDate: breach.containment_date,
        notificationRequired: Boolean(breach.notification_required),
        authorityNotifiedAt: breach.authority_notified_at,
        subjectsNotifiedAt: breach.subjects_notified_at,
        rootCause: breach.root_cause,
        remediationActions: JSON.parse(breach.remediation_actions || '[]'),
        status: breach.status.toUpperCase(),
        createdAt: breach.created_at,
        updatedAt: breach.updated_at,
      };
    },

    updateDSARStatus: async (_parent: any, { id, status }: { id: string; status: string }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      await context.env.DB.prepare(
        'UPDATE data_subject_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(status.toLowerCase(), id).run();
      
      const dsar = await context.env.DB.prepare(
        'SELECT * FROM data_subject_requests WHERE id = ?'
      ).bind(id).first() as any;
      
      return {
        id: dsar.id,
        organizationId: dsar.organization_id,
        requestType: dsar.request_type.toUpperCase(),
        subjectEmail: dsar.subject_email,
        subjectName: dsar.subject_name,
        requestDetails: dsar.request_details,
        verificationStatus: dsar.verification_status.toUpperCase(),
        status: dsar.status.toUpperCase(),
        responseDueDate: dsar.response_due_date,
        responseSentAt: dsar.response_sent_at,
        assignedTo: dsar.assigned_to,
        createdAt: dsar.created_at,
        updatedAt: dsar.updated_at,
      };
    },

    updateDPIAStatus: async (_parent: any, { id, status }: { id: string; status: string }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      await context.env.DB.prepare(
        'UPDATE dpias SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(status.toLowerCase(), context.user.id, id).run();
      
      const dpia = await context.env.DB.prepare(
        'SELECT * FROM dpias WHERE id = ?'
      ).bind(id).first() as any;
      
      return {
        id: dpia.id,
        organizationId: dpia.organization_id,
        processingActivityId: dpia.processing_activity_id,
        title: dpia.title,
        description: dpia.description,
        riskAssessment: JSON.parse(dpia.risk_assessment || '{}'),
        mitigationMeasures: JSON.parse(dpia.mitigation_measures || '[]'),
        necessityProportionality: dpia.necessity_proportionality,
        consultationDetails: dpia.consultation_details,
        status: dpia.status.toUpperCase(),
        riskScore: dpia.risk_score,
        reviewedBy: dpia.reviewed_by,
        reviewedAt: dpia.reviewed_at,
        createdAt: dpia.created_at,
        updatedAt: dpia.updated_at,
      };
    },

    reviewAIOutput: async (_parent: any, { id, status, modifications }: { id: string; status: string; modifications?: string }, context: Context) => {
      if (!context.user) throw new Error('Authentication required');
      
      await context.env.DB.prepare(
        'UPDATE ai_audit_trail SET human_review_status = ?, human_modifications = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(status.toLowerCase(), modifications, id).run();
      
      const audit = await context.env.DB.prepare(
        'SELECT * FROM ai_audit_trail WHERE id = ?'
      ).bind(id).first() as any;
      
      return {
        id: audit.id,
        organizationId: audit.organization_id,
        userId: audit.user_id,
        actionType: audit.action_type.toUpperCase(),
        aiInput: audit.ai_input,
        aiOutput: audit.ai_output,
        humanReviewStatus: audit.human_review_status.toUpperCase(),
        humanModifications: audit.human_modifications,
        finalDecision: audit.final_decision,
        confidenceScore: audit.confidence_score,
        modelVersion: audit.model_version,
        createdAt: audit.created_at,
        updatedAt: audit.updated_at,
      };
    },
  },
};
