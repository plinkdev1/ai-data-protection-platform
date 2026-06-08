
-- Remove the additional comprehensive policies
DELETE FROM policy_catalog WHERE policy_key IN (
  'gdpr_cookie_policy',
  'data_minimization_policy',
  'cybersecurity_incident_response',
  'remote_work_security_policy',
  'supply_chain_security_policy',
  'financial_data_protection_policy',
  'healthcare_hipaa_policy',
  'artificial_intelligence_ethics_policy'
);
