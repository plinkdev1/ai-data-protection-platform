-- KYC Verifications table
CREATE TABLE kyc_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  verification_session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  verification_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kyc_user_id ON kyc_verifications(user_id);
CREATE INDEX idx_kyc_session_id ON kyc_verifications(verification_session_id);
CREATE INDEX idx_kyc_status ON kyc_verifications(status);