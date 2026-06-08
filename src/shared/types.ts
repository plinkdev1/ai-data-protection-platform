import { z } from "zod";

// Organization schemas
export const OrganizationSchema = z.object({
  id: z.number(),
  name: z.string(),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  country: z.string().optional(),
  gdpr_applicable: z.number().int(),
  dpo_required: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Organization = z.infer<typeof OrganizationSchema>;

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1),
  domain: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
  country: z.string().optional(),
  gdpr_applicable: z.boolean().default(true),
  dpo_required: z.boolean().default(false),
});

// User organization role schemas
export const UserOrganizationSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  organization_id: z.number(),
  role: z.enum(['admin', 'dpo', 'staff', 'viewer']),
  is_primary_dpo: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserOrganization = z.infer<typeof UserOrganizationSchema>;

// Processing activities schemas
export const ProcessingActivitySchema = z.object({
  id: z.number(),
  organization_id: z.number(),
  name: z.string(),
  purpose: z.string(),
  legal_basis: z.string(),
  data_categories: z.string(),
  data_subjects: z.string(),
  recipients: z.string(),
  retention_period: z.string().optional(),
  security_measures: z.string().optional(),
  risk_level: z.enum(['low', 'medium', 'high', 'very_high']),
  status: z.enum(['active', 'inactive', 'under_review']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProcessingActivity = z.infer<typeof ProcessingActivitySchema>;

export const CreateProcessingActivitySchema = z.object({
  name: z.string().min(1),
  purpose: z.string().min(1),
  legal_basis: z.enum(['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests']),
  data_categories: z.array(z.string()),
  data_subjects: z.array(z.string()),
  recipients: z.array(z.string()),
  retention_period: z.string().optional(),
  security_measures: z.string().optional(),
  risk_level: z.enum(['low', 'medium', 'high', 'very_high']).default('medium'),
});

// DPIA schemas
export const DPIASchema = z.object({
  id: z.number(),
  organization_id: z.number(),
  processing_activity_id: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  risk_assessment: z.string(),
  mitigation_measures: z.string(),
  necessity_proportionality: z.string().optional(),
  consultation_details: z.string().optional(),
  status: z.enum(['draft', 'under_review', 'approved', 'rejected']),
  risk_score: z.number(),
  reviewed_by: z.string().optional(),
  reviewed_at: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DPIA = z.infer<typeof DPIASchema>;

export const CreateDPIASchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  processing_activity_id: z.number().optional(),
  risk_assessment: z.object({
    likelihood: z.enum(['low', 'medium', 'high']),
    impact: z.enum(['low', 'medium', 'high']),
    risks: z.array(z.string()),
  }),
  mitigation_measures: z.array(z.string()),
  necessity_proportionality: z.string().optional(),
  consultation_details: z.string().optional(),
});

// Data Subject Request schemas
export const DataSubjectRequestSchema = z.object({
  id: z.number(),
  organization_id: z.number(),
  request_type: z.enum(['access', 'rectification', 'erasure', 'portability', 'objection', 'restriction']),
  subject_email: z.string(),
  subject_name: z.string().optional(),
  request_details: z.string().optional(),
  verification_status: z.enum(['pending', 'verified', 'failed']),
  status: z.enum(['received', 'in_progress', 'completed', 'rejected']),
  response_due_date: z.string().optional(),
  response_sent_at: z.string().optional(),
  assigned_to: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DataSubjectRequest = z.infer<typeof DataSubjectRequestSchema>;

export const CreateDataSubjectRequestSchema = z.object({
  request_type: z.enum(['access', 'rectification', 'erasure', 'portability', 'objection', 'restriction']),
  subject_email: z.string().email(),
  subject_name: z.string().optional(),
  request_details: z.string().optional(),
});

// Data Breach schemas
export const DataBreachSchema = z.object({
  id: z.number(),
  organization_id: z.number(),
  incident_type: z.enum(['breach', 'near_miss', 'vulnerability']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string(),
  affected_data_types: z.string(),
  affected_individuals_count: z.number(),
  detection_date: z.string().optional(),
  containment_date: z.string().optional(),
  notification_required: z.number().int(),
  authority_notified_at: z.string().optional(),
  subjects_notified_at: z.string().optional(),
  root_cause: z.string().optional(),
  remediation_actions: z.string(),
  status: z.enum(['open', 'investigating', 'contained', 'resolved']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DataBreach = z.infer<typeof DataBreachSchema>;

export const CreateDataBreachSchema = z.object({
  incident_type: z.enum(['breach', 'near_miss', 'vulnerability']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(1),
  affected_data_types: z.array(z.string()),
  affected_individuals_count: z.number().min(0).default(0),
  detection_date: z.string().optional(),
  containment_date: z.string().optional(),
  notification_required: z.boolean().default(false),
  root_cause: z.string().optional(),
  remediation_actions: z.array(z.string()),
});

// AI Audit Trail schemas
export const AIAuditTrailSchema = z.object({
  id: z.number(),
  organization_id: z.number(),
  user_id: z.string(),
  action_type: z.enum(['policy_generation', 'risk_assessment', 'dsar_response', 'compliance_check']),
  ai_input: z.string(),
  ai_output: z.string(),
  human_review_status: z.enum(['pending', 'approved', 'modified', 'rejected']),
  human_modifications: z.string().optional(),
  final_decision: z.string().optional(),
  confidence_score: z.number().optional(),
  model_version: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type AIAuditTrail = z.infer<typeof AIAuditTrailSchema>;

// Dashboard metrics types
export type DashboardMetrics = {
  totalProcessingActivities: number;
  activeDPIAs: number;
  pendingDSARs: number;
  openBreaches: number;
  complianceScore: number;
  riskTrends: Array<{
    date: string;
    high: number;
    medium: number;
    low: number;
  }>;
  dsarTrends: Array<{
    date: string;
    received: number;
    completed: number;
  }>;
};

// Service Tier schemas
export const ServiceTierSchema = z.object({
  id: z.number(),
  tier_key: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  features: z.string(), // JSON array
  credits_included: z.number(),
  credits_additional: z.number(),
  is_active: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ServiceTier = z.infer<typeof ServiceTierSchema>;

// User Subscription schemas
export const UserSubscriptionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  organization_id: z.number().optional(),
  tier_id: z.number(),
  status: z.enum(['active', 'cancelled', 'expired', 'pending']),
  credits_remaining: z.number(),
  subscription_start: z.string().optional(),
  subscription_end: z.string().optional(),
  auto_renew: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;

// Service Provider schemas
export const ServiceProviderSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  provider_type: z.enum(['freelancer', 'dpo_company']),
  company_name: z.string().optional(),
  business_registration: z.string().optional(),
  specializations: z.string(), // JSON array
  hourly_rate: z.number().optional(),
  availability_hours: z.string().optional(), // JSON object
  bio: z.string().optional(),
  certifications: z.string().optional(), // JSON array
  portfolio_url: z.string().optional(),
  status: z.enum(['pending', 'approved', 'suspended', 'rejected']),
  rating: z.number(),
  total_reviews: z.number(),
  completed_tasks: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ServiceProvider = z.infer<typeof ServiceProviderSchema>;

export const CreateServiceProviderSchema = z.object({
  provider_type: z.enum(['freelancer', 'dpo_company']),
  company_name: z.string().optional(),
  business_registration: z.string().optional(),
  specializations: z.array(z.string()),
  hourly_rate: z.number().min(0).optional(),
  availability_hours: z.object({
    timezone: z.string(),
    schedule: z.record(z.string(), z.array(z.string())), // day -> time slots
  }).optional(),
  bio: z.string().max(1000).optional(),
  certifications: z.array(z.string()),
  portfolio_url: z.string().url().optional(),
});

// Marketplace Service schemas
export const MarketplaceServiceSchema = z.object({
  id: z.number(),
  service_key: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  base_price: z.number(),
  estimated_hours: z.number().optional(),
  complexity_level: z.enum(['basic', 'intermediate', 'advanced']),
  required_tier: z.string().optional(),
  is_active: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type MarketplaceService = z.infer<typeof MarketplaceServiceSchema>;

// Service Request schemas
export const ServiceRequestSchema = z.object({
  id: z.number(),
  client_user_id: z.string(),
  organization_id: z.number(),
  service_id: z.number(),
  provider_id: z.number().optional(),
  title: z.string(),
  description: z.string().optional(),
  requirements: z.string().optional(), // JSON object
  attachments: z.string().optional(), // JSON array
  budget: z.number().optional(),
  deadline: z.string().optional(),
  status: z.enum(['pending', 'assigned', 'in_progress', 'under_review', 'completed', 'cancelled']),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  ai_output: z.string().optional(),
  provider_output: z.string().optional(),
  client_feedback: z.string().optional(),
  provider_notes: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ServiceRequest = z.infer<typeof ServiceRequestSchema>;

export const CreateServiceRequestSchema = z.object({
  service_id: z.number(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  requirements: z.object({
    urgency: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
    specific_needs: z.array(z.string()),
    documents_provided: z.array(z.string()),
    additional_context: z.string().optional(),
  }),
  attachments: z.array(z.string()).optional(),
  budget: z.number().min(0).optional(),
  deadline: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

// Provider Review schemas
export const ProviderReviewSchema = z.object({
  id: z.number(),
  service_request_id: z.number(),
  client_user_id: z.string(),
  provider_id: z.number(),
  rating: z.number().min(1).max(5),
  review_text: z.string().optional(),
  quality_rating: z.number().min(1).max(5),
  communication_rating: z.number().min(1).max(5),
  timeliness_rating: z.number().min(1).max(5),
  would_recommend: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProviderReview = z.infer<typeof ProviderReviewSchema>;

export const CreateProviderReviewSchema = z.object({
  service_request_id: z.number(),
  provider_id: z.number(),
  rating: z.number().min(1).max(5),
  review_text: z.string().max(1000).optional(),
  quality_rating: z.number().min(1).max(5),
  communication_rating: z.number().min(1).max(5),
  timeliness_rating: z.number().min(1).max(5),
  would_recommend: z.boolean().default(true),
});

// Legal Document schemas
export const LegalDocumentSchema = z.object({
  id: z.number(),
  document_type: z.enum(['tos', 'sla', 'dpa', 'freelancer_agreement', 'partnership_agreement']),
  version: z.string(),
  title: z.string(),
  content: z.string(),
  effective_date: z.string().optional(),
  is_active: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type LegalDocument = z.infer<typeof LegalDocumentSchema>;

// FAQ schemas
export const FAQSchema = z.object({
  id: z.number(),
  category: z.enum(['general', 'billing', 'services', 'technical', 'legal']),
  question: z.string(),
  answer: z.string(),
  sort_order: z.number(),
  is_featured: z.number().int(),
  is_active: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type FAQ = z.infer<typeof FAQSchema>;

export const CreateFAQSchema = z.object({
  category: z.enum(['general', 'billing', 'services', 'technical', 'legal']),
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(5000),
  sort_order: z.number().default(0),
  is_featured: z.boolean().default(false),
});

// Credit Transaction schemas
export const CreditTransactionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  organization_id: z.number().optional(),
  transaction_type: z.enum(['purchase', 'usage', 'refund', 'bonus']),
  credits_amount: z.number(),
  service_request_id: z.number().optional(),
  description: z.string().optional(),
  created_at: z.string(),
});

export type CreditTransaction = z.infer<typeof CreditTransactionSchema>;

// Extended Dashboard metrics for marketplace
export type MarketplaceDashboardMetrics = DashboardMetrics & {
  availableProviders: number;
  activeRequests: number;
  completedRequests: number;
  averageRating: number;
  creditsRemaining: number;
  monthlySpend: number;
};

// GraphQL Federation directives
export type FederationDirectives = {
  key?: string;
  external?: boolean;
  requires?: string;
  provides?: string;
};
