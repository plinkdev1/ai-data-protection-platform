
-- Provider Reviews Table
CREATE TABLE provider_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_request_id INTEGER NOT NULL,
  client_user_id TEXT NOT NULL,
  provider_id INTEGER NOT NULL,
  rating INTEGER NOT NULL, -- 1-5 stars
  review_text TEXT,
  quality_rating INTEGER, -- 1-5
  communication_rating INTEGER, -- 1-5
  timeliness_rating INTEGER, -- 1-5
  would_recommend BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Legal Documents Table
CREATE TABLE legal_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_type TEXT NOT NULL, -- 'tos', 'sla', 'dpa', 'freelancer_agreement', 'partnership_agreement'
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  effective_date DATE,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Legal Acceptances Table
CREATE TABLE user_legal_acceptances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  document_id INTEGER NOT NULL,
  accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent TEXT,
  digital_signature TEXT
);

-- FAQ Table
CREATE TABLE faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL, -- 'general', 'billing', 'services', 'technical', 'legal'
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Credit Transactions Table
CREATE TABLE credit_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  organization_id INTEGER,
  transaction_type TEXT NOT NULL, -- 'purchase', 'usage', 'refund', 'bonus'
  credits_amount INTEGER NOT NULL, -- positive for additions, negative for usage
  service_request_id INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
