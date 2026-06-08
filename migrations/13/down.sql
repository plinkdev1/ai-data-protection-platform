
-- Remove the additional policies added
DELETE FROM policy_catalog WHERE policy_key IN (
  'gdpr_breach_notification_policy',
  'gdpr_consent_management_policy', 
  'sox_compliance_policy',
  'ferpa_privacy_policy',
  'iso27001_isms_policy',
  'whistleblower_protection_policy',
  'quantum_computing_security_policy',
  'sustainability_esg_policy'
);
