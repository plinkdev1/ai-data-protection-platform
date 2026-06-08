
-- Add more comprehensive policies to reach 50+ templates as planned
INSERT INTO policy_catalog (policy_key, title, category, jurisdiction, framework, description, mandatory_for, template_content, checklist_items, is_featured, complexity_level, estimated_hours) VALUES

-- Additional EU Policies
('gdpr_breach_notification_policy', 'GDPR Data Breach Notification Policy', 'privacy', 'EU', 'GDPR', 'Mandatory 72-hour breach notification procedures for GDPR Article 33-34 compliance.', '["All EU data controllers", "Organizations processing EU personal data", "Public authorities", "Healthcare providers"]', '# GDPR Data Breach Notification Policy

## 1. Purpose and Scope
This policy establishes procedures for detecting, investigating, and reporting personal data breaches in compliance with GDPR Articles 33-34.

## 2. Breach Definition
A breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal data transmitted, stored or otherwise processed.

## 3. Detection and Assessment
- Immediate containment measures
- Risk assessment within 24 hours
- Documentation of incident details
- Impact evaluation on data subjects

## 4. Notification Requirements
### To Supervisory Authority (Article 33)
- Within 72 hours of becoming aware
- Via supervisory authority portal
- Include all required elements per Article 33(3)

### To Data Subjects (Article 34)
- Without undue delay if high risk
- Clear and plain language
- Describe likely consequences and mitigation measures

## 5. Documentation
- Breach register maintenance
- Evidence preservation
- Lessons learned analysis', '["Breach detection procedures implemented", "72-hour notification process established", "Risk assessment framework defined", "Communication templates prepared", "Staff training completed", "Breach register maintained", "DPO involvement documented", "Regular testing conducted"]', true, 'advanced', 4.0),

('gdpr_consent_management_policy', 'GDPR Consent Management Policy', 'privacy', 'EU', 'GDPR', 'Comprehensive consent collection, management, and withdrawal procedures under GDPR Article 7.', '["Marketing teams", "E-commerce platforms", "Website operators", "Mobile app developers"]', '# GDPR Consent Management Policy

## 1. Consent Requirements
Valid consent must be freely given, specific, informed, and unambiguous as per GDPR Article 7.

## 2. Consent Collection
### Pre-ticked Boxes Prohibited
- Clear affirmative action required
- Granular consent options provided
- Plain language explanations

### Consent Records
- What was consented to
- When consent was given
- How consent was obtained
- Who provided consent

## 3. Consent Withdrawal
- Easy withdrawal mechanisms
- Same ease as giving consent
- Clear withdrawal options
- Immediate processing cessation

## 4. Technical Implementation
- Consent management platforms
- Audit trail maintenance
- Regular consent refresh
- Cookie consent integration

## 5. Special Categories
- Explicit consent for sensitive data
- Enhanced protections
- Additional safeguards', '["Consent collection forms updated", "Withdrawal mechanisms implemented", "Consent records system active", "Staff training completed", "Cookie consent integrated", "Regular consent audits scheduled", "Granular consent options provided", "Plain language explanations verified"]', true, 'intermediate', 3.5),

-- Additional US Policies
('sox_compliance_policy', 'Sarbanes-Oxley (SOX) Compliance Policy', 'compliance', 'US', 'SOX,PCAOB', 'Financial reporting controls and data governance for public companies under SOX requirements.', '["Public companies", "Financial services", "Accounting firms", "Internal audit teams"]', '# Sarbanes-Oxley (SOX) Compliance Policy

## 1. Purpose
Ensure compliance with Sarbanes-Oxley Act requirements for financial reporting accuracy and internal controls.

## 2. Internal Controls Over Financial Reporting (ICFR)
### Control Environment
- Tone at the top
- Board oversight
- Management philosophy
- Organizational structure

### Risk Assessment
- Financial reporting risks
- Fraud risk factors
- Significant changes assessment
- Control deficiencies identification

## 3. IT General Controls (ITGC)
- Access management
- Change management
- Computer operations
- System development

## 4. Data Integrity Requirements
- Accurate financial data processing
- Completeness of transactions
- Proper authorization controls
- Segregation of duties

## 5. Documentation and Testing
- Control documentation
- Testing procedures
- Deficiency remediation
- Management certifications

## 6. Whistleblower Protections
- Anonymous reporting channels
- Investigation procedures
- Anti-retaliation measures', '["ICFR framework established", "IT general controls implemented", "Access controls configured", "Change management procedures active", "Testing protocols defined", "Documentation completed", "Whistleblower channels established", "Management certifications obtained"]', true, 'advanced', 6.0),

('ferpa_privacy_policy', 'FERPA Educational Records Privacy Policy', 'privacy', 'US', 'FERPA', 'Family Educational Rights and Privacy Act compliance for educational institutions.', '["Educational institutions", "Schools and universities", "EdTech companies", "Student service providers"]', '# FERPA Educational Records Privacy Policy

## 1. Purpose and Scope
Protect the privacy of student education records in compliance with the Family Educational Rights and Privacy Act (FERPA).

## 2. Education Records Definition
Records directly related to students maintained by educational agencies or institutions.

## 3. Student Rights
### Inspection and Review
- Right to inspect education records
- 45-day response requirement
- Explanation and interpretation access

### Amendment Rights
- Request record corrections
- Hearing procedures for disputes
- Right to insert statements

## 4. Disclosure Restrictions
### Consent Requirements
- Written consent for most disclosures
- Specific disclosure authorization
- Record of disclosures maintained

### Exceptions
- School officials with legitimate interest
- Emergency situations
- Directory information (if policy exists)

## 5. Directory Information
- Annual notification requirements
- Opt-out procedures
- Limited disclosure without consent

## 6. Technical Safeguards
- Secure storage systems
- Access logging
- Encryption requirements
- Regular security audits', '["FERPA compliance officer designated", "Student rights procedures established", "Consent forms updated", "Directory information policy defined", "Access controls implemented", "Staff training completed", "Annual notifications sent", "Security measures verified"]', false, 'intermediate', 4.0),

-- Additional Global Policies
('iso27001_isms_policy', 'ISO 27001 Information Security Management Policy', 'security', 'Global', 'ISO27001', 'Comprehensive information security management system based on ISO/IEC 27001 standard.', '["All organizations", "IT departments", "Security teams", "Management systems"]', '# ISO 27001 Information Security Management Policy

## 1. Information Security Objective
Establish, implement, maintain and continually improve an Information Security Management System (ISMS).

## 2. Leadership and Commitment
### Management Responsibility
- Top management commitment
- Information security policy approval
- Resource allocation
- Risk management oversight

### Information Security Roles
- Chief Information Security Officer
- Information security committee
- Asset owners and custodians
- Security awareness champions

## 3. Risk Management Framework
### Risk Assessment
- Asset identification and valuation
- Threat and vulnerability analysis
- Risk evaluation and treatment
- Regular risk reviews

### Risk Treatment Options
- Risk mitigation controls
- Risk acceptance decisions
- Risk avoidance strategies
- Risk transfer mechanisms

## 4. Control Implementation
### Physical and Environmental Security
- Secure areas and facilities
- Equipment protection
- Clear desk and screen policies
- Secure disposal procedures

### Access Control
- User access management
- Privileged access controls
- Remote access security
- Regular access reviews

## 5. Incident Management
- Security incident procedures
- Incident response team
- Evidence collection
- Lessons learned process

## 6. Business Continuity
- Continuity planning
- Backup and recovery
- Alternative processing sites
- Regular testing procedures

## 7. Compliance and Audit
- Legal and regulatory compliance
- Internal audit program
- Management reviews
- Continuous improvement', '["ISMS framework established", "Risk assessment completed", "Security controls implemented", "Incident response plan active", "Business continuity procedures tested", "Staff training delivered", "Internal audits scheduled", "Management reviews conducted"]', true, 'advanced', 8.0),

('whistleblower_protection_policy', 'Whistleblower Protection and Reporting Policy', 'governance', 'Global', 'SOX,EU_Directive_2019/1937', 'Anonymous reporting channels and protection procedures for compliance violations and misconduct.', '["All organizations", "Public companies", "EU entities", "Compliance teams"]', '# Whistleblower Protection and Reporting Policy

## 1. Purpose
Provide safe channels for reporting suspected violations while protecting reporters from retaliation.

## 2. Scope of Reportable Matters
- Financial fraud and misconduct
- Privacy and data protection violations
- Discrimination and harassment
- Safety and environmental violations
- Corruption and bribery
- Other legal or ethical violations

## 3. Reporting Channels
### Internal Channels
- Anonymous hotline
- Secure online portal
- Direct supervisor reports
- Compliance officer contact

### External Channels
- Regulatory authorities
- Law enforcement
- Independent ombudsman
- Legal counsel

## 4. Protection Measures
### Anti-Retaliation
- Termination protection
- Demotion prohibition
- Harassment prevention
- Transfer restrictions

### Confidentiality
- Identity protection
- Need-to-know basis
- Secure communication channels
- Anonymous option availability

## 5. Investigation Procedures
- Prompt investigation initiation
- Independent investigation team
- Fair and thorough process
- Timely resolution

## 6. Communication and Training
- Policy awareness programs
- Regular training sessions
- Clear reporting instructions
- Leadership commitment', '["Reporting channels established", "Anti-retaliation measures implemented", "Investigation procedures defined", "Staff training completed", "Anonymous hotline active", "Confidentiality protections verified", "Regular policy reviews scheduled", "Leadership commitment documented"]', false, 'intermediate', 3.5),

-- Additional Technology/Innovation Policies
('quantum_computing_security_policy', 'Quantum Computing Security Preparedness Policy', 'security', 'Global', 'NIST_Post_Quantum,ISO27001', 'Post-quantum cryptography readiness and quantum-safe security measures for future-proofing.', '["Technology companies", "Financial institutions", "Government agencies", "Research organizations"]', '# Quantum Computing Security Preparedness Policy

## 1. Quantum Threat Assessment
### Current Risk Landscape
- Quantum computing advancement timeline
- Cryptographic vulnerability analysis
- Data sensitivity classification
- Impact assessment framework

### Post-Quantum Cryptography
- NIST standardization process
- Algorithm selection criteria
- Implementation roadmap
- Migration planning

## 2. Cryptographic Inventory
### Current Cryptographic Assets
- Encryption algorithms in use
- Key management systems
- Digital signature schemes
- Hash functions and protocols

### Vulnerability Assessment
- Quantum-vulnerable algorithms
- Critical system dependencies
- Data retention requirements
- Legacy system considerations

## 3. Migration Strategy
### Phased Implementation
- High-priority systems first
- Risk-based prioritization
- Parallel operation periods
- Rollback procedures

### Hybrid Approaches
- Classical-quantum combinations
- Incremental deployment
- Interoperability maintenance
- Performance optimization

## 4. Governance and Oversight
- Quantum security committee
- Regular threat assessments
- Vendor management requirements
- Industry collaboration

## 5. Research and Development
- Emerging technology monitoring
- Pilot program implementation
- Partnership strategies
- Knowledge sharing', '["Quantum threat assessment completed", "Cryptographic inventory maintained", "Migration roadmap defined", "Hybrid approaches evaluated", "Governance committee established", "Vendor requirements updated", "Research partnerships active", "Regular monitoring implemented"]', false, 'advanced', 7.0),

('sustainability_esg_policy', 'Environmental, Social, and Governance (ESG) Data Policy', 'governance', 'Global', 'EU_Taxonomy,TCFD,GRI', 'ESG data governance, reporting, and sustainability compliance framework.', '["Public companies", "Investment firms", "Sustainability teams", "ESG reporting entities"]', '# Environmental, Social, and Governance (ESG) Data Policy

## 1. ESG Data Governance
### Data Quality Standards
- Accuracy and completeness requirements
- Source verification procedures
- Third-party validation processes
- Regular data quality assessments

### Data Collection Framework
- Environmental metrics capture
- Social impact measurements
- Governance indicators tracking
- Stakeholder engagement data

## 2. Environmental Data Management
### Climate-Related Disclosures
- Greenhouse gas emissions tracking
- Climate risk assessments
- Transition planning documentation
- Physical risk evaluations

### Resource Management
- Energy consumption monitoring
- Water usage tracking
- Waste generation reporting
- Circular economy metrics

## 3. Social Impact Metrics
### Human Capital
- Diversity and inclusion data
- Employee safety records
- Training and development metrics
- Community investment tracking

### Stakeholder Relations
- Customer satisfaction measures
- Supplier diversity programs
- Community engagement records
- Human rights due diligence

## 4. Governance Reporting
### Board Composition
- Independence metrics
- Diversity statistics
- Expertise assessments
- Meeting attendance records

### Risk Management
- Risk oversight frameworks
- Compliance monitoring
- Ethics and integrity measures
- Transparency indicators

## 5. Reporting and Disclosure
- Regulatory compliance frameworks
- Voluntary reporting standards
- Stakeholder communication
- Performance benchmarking', '["ESG data governance framework established", "Data quality standards defined", "Collection procedures implemented", "Climate metrics tracked", "Social impact measured", "Governance indicators monitored", "Reporting standards adopted", "Stakeholder engagement documented"]', false, 'intermediate', 5.0);
