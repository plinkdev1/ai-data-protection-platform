
-- Remove the final set of policies
DELETE FROM policy_catalog WHERE policy_key IN (
  'digital_rights_management_policy',
  'research_data_management_policy',
  'nonprofit_fundraising_policy',
  'energy_utility_policy',
  'social_media_platform_policy',
  'maritime_shipping_policy',
  'cryptocurrency_compliance_policy',
  'educational_technology_policy'
);
