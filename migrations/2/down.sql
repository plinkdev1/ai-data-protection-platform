
-- Remove indexes in reverse order
DROP INDEX IF EXISTS idx_ai_generated_content_status;
DROP INDEX IF EXISTS idx_ai_generated_content_org;
DROP INDEX IF EXISTS idx_ai_review_log_audit_trail;
DROP INDEX IF EXISTS idx_ai_audit_trail_created_at;
DROP INDEX IF EXISTS idx_ai_audit_trail_action_type;
DROP INDEX IF EXISTS idx_ai_audit_trail_org_user;

-- Drop tables in reverse order
DROP TABLE IF EXISTS ai_generated_content;
DROP TABLE IF EXISTS ai_review_log;
