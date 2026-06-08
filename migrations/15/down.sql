
-- Remove the additional comprehensive policies
DELETE FROM policy_catalog WHERE policy_key IN (
  'telecommunications_privacy_policy',
  'automotive_connected_vehicle_policy',
  'smart_city_privacy_policy',
  'cloud_computing_security_policy_comprehensive',
  'mobile_app_privacy_policy',
  'environmental_data_policy',
  'aviation_security_policy',
  'gaming_platform_policy'
);
