
DELETE FROM policy_catalog WHERE policy_key IN (
'eu_isms_charter', 'eu_dpo_role_policy', 'eu_incident_response_plan',
'us_ccpa_privacy_policy', 'us_hipaa_policy', 'us_pci_dss_policy',
'china_pipl_policy', 'china_csl_policy', 'brazil_lgpd_policy',
'singapore_pdpa_policy', 'global_vendor_risk_policy', 'global_data_retention_policy',
'ai_governance_policy', 'blockchain_compliance_policy', 'iot_privacy_policy', 'biometric_data_policy'
);
