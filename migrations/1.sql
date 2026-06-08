
-- Organizations table
CREATE TABLE organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  size TEXT,
  country TEXT,
  gdpr_applicable BOOLEAN DEFAULT 1,
  dpo_required BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users and their roles within organizations
CREATE TABLE user_organizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  organization_id INTEGER NOT NULL,
  role TEXT NOT NULL, -- 'admin', 'dpo', 'staff', 'viewer'
  is_primary_dpo BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data processing activities (Record of Processing Activities - RoPA)
CREATE TABLE processing_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  legal_basis TEXT NOT NULL,
  data_categories TEXT, -- JSON array
  data_subjects TEXT, -- JSON array
  recipients TEXT, -- JSON array
  retention_period TEXT,
  security_measures TEXT,
  risk_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'very_high'
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'under_review'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data Protection Impact Assessments
CREATE TABLE dpias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  processing_activity_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  risk_assessment TEXT, -- JSON object with risk analysis
  mitigation_measures TEXT, -- JSON array
  necessity_proportionality TEXT,
  consultation_details TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'under_review', 'approved', 'rejected'
  risk_score INTEGER DEFAULT 0,
  reviewed_by TEXT, -- user_id of reviewer
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data Subject Access Requests (DSAR)
CREATE TABLE data_subject_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  request_type TEXT NOT NULL, -- 'access', 'rectification', 'erasure', 'portability', 'objection', 'restriction'
  subject_email TEXT NOT NULL,
  subject_name TEXT,
  request_details TEXT,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'failed'
  status TEXT DEFAULT 'received', -- 'received', 'in_progress', 'completed', 'rejected'
  response_due_date DATE,
  response_sent_at TIMESTAMP,
  assigned_to TEXT, -- user_id
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data breaches and incidents
CREATE TABLE data_breaches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  incident_type TEXT NOT NULL, -- 'breach', 'near_miss', 'vulnerability'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT NOT NULL,
  affected_data_types TEXT, -- JSON array
  affected_individuals_count INTEGER DEFAULT 0,
  detection_date DATETIME,
  containment_date DATETIME,
  notification_required BOOLEAN DEFAULT 0,
  authority_notified_at TIMESTAMP,
  subjects_notified_at TIMESTAMP,
  root_cause TEXT,
  remediation_actions TEXT, -- JSON array
  status TEXT DEFAULT 'open', -- 'open', 'investigating', 'contained', 'resolved'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance policies and documents
CREATE TABLE compliance_policies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  policy_type TEXT NOT NULL, -- 'privacy_policy', 'cookie_policy', 'data_retention', 'security_policy'
  title TEXT NOT NULL,
  content TEXT,
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'draft', -- 'draft', 'active', 'archived'
  effective_date DATE,
  review_date DATE,
  approved_by TEXT, -- user_id
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI audit trail for accountability
CREATE TABLE ai_audit_trail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'policy_generation', 'risk_assessment', 'dsar_response', 'compliance_check'
  ai_input TEXT, -- The prompt or input given to AI
  ai_output TEXT, -- The AI's response
  human_review_status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'modified', 'rejected'
  human_modifications TEXT,
  final_decision TEXT,
  confidence_score REAL,
  model_version TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor and third-party assessments
CREATE TABLE vendor_assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  vendor_name TEXT NOT NULL,
  vendor_type TEXT, -- 'processor', 'joint_controller', 'recipient'
  assessment_type TEXT DEFAULT 'privacy', -- 'privacy', 'security', 'combined'
  risk_score INTEGER DEFAULT 0,
  dpa_status TEXT DEFAULT 'required', -- 'required', 'in_place', 'under_review'
  last_assessment_date DATE,
  next_review_date DATE,
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'terminated'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training and awareness tracking
CREATE TABLE training_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  training_type TEXT NOT NULL, -- 'gdpr_basics', 'data_handling', 'incident_response', 'dpo_certification'
  completion_status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'expired'
  completion_date DATE,
  expiry_date DATE,
  score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_organizations_user_id ON user_organizations(user_id);
CREATE INDEX idx_user_organizations_org_id ON user_organizations(organization_id);
CREATE INDEX idx_processing_activities_org_id ON processing_activities(organization_id);
CREATE INDEX idx_dpias_org_id ON dpias(organization_id);
CREATE INDEX idx_data_subject_requests_org_id ON data_subject_requests(organization_id);
CREATE INDEX idx_data_breaches_org_id ON data_breaches(organization_id);
CREATE INDEX idx_compliance_policies_org_id ON compliance_policies(organization_id);
CREATE INDEX idx_ai_audit_trail_org_id ON ai_audit_trail(organization_id);
CREATE INDEX idx_vendor_assessments_org_id ON vendor_assessments(organization_id);
CREATE INDEX idx_training_records_org_id ON training_records(organization_id);
