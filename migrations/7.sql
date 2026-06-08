-- Add seed data for service tiers
INSERT OR REPLACE INTO service_tiers (id, tier_key, name, price, description, features, credits_included, credits_additional, is_active) VALUES
(1, 'ai_assistant', 'AI Assistant', 29.99, 'AI-powered self-service compliance tools', '["AI risk assessments", "Automated policy generation", "Basic compliance checks", "Standard templates", "Email support"]', 0, 0, 1),
(2, 'dpo_hybrid', 'DPO Hybrid', 199.99, 'AI + human expert review for critical decisions', '["Everything in AI Assistant", "Human expert review", "Priority email support", "Custom document review", "Monthly compliance reports"]', 10, 25, 1),
(3, 'dpo_partner', 'DPO Partner', 999.99, 'Dedicated DPO with full legal support', '["Everything in DPO Hybrid", "Dedicated DPO assignment", "Legal representation", "24/7 priority support", "Unlimited revisions", "Breach response support"]', 50, 15, 1);

-- Add seed data for marketplace services
INSERT OR REPLACE INTO marketplace_services (id, service_key, name, description, category, base_price, estimated_hours, complexity_level, required_tier, is_active) VALUES
(1, 'dpia_review', 'DPIA Review & Completion', 'Expert review and completion of Data Protection Impact Assessments', 'compliance', 250.00, 4, 'intermediate', 'dpo_hybrid', 1),
(2, 'privacy_policy_review', 'Privacy Policy Review', 'Comprehensive review and updates to privacy policies', 'legal', 150.00, 2, 'basic', NULL, 1),
(3, 'gdpr_audit', 'GDPR Compliance Audit', 'Full organizational GDPR compliance assessment', 'assessment', 500.00, 8, 'advanced', 'dpo_hybrid', 1),
(4, 'dsar_setup', 'DSAR Process Setup', 'Setup automated data subject access request workflows', 'compliance', 200.00, 3, 'intermediate', NULL, 1),
(5, 'breach_response', 'Data Breach Response', 'Emergency data breach assessment and response plan', 'consultation', 750.00, 6, 'advanced', 'dpo_partner', 1),
(6, 'vendor_assessment', 'Vendor Risk Assessment', 'Third-party vendor data protection risk evaluation', 'assessment', 300.00, 4, 'intermediate', 'dpo_hybrid', 1),
(7, 'training_delivery', 'Staff Training Delivery', 'Interactive GDPR and data protection training sessions', 'consultation', 400.00, 4, 'basic', NULL, 1),
(8, 'policy_generation', 'Custom Policy Generation', 'AI-assisted generation of custom compliance policies', 'legal', 100.00, 1, 'basic', NULL, 1);

-- Add seed data for legal documents
INSERT OR REPLACE INTO legal_documents (id, document_type, version, title, content, effective_date, is_active) VALUES
(1, 'tos', '1.0', 'DPOHub Terms of Service', '<h1>Terms of Service</h1><p>Welcome to DPOHub. By using our platform, you agree to these terms...</p><h2>1. Service Description</h2><p>DPOHub provides a marketplace connecting organizations with data protection professionals...</p>', DATE('now'), 1),
(2, 'dpa', '1.0', 'Data Processing Agreement', '<h1>Data Processing Agreement</h1><p>This agreement governs the processing of personal data...</p>', DATE('now'), 1),
(3, 'freelancer_agreement', '1.0', 'Freelancer Service Agreement', '<h1>Freelancer Agreement</h1><p>Terms for independent DPO service providers...</p>', DATE('now'), 1),
(4, 'partnership_agreement', '1.0', 'DPO Company Partnership Agreement', '<h1>Partnership Agreement</h1><p>Terms for DPO company partnerships...</p>', DATE('now'), 1),
(5, 'sla', '1.0', 'Service Level Agreement', '<h1>Service Level Agreement</h1><p>Performance standards for human-in-the-loop services...</p>', DATE('now'), 1);

-- Add seed data for FAQs
INSERT OR REPLACE INTO faqs (id, category, question, answer, sort_order, is_featured, is_active) VALUES
(1, 'general', 'What is DPOHub?', 'DPOHub is a human-in-the-loop DPO-as-a-Service marketplace platform that connects organizations with expert data protection professionals. We combine AI-powered tools with human expertise to provide comprehensive GDPR compliance solutions.', 1, 1, 1),
(2, 'general', 'How does the human-in-the-loop model work?', 'Our platform uses AI to provide initial assessments and document generation, which are then reviewed and refined by certified data protection experts. This ensures accuracy while maintaining efficiency and cost-effectiveness.', 2, 1, 1),
(3, 'services', 'What services are available in the marketplace?', 'Our marketplace offers various services including DPIA reviews, privacy policy creation, GDPR audits, data breach response, vendor assessments, staff training, and more. All services are delivered by vetted DPO professionals.', 3, 1, 1),
(4, 'billing', 'How does the credit system work?', 'Different subscription tiers include credits for human expert services. Credits are consumed when you request human review or specialized services from our marketplace providers. Additional credits can be purchased as needed.', 4, 0, 1),
(5, 'technical', 'Is my data secure on DPOHub?', 'Yes, we implement enterprise-grade security measures including encryption, access controls, and regular security audits. As a DPO service platform, data protection and privacy are at the core of everything we do.', 5, 1, 1),
(6, 'services', 'How quickly can I get help with a data breach?', 'Our DPO Partner tier includes 24/7 emergency breach response. We aim to have an expert reviewing your situation within 1 hour for urgent matters and provide initial guidance within 4 hours.', 6, 0, 1),
(7, 'legal', 'Are your DPO professionals certified?', 'Yes, all service providers on our platform are vetted and hold relevant certifications such as CIPP/E, CIPM, or equivalent qualifications. We verify their credentials and track their performance ratings.', 7, 0, 1),
(8, 'billing', 'Can I cancel my subscription anytime?', 'Yes, you can cancel your subscription at any time. Unused credits from your current billing period remain available until expiration. There are no cancellation fees or long-term commitments.', 8, 0, 1);
