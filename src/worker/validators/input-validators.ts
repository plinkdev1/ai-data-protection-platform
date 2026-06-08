import { z } from 'zod';

// Organization validation schemas
export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(255),
  domain: z.string().optional().refine(
    (val) => !val || /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/.test(val),
    'Invalid domain format'
  ),
  industry: z.string().optional(),
  size: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
  country: z.string().optional(),
  gdpr_applicable: z.boolean().default(true),
  dpo_required: z.boolean().default(false),
});

// Processing Activity validation schemas
export const CreateProcessingActivitySchema = z.object({
  name: z.string().min(1, 'Activity name is required').max(255),
  purpose: z.string().min(1, 'Purpose is required').max(1000),
  legal_basis: z.enum(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),
  data_categories: z.array(z.string()).min(1, 'At least one data category is required'),
  data_subjects: z.array(z.string()).min(1, 'At least one data subject type is required'),
  recipients: z.array(z.string()),
  retention_period: z.string().optional(),
  security_measures: z.string().optional(),
  risk_level: z.enum(['low', 'medium', 'high', 'very_high']).default('medium'),
});

// DPIA validation schemas
export const CreateDPIASchema = z.object({
  title: z.string().min(1, 'DPIA title is required').max(255),
  description: z.string().optional(),
  processing_activity_id: z.number().optional(),
  risk_assessment: z.object({
    likelihood: z.enum(['low', 'medium', 'high']),
    impact: z.enum(['low', 'medium', 'high']),
    risks: z.array(z.string()).min(1, 'At least one risk must be identified'),
  }),
  mitigation_measures: z.array(z.string()).min(1, 'At least one mitigation measure is required'),
  necessity_proportionality: z.string().optional(),
  consultation_details: z.string().optional(),
});

// Data Subject Request validation schemas
export const CreateDataSubjectRequestSchema = z.object({
  request_type: z.enum(['access', 'rectification', 'erasure', 'portability', 'objection', 'restriction']),
  subject_email: z.string().email('Valid email is required'),
  subject_name: z.string().optional(),
  request_details: z.string().optional(),
});

// Data Breach validation schemas
export const CreateDataBreachSchema = z.object({
  incident_type: z.enum(['breach', 'near_miss', 'vulnerability']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(1, 'Description is required').max(2000),
  affected_data_types: z.array(z.string()).min(1, 'At least one affected data type is required'),
  affected_individuals_count: z.number().min(0).default(0),
  detection_date: z.string().optional(),
  containment_date: z.string().optional(),
  notification_required: z.boolean().default(false),
  root_cause: z.string().optional(),
  remediation_actions: z.array(z.string()).min(1, 'At least one remediation action is required'),
});

// AI Input validation schemas
export const PolicyGenerationInputSchema = z.object({
  policyType: z.enum(['privacy_policy', 'cookie_policy', 'data_retention', 'security_policy']),
  context: z.object({
    organizationName: z.string().optional(),
    dataCategories: z.array(z.string()).optional(),
    legalBases: z.array(z.string()).optional(),
    contactEmail: z.string().email().optional(),
    dpoDetails: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    }).optional(),
  }).optional(),
});

export const RiskAssessmentInputSchema = z.object({
  activityName: z.string().min(1, 'Activity name is required'),
  activityPurpose: z.string().min(1, 'Activity purpose is required'),
  dataCategories: z.array(z.string()).min(1, 'At least one data category is required'),
  dataSubjects: z.array(z.string()).min(1, 'At least one data subject type is required'),
  legalBasis: z.string().min(1, 'Legal basis is required'),
  thirdPartySharing: z.boolean(),
  internationalTransfers: z.boolean(),
  automatedDecisionMaking: z.boolean(),
  existingSecurityMeasures: z.array(z.string()),
});

export const DSARResponseInputSchema = z.object({
  requestType: z.enum(['access', 'rectification', 'erasure', 'portability', 'objection', 'restriction']),
  subjectDetails: z.object({
    name: z.string().optional(),
    email: z.string().email('Valid email is required'),
    requestDetails: z.string().optional(),
  }),
  dataHoldings: z.array(z.string()).optional(),
  legalBases: z.array(z.string()).optional(),
});

// Update/Status change validation schemas
export const UpdateStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export const UpdateDSARStatusSchema = z.object({
  status: z.enum(['received', 'in_progress', 'completed', 'rejected']),
  assigned_to: z.string().optional(),
  response_notes: z.string().optional(),
});

export const UpdateDPIAStatusSchema = z.object({
  status: z.enum(['draft', 'under_review', 'approved', 'rejected']),
  review_notes: z.string().optional(),
});

export const UpdateBreachStatusSchema = z.object({
  status: z.enum(['open', 'investigating', 'contained', 'resolved']),
  containment_date: z.string().optional(),
  resolution_notes: z.string().optional(),
  authority_notified_at: z.string().optional(),
  subjects_notified_at: z.string().optional(),
});

// AI Review validation schemas
export const AIReviewSchema = z.object({
  review_status: z.enum(['approved', 'modified', 'rejected']),
  modifications: z.string().optional(),
  review_notes: z.string().optional(),
});

// Query parameter validation schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const DateRangeSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export const FilterSchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  risk_level: z.string().optional(),
  assigned_to: z.string().optional(),
});

// Combined query schemas
export const ListQuerySchema = PaginationSchema.merge(DateRangeSchema).merge(FilterSchema);

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Invalid input format']
    };
  }
}

export function validateAndRespond<T>(schema: z.ZodSchema<T>, data: unknown) {
  const validation = validateInput(schema, data);
  if (!validation.success) {
    return {
      isValid: false as const,
      response: {
        error: 'Validation failed',
        details: validation.errors
      },
      status: 400 as const
    };
  }
  return {
    isValid: true as const,
    data: validation.data
  };
}

// Custom validation rules
export const customValidations = {
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidDomain: (domain: string): boolean => {
    return /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/.test(domain);
  },

  isValidDate: (date: string): boolean => {
    return !isNaN(Date.parse(date));
  },

  isValidPhoneNumber: (phone: string): boolean => {
    return /^\+?[\d\s\-\(\)]{10,}$/.test(phone);
  },

  isWithinDateRange: (date: string, startDate?: string, endDate?: string): boolean => {
    const dateObj = new Date(date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && dateObj < start) return false;
    if (end && dateObj > end) return false;
    return true;
  },

  isValidRetentionPeriod: (period: string): boolean => {
    // Validate retention period format (e.g., "2 years", "6 months", "30 days")
    return /^\d+\s+(days?|months?|years?)$/i.test(period);
  }
};
