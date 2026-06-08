
-- Service Tiers Table
CREATE TABLE service_tiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tier_key TEXT UNIQUE NOT NULL, -- 'ai_assistant', 'dpo_hybrid', 'dpo_partner'
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  features TEXT, -- JSON array of features
  credits_included INTEGER DEFAULT 0,
  credits_additional INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions Table
CREATE TABLE user_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  organization_id INTEGER,
  tier_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'pending'
  credits_remaining INTEGER DEFAULT 0,
  subscription_start DATE,
  subscription_end DATE,
  auto_renew BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Providers Table (Freelancers and DPO Companies)
CREATE TABLE service_providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  provider_type TEXT NOT NULL, -- 'freelancer', 'dpo_company'
  company_name TEXT,
  business_registration TEXT,
  specializations TEXT, -- JSON array
  hourly_rate REAL,
  availability_hours TEXT, -- JSON object for schedule
  bio TEXT,
  certifications TEXT, -- JSON array
  portfolio_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'suspended', 'rejected'
  rating REAL DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketplace Services Table
CREATE TABLE marketplace_services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_key TEXT UNIQUE NOT NULL, -- 'dpia_review', 'privacy_policy_review', etc.
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'compliance', 'legal', 'assessment'
  base_price REAL NOT NULL,
  estimated_hours REAL,
  complexity_level TEXT, -- 'basic', 'intermediate', 'advanced'
  required_tier TEXT, -- minimum tier required
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Requests Table (Pay-per-Service)
CREATE TABLE service_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_user_id TEXT NOT NULL,
  organization_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  provider_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT, -- JSON object with specific requirements
  attachments TEXT, -- JSON array of file URLs
  budget REAL,
  deadline DATE,
  status TEXT DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'under_review', 'completed', 'cancelled'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  ai_output TEXT, -- Initial AI-generated content if applicable
  provider_output TEXT, -- Final deliverable from provider
  client_feedback TEXT,
  provider_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
