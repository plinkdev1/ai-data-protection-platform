
-- Seed FAQ entries
INSERT INTO faqs (category, question, answer, sort_order, is_featured) VALUES
('general', 'What is DPOHub and how does it work?', 'DPOHub is a Human-in-the-Loop DPO-as-a-Service platform that combines AI automation with expert human oversight. We offer three tiers: AI Assistant for self-service, DPO Hybrid for expert review, and DPO Partner for dedicated support. Our marketplace connects you with certified data protection professionals for specialized tasks.', 1, 1),
('general', 'What makes DPOHub different from other GDPR compliance tools?', 'Unlike traditional compliance tools, DPOHub combines AI efficiency with human expertise through our unique Human-in-the-Loop model. You get the speed of automation with the accuracy and legal assurance of expert review. Our marketplace also provides access to specialized services that go beyond basic compliance tools.', 2, 1),
('billing', 'How does the credit system work?', 'Credits are used for human-in-the-loop services in our DPO Hybrid tier. Each tier includes a certain number of credits per month, and you can purchase additional credits as needed. Credits never expire and roll over month to month.', 1, 1),
('billing', 'Can I change my subscription tier at any time?', 'Yes, you can upgrade or downgrade your subscription at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle. Any unused credits will carry over to your new plan.', 2, 0),
('billing', 'What payment methods do you accept?', 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can also arrange for annual invoicing.', 3, 0),
('services', 'What types of services are available in the marketplace?', 'Our marketplace offers specialized DPO services including DPIA reviews, privacy policy assessments, breach notification drafting, vendor assessments, compliance audits, staff training, and custom policy generation. All services are provided by certified data protection professionals.', 1, 0),
('services', 'How are service providers vetted?', 'All service providers undergo a rigorous verification process including credential verification, background checks, skill assessments, and ongoing performance monitoring. We only work with certified professionals who meet our strict quality standards.', 2, 0),
('services', 'What is the typical turnaround time for marketplace services?', 'Turnaround times vary by service complexity: Basic services (1-2 days), Intermediate services (3-5 days), Advanced services (5-10 days). Urgent requests can be accommodated for an additional fee.', 3, 0),
('technical', 'Is my data secure on the platform?', 'Yes, we employ enterprise-grade security measures including end-to-end encryption, SOC 2 compliance, regular security audits, and strict access controls. We are also GDPR compliant and undergo regular third-party security assessments.', 1, 0),
('technical', 'Do you offer API access?', 'Yes, we provide REST API access for enterprise customers to integrate DPOHub functionality into their existing systems. API documentation and support are available for qualifying accounts.', 2, 0),
('technical', 'Can I export my data?', 'Absolutely. You can export all your data at any time in standard formats (JSON, CSV, PDF). We believe in data portability and will never lock you into our platform.', 3, 0),
('legal', 'What legal agreements do I need to sign?', 'Depending on your role, you may need to accept our Terms of Service, Service Level Agreement, and Data Processing Agreement. Service providers must also sign additional agreements. All documents are available in our legal section.', 1, 0),
('legal', 'Are you GDPR compliant?', 'Yes, we are fully GDPR compliant and serve as a processor for our clients data. We have implemented all necessary technical and organizational measures and maintain detailed records of processing activities.', 2, 0),
('legal', 'What happens if there is a data breach?', 'In the unlikely event of a breach, we will notify affected users within 72 hours and provide detailed information about the incident, our response, and any required actions. We maintain comprehensive incident response procedures and cyber insurance coverage.', 3, 0);

-- Seed Legal Documents
INSERT INTO legal_documents (document_type, version, title, content, effective_date) VALUES
('tos', '1.0', 'Terms of Service', '<h1>Terms of Service</h1>

<h2>1. Purpose & Scope</h2>
<p>These Terms of Service ("ToS") govern your use of DPOHub, a Human-in-the-Loop DPO-as-a-Service digital platform (the "Platform"). By accessing or using the Platform, you agree to these terms and acknowledge that all interactions, task submissions, and communications are digital and platform-mediated.</p>

<h2>2. Definitions</h2>
<ul>
<li><strong>User:</strong> Any individual or organization using the Platform</li>
<li><strong>Platform:</strong> The SaaS environment including the web portal, mobile apps, dashboards, APIs, and any related services</li>
<li><strong>Human-in-the-Loop Service:</strong> Tasks performed by Platform personnel, freelancers, or Partner DPO companies, combined with automated system support</li>
</ul>

<h2>3. Account Registration & Security</h2>
<p>Users must provide accurate registration information and maintain the confidentiality of credentials. Users are responsible for all activity originating from their accounts. Platform is not liable for unauthorized access due to User negligence.</p>

<h2>4. Acceptable Use</h2>
<p>Users may not scrape, reverse-engineer, or automate interactions outside the provided interfaces. Illegal, fraudulent, or abusive activity is strictly prohibited. Platform reserves the right to suspend or terminate accounts for repeated violations.</p>

<h2>5. Intellectual Property</h2>
<p>All content, software, dashboards, APIs, and documentation are Platform property or licensed to Platform. Users may not copy, modify, distribute, or create derivative works without express permission.</p>

<h2>6. Limitation of Liability & Disclaimers</h2>
<p>Platform is not liable for indirect, incidental, or consequential damages. Services are provided "as-is" and "as available"; no warranty of accuracy, completeness, or fitness for purpose is provided. Users retain final responsibility for all compliance decisions.</p>

<h2>7. Digital Notifications & Updates</h2>
<p>Platform may send notices, updates, or ToS amendments digitally via email or in-app notifications. Continued use after notice constitutes acceptance.</p>

<h2>8. Termination & Inactivity</h2>
<p>Platform may terminate accounts for inactivity or breach of terms. Users may terminate their account at any time, subject to outstanding obligations.</p>

<h2>9. Governing Law & Dispute Resolution</h2>
<p>ToS governed by Delaware law. Disputes resolved via digital mediation, then arbitration if unresolved.</p>', '2024-01-01'),

('dpa', '1.0', 'Data Processing Agreement', '<h1>Data Processing Agreement</h1>

<h2>1. Roles & Responsibilities</h2>
<ul>
<li><strong>User:</strong> Data Controller – determines purpose and means of data processing</li>
<li><strong>Platform:</strong> Data Processor – processes personal data solely per User instructions</li>
</ul>

<h2>2. Data Types & Processing Activities</h2>
<p>Includes employee, customer, or business data necessary for compliance tasks. Activities: review, reporting, advisory, automated monitoring, and task logging.</p>

<h2>3. Cloud & Digital Security Measures</h2>
<ul>
<li>Encryption of data in transit and at rest</li>
<li>Platform maintains access control, audit logs, and digital activity tracking</li>
<li>Breach notification to Users within 72 hours</li>
</ul>

<h2>4. Subprocessors</h2>
<p>Platform may engage subprocessors; Users notified digitally. Users may object via dashboard; alternative arrangements discussed.</p>

<h2>5. User Rights</h2>
<ul>
<li>Audit data processing activities through Platform logs</li>
<li>Request data correction, portability, or deletion via dashboard</li>
</ul>

<h2>6. Retention & Deletion</h2>
<p>Data retained only as necessary for service provision. On termination, data securely deleted unless legally required.</p>

<h2>7. Governing Law & Dispute Resolution</h2>
<p>DPA governed by Delaware law. Digital mediation first; arbitration if unresolved.</p>', '2024-01-01'),

('freelancer_agreement', '1.0', 'Freelancer Agreement', '<h1>Freelancer Agreement</h1>

<h2>1. Relationship</h2>
<p>Freelancer is independent; not an employee. Responsible for taxes and legal obligations.</p>

<h2>2. Digital Workflow</h2>
<p>Tasks assigned via Platform dashboard; submissions timestamped automatically. Platform may monitor task quality and completion metrics digitally.</p>

<h2>3. Scope of Services</h2>
<p>Deliver Human-in-the-Loop DPO advisory, document review, and compliance reports. Meet Platform-defined standards and SLAs.</p>

<h2>4. Compensation & Fees</h2>
<p>Payment for completed tasks via digital platform; minus Platform service fee. Remediation may affect payment if tasks fail quality checks.</p>

<h2>5. Confidentiality</h2>
<p>All User and Platform data accessed digitally must remain confidential. Obligations survive termination.</p>

<h2>6. Liability & Indemnification</h2>
<p>Freelancer responsible for errors/omissions. Indemnifies Platform against claims arising from negligence.</p>

<h2>7. Term & Termination</h2>
<p>Either party may terminate via digital notice (14 days). Confidentiality, indemnity, and IP obligations survive termination.</p>

<h2>8. Governing Law</h2>
<p>Delaware law applies; digital mediation/arbitration for disputes.</p>', '2024-01-01');
