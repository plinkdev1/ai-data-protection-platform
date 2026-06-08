
-- Add audit trail enhancements
CREATE TABLE IF NOT EXISTS ai_review_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  audit_trail_id INTEGER NOT NULL,
  reviewer_id TEXT NOT NULL,
  review_status TEXT NOT NULL,
  modifications TEXT,
  review_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for storing AI-generated content before approval
CREATE TABLE IF NOT EXISTS ai_generated_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization_id INTEGER NOT NULL,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  ai_confidence REAL,
  model_version TEXT,
  status TEXT DEFAULT 'pending',
  created_by TEXT NOT NULL,
  approved_by TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_ai_audit_trail_org_user ON ai_audit_trail(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_ai_audit_trail_action_type ON ai_audit_trail(action_type);
CREATE INDEX IF NOT EXISTS idx_ai_audit_trail_created_at ON ai_audit_trail(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_review_log_audit_trail ON ai_review_log(audit_trail_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_content_org ON ai_generated_content(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_content_status ON ai_generated_content(status);
