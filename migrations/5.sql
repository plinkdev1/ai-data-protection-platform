
-- Seed Service Tiers
INSERT INTO service_tiers (tier_key, name, price, description, features, credits_included, credits_additional) VALUES
('ai_assistant', 'AI Assistant', 9.99, 'Self-service with AI-powered automation and guidance', 
 '["Knowledge Base Access", "Automated DPO Tasks", "AI-Generated Policies", "Interactive Guidance", "Basic Support"]', 
 0, 0),
('dpo_hybrid', 'DPO Hybrid', 29.99, 'AI automation with on-demand expert human review', 
 '["All from AI Assistant", "Document Review by Experts", "Breach Notification Drafts", "Compliance Audits", "Human-in-the-Loop Credits", "Priority Support"]', 
 5, 5),
('dpo_partner', 'DPO Partner', 99.99, 'Comprehensive, dedicated DPO support and services', 
 '["All from DPO Hybrid", "Dedicated DPO Assignment", "Unlimited Human Interventions", "Full-Scale Audits", "Legal Representation", "24/7 Priority Support", "Custom SLA"]', 
 0, 0);

-- Seed Marketplace Services
INSERT INTO marketplace_services (service_key, name, description, category, base_price, estimated_hours, complexity_level, required_tier) VALUES
('dpia_review', 'DPIA Review & Assessment', 'Expert review of your Data Protection Impact Assessment with detailed recommendations', 'assessment', 150.00, 2, 'intermediate', 'dpo_hybrid'),
('privacy_policy_review', 'Privacy Policy Review', 'Comprehensive review and optimization of your privacy policy for GDPR compliance', 'legal', 200.00, 3, 'intermediate', 'dpo_hybrid'),
('dsar_response', 'DSAR Response Drafting', 'Professional drafting of data subject access request responses', 'compliance', 75.00, 1, 'basic', 'ai_assistant'),
('vendor_assessment', 'Third-Party Vendor Assessment', 'Security and privacy assessment of your third-party vendors', 'assessment', 300.00, 4, 'advanced', 'dpo_hybrid'),
('breach_notification', 'Breach Notification Drafting', 'Legal breach notification drafting for regulatory authorities', 'legal', 250.00, 2, 'advanced', 'dpo_hybrid'),
('compliance_audit', 'Full Compliance Audit', 'Comprehensive GDPR compliance audit with detailed report', 'assessment', 500.00, 8, 'advanced', 'dpo_partner'),
('policy_generation', 'Custom Policy Generation', 'AI-assisted custom policy generation with expert review', 'legal', 100.00, 1.5, 'basic', 'ai_assistant'),
('training_consultation', 'Staff Training Consultation', 'GDPR training session design and delivery for your team', 'consultation', 400.00, 4, 'intermediate', 'dpo_hybrid');
