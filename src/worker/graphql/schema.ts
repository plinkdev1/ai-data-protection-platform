import { gql } from 'graphql-tag';

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.0", import: ["@key", "@external", "@requires", "@provides"])

  type User @key(fields: "id") {
    id: ID! @external
    organizations: [UserOrganization!]!
  }

  type Organization @key(fields: "id") {
    id: ID!
    name: String!
    domain: String
    industry: String
    size: String
    country: String
    gdprApplicable: Boolean!
    dpoRequired: Boolean!
    processingActivities: [ProcessingActivity!]!
    dpias: [DPIA!]!
    dataSubjectRequests: [DataSubjectRequest!]!
    dataBreaches: [DataBreach!]!
    compliancePolicies: [CompliancePolicy!]!
    dashboardMetrics: DashboardMetrics!
    createdAt: String!
    updatedAt: String!
  }

  type UserOrganization {
    id: ID!
    userId: ID!
    organizationId: ID!
    role: UserRole!
    isPrimaryDpo: Boolean!
    organization: Organization!
    createdAt: String!
    updatedAt: String!
  }

  type ProcessingActivity {
    id: ID!
    organizationId: ID!
    name: String!
    purpose: String!
    legalBasis: LegalBasis!
    dataCategories: [String!]!
    dataSubjects: [String!]!
    recipients: [String!]!
    retentionPeriod: String
    securityMeasures: String
    riskLevel: RiskLevel!
    status: ProcessingStatus!
    createdAt: String!
    updatedAt: String!
  }

  type DPIA {
    id: ID!
    organizationId: ID!
    processingActivityId: ID
    title: String!
    description: String
    riskAssessment: RiskAssessment!
    mitigationMeasures: [String!]!
    necessityProportionality: String
    consultationDetails: String
    status: DPIAStatus!
    riskScore: Int!
    reviewedBy: ID
    reviewedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type DataSubjectRequest {
    id: ID!
    organizationId: ID!
    requestType: DSARType!
    subjectEmail: String!
    subjectName: String
    requestDetails: String
    verificationStatus: VerificationStatus!
    status: DSARStatus!
    responseDueDate: String
    responseSentAt: String
    assignedTo: ID
    createdAt: String!
    updatedAt: String!
  }

  type DataBreach {
    id: ID!
    organizationId: ID!
    incidentType: IncidentType!
    severity: Severity!
    description: String!
    affectedDataTypes: [String!]!
    affectedIndividualsCount: Int!
    detectionDate: String
    containmentDate: String
    notificationRequired: Boolean!
    authorityNotifiedAt: String
    subjectsNotifiedAt: String
    rootCause: String
    remediationActions: [String!]!
    status: BreachStatus!
    createdAt: String!
    updatedAt: String!
  }

  type CompliancePolicy {
    id: ID!
    organizationId: ID!
    policyType: PolicyType!
    title: String!
    content: String
    version: String!
    status: PolicyStatus!
    effectiveDate: String
    reviewDate: String
    approvedBy: ID
    createdAt: String!
    updatedAt: String!
  }

  type AIAuditTrail {
    id: ID!
    organizationId: ID!
    userId: ID!
    actionType: AIActionType!
    aiInput: String!
    aiOutput: String!
    humanReviewStatus: ReviewStatus!
    humanModifications: String
    finalDecision: String
    confidenceScore: Float
    modelVersion: String
    createdAt: String!
    updatedAt: String!
  }

  type DashboardMetrics {
    totalProcessingActivities: Int!
    activeDPIAs: Int!
    pendingDSARs: Int!
    openBreaches: Int!
    complianceScore: Float!
    riskTrends: [RiskTrend!]!
    dsarTrends: [DSARTrend!]!
  }

  type RiskTrend {
    date: String!
    high: Int!
    medium: Int!
    low: Int!
  }

  type DSARTrend {
    date: String!
    received: Int!
    completed: Int!
  }

  type RiskAssessment {
    likelihood: RiskLevel!
    impact: RiskLevel!
    risks: [String!]!
  }

  enum UserRole {
    ADMIN
    DPO
    STAFF
    VIEWER
  }

  enum LegalBasis {
    CONSENT
    CONTRACT
    LEGAL_OBLIGATION
    VITAL_INTERESTS
    PUBLIC_TASK
    LEGITIMATE_INTERESTS
  }

  enum RiskLevel {
    LOW
    MEDIUM
    HIGH
    VERY_HIGH
  }

  enum ProcessingStatus {
    ACTIVE
    INACTIVE
    UNDER_REVIEW
  }

  enum DPIAStatus {
    DRAFT
    UNDER_REVIEW
    APPROVED
    REJECTED
  }

  enum DSARType {
    ACCESS
    RECTIFICATION
    ERASURE
    PORTABILITY
    OBJECTION
    RESTRICTION
  }

  enum DSARStatus {
    RECEIVED
    IN_PROGRESS
    COMPLETED
    REJECTED
  }

  enum VerificationStatus {
    PENDING
    VERIFIED
    FAILED
  }

  enum IncidentType {
    BREACH
    NEAR_MISS
    VULNERABILITY
  }

  enum Severity {
    LOW
    MEDIUM
    HIGH
    CRITICAL
  }

  enum BreachStatus {
    OPEN
    INVESTIGATING
    CONTAINED
    RESOLVED
  }

  enum PolicyType {
    PRIVACY_POLICY
    COOKIE_POLICY
    DATA_RETENTION
    SECURITY_POLICY
  }

  enum PolicyStatus {
    DRAFT
    ACTIVE
    ARCHIVED
  }

  enum AIActionType {
    POLICY_GENERATION
    RISK_ASSESSMENT
    DSAR_RESPONSE
    COMPLIANCE_CHECK
  }

  enum ReviewStatus {
    PENDING
    APPROVED
    MODIFIED
    REJECTED
  }

  input CreateOrganizationInput {
    name: String!
    domain: String
    industry: String
    size: String
    country: String
    gdprApplicable: Boolean = true
    dpoRequired: Boolean = false
  }

  input CreateProcessingActivityInput {
    name: String!
    purpose: String!
    legalBasis: LegalBasis!
    dataCategories: [String!]!
    dataSubjects: [String!]!
    recipients: [String!]!
    retentionPeriod: String
    securityMeasures: String
    riskLevel: RiskLevel = MEDIUM
  }

  input CreateDPIAInput {
    title: String!
    description: String
    processingActivityId: ID
    riskAssessment: RiskAssessmentInput!
    mitigationMeasures: [String!]!
    necessityProportionality: String
    consultationDetails: String
  }

  input RiskAssessmentInput {
    likelihood: RiskLevel!
    impact: RiskLevel!
    risks: [String!]!
  }

  input CreateDataSubjectRequestInput {
    requestType: DSARType!
    subjectEmail: String!
    subjectName: String
    requestDetails: String
  }

  input CreateDataBreachInput {
    incidentType: IncidentType!
    severity: Severity!
    description: String!
    affectedDataTypes: [String!]!
    affectedIndividualsCount: Int = 0
    detectionDate: String
    containmentDate: String
    notificationRequired: Boolean = false
    rootCause: String
    remediationActions: [String!]!
  }

  type Query {
    organization(id: ID!): Organization
    organizations: [Organization!]!
    userOrganizations: [UserOrganization!]!
    processingActivity(id: ID!): ProcessingActivity
    dpia(id: ID!): DPIA
    dataSubjectRequest(id: ID!): DataSubjectRequest
    dataBreach(id: ID!): DataBreach
    aiAuditTrail(organizationId: ID!): [AIAuditTrail!]!
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization!
    createProcessingActivity(organizationId: ID!, input: CreateProcessingActivityInput!): ProcessingActivity!
    createDPIA(organizationId: ID!, input: CreateDPIAInput!): DPIA!
    createDataSubjectRequest(organizationId: ID!, input: CreateDataSubjectRequestInput!): DataSubjectRequest!
    createDataBreach(organizationId: ID!, input: CreateDataBreachInput!): DataBreach!
    updateDSARStatus(id: ID!, status: DSARStatus!): DataSubjectRequest!
    updateDPIAStatus(id: ID!, status: DPIAStatus!): DPIA!
    reviewAIOutput(id: ID!, status: ReviewStatus!, modifications: String): AIAuditTrail!
  }
`;
