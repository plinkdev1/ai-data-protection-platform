
-- Create policy catalog tables for comprehensive compliance policies
CREATE TABLE policy_catalog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  policy_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'privacy', 'security', 'compliance', 'sectoral'
  jurisdiction TEXT NOT NULL, -- 'EU', 'US', 'China', 'Brazil', 'Singapore', 'Global'
  framework TEXT, -- 'GDPR', 'CCPA', 'PIPL', 'LGPD', 'PDPA', 'ISO27001', etc.
  description TEXT NOT NULL,
  mandatory_for TEXT, -- JSON array of when mandatory
  template_content TEXT, -- Full policy template
  checklist_items TEXT, -- JSON array of checklist items
  is_featured BOOLEAN DEFAULT 0,
  complexity_level TEXT DEFAULT 'intermediate', -- 'basic', 'intermediate', 'advanced'
  estimated_hours REAL DEFAULT 2.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create learning modules tables
CREATE TABLE learning_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'gdpr_basics', 'data_handling', 'incident_response', 'dpo_certification'
  difficulty_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  description TEXT NOT NULL,
  content TEXT, -- Learning content/materials
  video_url TEXT,
  infographic_url TEXT,
  duration_minutes INTEGER DEFAULT 30,
  points_reward INTEGER DEFAULT 10,
  prerequisites TEXT, -- JSON array of prerequisite module IDs
  is_active BOOLEAN DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create learning quizzes tables
CREATE TABLE learning_quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  module_id INTEGER NOT NULL,
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice', -- 'multiple_choice', 'true_false', 'text'
  options TEXT, -- JSON array of options for multiple choice
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user learning progress tables
CREATE TABLE user_learning_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  progress_percentage INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  completion_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create support tickets table
CREATE TABLE support_tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  organization_id INTEGER,
  ticket_type TEXT NOT NULL, -- 'technical', 'billing', 'compliance', 'general'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  assigned_to TEXT,
  resolution TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create chatbot conversations table
CREATE TABLE chatbot_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  session_id TEXT NOT NULL,
  message_type TEXT NOT NULL, -- 'user', 'bot'
  message TEXT NOT NULL,
  context TEXT, -- JSON object with conversation context
  ai_confidence REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policy downloads tracking
CREATE TABLE policy_downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  organization_id INTEGER,
  policy_id INTEGER NOT NULL,
  download_type TEXT NOT NULL, -- 'pdf', 'docx', 'template'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
