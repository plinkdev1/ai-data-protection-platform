
-- Seed policy catalog with comprehensive global policies
INSERT INTO policy_catalog (policy_key, title, category, jurisdiction, framework, description, mandatory_for, template_content, checklist_items, is_featured, complexity_level, estimated_hours) VALUES
-- EU GDPR Policies
('isms_charter_eu', 'Information Security Management System (ISMS) Charter - EU', 'security', 'EU', 'ISO27001,GDPR,NIS2', 'Establish governance, accountability, and improvement cycle for information security aligned with ISO/IEC 27001 and NIS2.', '["Organizations processing EU data", "Essential service operators", "Digital service providers"]', 
'# Information Security Management System (ISMS) Charter

**Document Owner:** Chief Information Security Officer (CISO)
**Approved By:** Board of Directors
**Effective Date:** [DD/MM/YYYY]
**Review Cycle:** Annual

## Purpose
This ISMS Charter establishes the framework, responsibilities, and principles for the management of information security at [Company Name]. It ensures the confidentiality, integrity, and availability of information assets in alignment with ISO/IEC 27001 and the EU NIS2 Directive.

## Scope
Applies to:
- All employees, contractors, and third-party service providers
- All systems, applications, and data owned or processed by [Company Name]

## Principles
- **Risk-Based Approach:** Regular risk assessments to identify and treat risks
- **Governance:** The CISO reports quarterly to the Board on ISMS performance
- **Continuous Improvement:** ISMS effectiveness is reviewed annually
- **Compliance:** The ISMS supports compliance with GDPR, NIS2, and contractual obligations

## Responsibilities
- **Board of Directors:** Oversight and approval of ISMS policy and budget
- **CISO:** Implementation, monitoring, and continuous improvement of ISMS
- **Employees & Contractors:** Adherence to security policies and training',
'["Board approval obtained", "CISO appointed", "Risk assessment methodology defined", "Security awareness training program established", "Annual audit scheduled", "Quarterly board reporting implemented"]', 1, 'intermediate', 4.0),

('privacy_policy_eu', 'Privacy Policy - EU GDPR', 'privacy', 'EU', 'GDPR', 'GDPR-compliant privacy policy for external users with all required elements under Articles 13-14.', '["All organizations processing EU personal data", "Websites with EU visitors", "Companies offering services to EU residents"]', 
'# Privacy Policy

**Published By:** [Company Name]
**Effective Date:** [DD/MM/YYYY]
**Contact:** [DPO Contact, Email, Address]

## Introduction
This Privacy Policy explains how [Company Name] collects, uses, stores, and protects personal data in accordance with the General Data Protection Regulation (EU) 2016/679 ("GDPR").

## Data We Collect
- **Identification data:** name, email, phone
- **Payment data:** where applicable
- **Technical data:** IP address, device identifiers
- **Special categories of data:** only if necessary and with explicit consent

## Legal Bases for Processing
- **Consent** (Art. 6(1)(a) GDPR)
- **Contractual necessity** (Art. 6(1)(b))
- **Legal obligation** (Art. 6(1)(c))
- **Legitimate interest** (Art. 6(1)(f))

## Your Rights
You have the right to access, rectify, erase, restrict, object, and port your personal data. To exercise your rights, contact our DPO at [DPO Contact].

## Data Transfers
Where data is transferred outside the EEA, safeguards such as Standard Contractual Clauses (SCCs) are applied.

## Retention
Personal data will be retained only as long as necessary for the purposes described.

## Complaints
You may lodge a complaint with your supervisory authority: [Insert Supervisory Authority Contact].',
'["Legal bases identified", "DPO contact included", "Data categories listed", "Rights clearly explained", "Transfer mechanisms specified", "Retention periods defined", "Supervisory authority contact provided"]', 1, 'intermediate', 3.0),

('dpo_role_policy_eu', 'Data Protection Officer (DPO) Role Policy - EU', 'privacy', 'EU', 'GDPR', 'Define DPO role, independence, and authority in line with GDPR Articles 37-39.', '["Public authorities", "Organizations with large-scale monitoring", "Organizations processing special categories at scale"]', 
'# Data Protection Officer (DPO) Role Policy

**Appointed DPO:** [Full Name]
**Contact:** [DPO Email/Phone]
**Effective Date:** [DD/MM/YYYY]

## Purpose
This policy defines the role, independence, and authority of the DPO in line with Articles 37–39 GDPR.

## Appointment & Independence
- The DPO is appointed by [Company Name]''s Board
- The DPO reports directly to senior management and operates independently
- The DPO will not receive instructions on the exercise of their duties and will not be penalized for performing them

## Responsibilities
- Monitor compliance with GDPR, NIS2, and internal policies
- Advise on Data Protection Impact Assessments (DPIAs)
- Act as contact point for supervisory authorities and data subjects
- Provide data protection awareness training',
'["DPO appointed by board", "Independence documented", "Direct reporting line established", "Contact information published", "Training responsibilities defined", "Supervisory authority liaison role defined"]', 1, 'intermediate', 2.5),

-- US Policies
('privacy_policy_us', 'Privacy Policy - US CCPA/CPRA', 'privacy', 'US', 'CCPA,CPRA', 'California Consumer Privacy Act compliant privacy policy with required disclosures and consumer rights.', '["Businesses processing California residents data", "Companies with $25M+ revenue", "Companies selling personal information"]',
'# Privacy Policy (CCPA/CPRA-Compliant)

**Published By:** [Company Name]
**Effective Date:** [DD/MM/YYYY]
**Contact:** [Privacy Contact, Email, Address]

## Scope
This Privacy Policy applies to California residents under the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), and other applicable US privacy laws.

## Data We Collect
- **Personal Identifiers:** name, email, phone
- **Financial Information:** credit card, account numbers
- **Commercial Information:** purchase history
- **Internet/Device Data:** cookies, usage, IP address

## Consumer Rights (California Residents)
- **Right to Know** what personal data is collected, sold, or shared
- **Right to Delete** personal information
- **Right to Opt-Out** of Sale or Sharing of personal data
- **Right to Correct** inaccurate personal information
- **Right to Limit** use of sensitive personal information

## Non-Discrimination
[Company Name] will not discriminate against consumers for exercising their privacy rights.',
'["Data categories defined", "Consumer rights listed", "Opt-out mechanism implemented", "Non-discrimination policy stated", "Request process documented", "Verification procedures established"]', 1, 'intermediate', 3.5),

('hipaa_policy_us', 'HIPAA Privacy & Security Policy', 'privacy', 'US', 'HIPAA', 'Comprehensive HIPAA compliance policy for handling Protected Health Information (PHI).', '["Healthcare providers", "Health plans", "Healthcare clearinghouses", "Business associates"]',
'# HIPAA Privacy & Security Policy

**Owner:** HIPAA Privacy Officer
**Effective Date:** [DD/MM/YYYY]

## Purpose
To comply with the Health Insurance Portability and Accountability Act (HIPAA) Privacy, Security, and Breach Notification Rules.

## Key Principles
- **Minimum Necessary:** Limit PHI use to minimum required
- **Access Controls:** Unique IDs, role-based access, audit logs
- **Safeguards:** Administrative, technical, and physical safeguards
- **Breach Notification:** Notify HHS within 60 days (or immediately if >500 records affected)

## Administrative Safeguards
- Designated Privacy Officer
- Workforce training and access management
- Incident response procedures
- Business associate agreements

## Technical Safeguards
- Access control and user authentication
- Audit controls and logging
- Integrity controls for PHI
- Transmission security measures

## Physical Safeguards
- Facility access controls
- Workstation use restrictions
- Device and media controls',
'["Privacy Officer designated", "Risk assessment completed", "Workforce training implemented", "BAAs in place", "Audit controls active", "Incident response plan tested"]', 1, 'advanced', 6.0),

-- China Policies
('privacy_policy_china', 'Privacy Policy - China PIPL', 'privacy', 'China', 'PIPL,CSL', 'Personal Information Protection Law compliant privacy policy for processing Chinese residents data.', '["Organizations processing Chinese personal data", "Companies with Chinese operations", "International companies serving China"]',
'# Privacy Policy (PIPL-Compliant)

**Published By:** [Company Name]
**Effective Date:** [DD/MM/YYYY]
**Contact:** [Data Protection Officer / Contact Email]

## Introduction
This Privacy Policy explains how [Company Name] collects, uses, stores, and protects personal data of users in China, in compliance with the Personal Information Protection Law (PIPL).

## Data Collected
- **Personal Identifiers:** name, ID number, phone, email
- **Financial information:** bank accounts, payment details
- **Sensitive personal information:** biometric data, health data
- **Technical data:** IP, device IDs, cookies

## Legal Basis for Processing
- **Consent:** explicit and informed consent from the individual
- **Contractual necessity:** necessary for performance of a contract
- **Legal obligation:** required by laws or government regulations

## User Rights
- Access, correction, deletion, and data portability
- Right to withdraw consent at any time
- Right to restrict or object to processing

## Cross-Border Transfer
- Must undergo security assessment or certification approved by authorities
- Contracts with overseas recipients must include required safeguards (Articles 38–39 PIPL)

## Data Retention
Only retain personal data as long as necessary to fulfill purposes, then securely delete or anonymize.',
'["Explicit consent mechanisms", "Data localization compliance", "Cross-border transfer approvals", "Security assessments completed", "User rights procedures", "Data retention schedules"]', 1, 'advanced', 4.5),

-- Global Multinational Policy
('global_privacy_policy', 'Global Privacy Policy - Multinational', 'privacy', 'Global', 'GDPR,CCPA,PIPL,LGPD,PDPA', 'Harmonized privacy policy covering EU, US, China, Brazil, and Singapore requirements.', '["Multinational companies", "Global service providers", "International data processing"]',
'# Global Privacy Policy (Multi-Jurisdictional)

**Published By:** [Company Name]
**Effective Date:** [DD/MM/YYYY]
**Contact:** [DPO / Privacy Officer Contact]

## Purpose
To inform individuals globally about how their personal data is collected, used, disclosed, and protected in compliance with applicable laws, including GDPR (EU), CCPA/CPRA (US), PIPL/CSL (China), LGPD (Brazil), PDPA (Singapore).

## Legal Basis / Consent
- **EU:** Consent, contractual necessity, legal obligation, legitimate interest (GDPR Art. 6)
- **US:** Notice and consent as required (CCPA/CPRA, HIPAA)
- **China:** Explicit informed consent for sensitive personal data (PIPL)
- **Brazil:** Consent, contractual necessity, legal obligation, legitimate interest (LGPD)
- **Singapore:** Consent or lawful purpose (PDPA)

## Rights of Data Subjects
- Access, correction, deletion, portability, restriction, objection
- Withdraw consent at any time
- **Jurisdiction-specific rights:**
  - EU: Erasure, objection to automated processing, DPIAs
  - US: CCPA opt-out and deletion rights
  - China: Access, correction, deletion, cross-border transfer consent
  - Brazil: LGPD access, correction, anonymization, and revocation of consent
  - Singapore: Access, correction, and withdrawal of consent

## Data Transfers
Transfers outside the jurisdiction comply with applicable regulations (SCCs, contractual safeguards, adequacy frameworks).',
'["Multi-jurisdictional compliance", "Harmonized legal bases", "Global rights framework", "Transfer mechanisms", "Local law compliance", "Unified governance"]', 1, 'advanced', 8.0),

-- Sectoral Policies
('pci_dss_policy', 'PCI DSS Compliance Policy', 'security', 'Global', 'PCI_DSS', 'Payment Card Industry Data Security Standard compliance for organizations handling payment data.', '["Merchants processing card payments", "Service providers", "Payment processors"]',
'# PCI DSS Compliance Policy

**Owner:** Chief Financial Officer / IT Security
**Effective Date:** [DD/MM/YYYY]

## Scope
All systems, applications, and networks involved in payment card processing.

## Requirements
- Annual PCI DSS Self-Assessment or ROC (Report on Compliance)
- Quarterly ASV scans and annual penetration tests
- Cardholder data encryption (TLS 1.2+)
- Network segmentation to isolate payment systems
- Security awareness training for staff

## Build and Maintain a Secure Network
- Install and maintain a firewall configuration
- Do not use vendor-supplied defaults for system passwords

## Protect Cardholder Data
- Protect stored cardholder data
- Encrypt transmission of cardholder data across open, public networks

## Maintain a Vulnerability Management Program
- Use and regularly update anti-virus software
- Develop and maintain secure systems and applications',
'["Annual assessment completed", "Network segmentation implemented", "Encryption in place", "Vulnerability scanning active", "Access controls configured", "Staff training completed"]', 1, 'advanced', 5.0);

-- Seed learning modules
INSERT INTO learning_modules (module_key, title, category, difficulty_level, description, duration_minutes, points_reward, prerequisites, sort_order) VALUES
('gdpr_fundamentals', 'GDPR Fundamentals', 'privacy_law', 'beginner', 'Master the basics of GDPR compliance including key principles, rights, and obligations.', 45, 50, '[]', 1),
('data_mapping', 'Data Mapping & Classification', 'data_governance', 'intermediate', 'Learn how to map data flows and classify data according to sensitivity and risk levels.', 60, 75, '[1]', 2),
('incident_response', 'Data Breach Response', 'incident_management', 'advanced', 'Comprehensive guide to handling data breaches including detection, containment, and notification.', 90, 100, '[1,2]', 3),
('dpo_certification', 'DPO Certification Prep', 'certification', 'advanced', 'Prepare for professional DPO certification with comprehensive training and practice exams.', 180, 200, '[1,2,3]', 4),
('privacy_by_design', 'Privacy by Design', 'design_principles', 'intermediate', 'Implement privacy-first design principles in systems and processes.', 75, 85, '[1]', 5),
('vendor_management', 'Third-Party Risk Management', 'risk_management', 'intermediate', 'Manage privacy and security risks in vendor relationships and data processing agreements.', 55, 65, '[]', 6);

-- Seed FAQs
INSERT INTO faqs (category, question, answer, sort_order, is_featured) VALUES
('general', 'When is a DPO appointment mandatory under GDPR?', 'A DPO must be appointed when: 1) Core activities involve large-scale regular monitoring of data subjects, 2) Core activities involve large-scale processing of special categories of data, or 3) The organization is a public authority.', 1, 1),
('compliance', 'What is the timeline for GDPR breach notifications?', 'Under GDPR, you must notify the supervisory authority within 72 hours of becoming aware of a breach. If the breach poses a high risk to individuals, you must also notify affected data subjects without undue delay.', 2, 1),
('services', 'How do I conduct a DPIA?', 'A DPIA should include: description of processing operations, assessment of necessity and proportionality, identification of risks to data subjects, and measures to address risks. Use our DPIA templates for guidance.', 3, 1),
('legal', 'What are Standard Contractual Clauses (SCCs)?', 'SCCs are standard terms approved by the EU Commission for international data transfers. They provide appropriate safeguards for personal data transferred outside the EEA.', 4, 0),
('technical', 'How do I implement Privacy by Design?', 'Privacy by Design involves: proactive measures, privacy as the default, privacy embedded into design, full functionality, end-to-end security, visibility and transparency, and respect for user privacy.', 5, 0);
