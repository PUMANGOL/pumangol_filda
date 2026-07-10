-- Pumangol FILDA 2026 CRM — Database Initialisation
-- Run: psql -d my_pumangol_portal -f sql/init.sql

CREATE TABLE IF NOT EXISTS mfilda_users (
  id           SERIAL PRIMARY KEY,
  username     TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name    TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'staff',
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mfilda_sessions (
  id          TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES mfilda_users(id) ON DELETE CASCADE,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mfilda_sessions_user_id    ON mfilda_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mfilda_sessions_expires_at ON mfilda_sessions(expires_at);

CREATE TABLE IF NOT EXISTS mfilda_leads (
  id                               SERIAL PRIMARY KEY,

  -- Identification
  full_name                        TEXT NOT NULL,
  phone                            TEXT NOT NULL,
  email                            TEXT NOT NULL,
  province                         TEXT,
  municipality                     TEXT,

  -- Profile
  profile                          TEXT NOT NULL,

  -- Company data
  company_name                     TEXT,
  sector                           TEXT,
  job_title                        TEXT,

  -- Existing client
  is_existing_client               BOOLEAN,
  existing_client_areas            JSONB,

  -- Solutions (multi-select)
  solutions                        JSONB NOT NULL DEFAULT '[]',

  -- Particular: Lubrificantes
  lubricant_vehicle_type_particular TEXT,

  -- Particular: VIA
  uses_via_app                     BOOLEAN,

  -- Particular: Cartão Presente
  card_purpose_particular          TEXT,

  -- Empresa: Combustíveis
  combustiveis_purpose             TEXT,
  combustiveis_consumption         TEXT,

  -- Empresa: Lubrificantes
  lubricant_vehicle_count_empresa  TEXT,

  -- Empresa: Frota+
  frota_vehicle_count              TEXT,
  frota_interest                   TEXT,

  -- Empresa: Angobetumes
  angobetumes_interest             TEXT,
  angobetumes_activity             TEXT,

  -- Empresa: Aviação
  aviacao_operation_type           TEXT,

  -- Empresa: Cartão Presente
  card_purpose_empresa             TEXT,

  -- Fornecedor
  supplier_area                    TEXT,

  -- Parceiro
  partner_area                     TEXT,

  -- Commercial qualification
  purchase_timeline                TEXT NOT NULL,
  wants_contact                    BOOLEAN NOT NULL,
  contact_preference               JSONB,

  -- Consent
  gdpr_consent                     BOOLEAN NOT NULL,

  -- Scoring
  score_profile                    INTEGER NOT NULL DEFAULT 0,
  score_interest                   INTEGER NOT NULL DEFAULT 0,
  score_potential                  INTEGER NOT NULL DEFAULT 0,
  score_timeline                   INTEGER NOT NULL DEFAULT 0,
  score_contact                    INTEGER NOT NULL DEFAULT 0,
  total_score                      INTEGER NOT NULL DEFAULT 0,
  classification                   TEXT NOT NULL DEFAULT 'D',

  -- Notes (from public registration form)
  notes                                TEXT,

  -- Metadata
  submitted_by_user_id             INTEGER REFERENCES mfilda_users(id),
  submitted_by_username            TEXT,
  submitted_by_full_name           TEXT,
  created_at                       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mfilda_leads_classification ON mfilda_leads(classification);
CREATE INDEX IF NOT EXISTS idx_mfilda_leads_profile        ON mfilda_leads(profile);
CREATE INDEX IF NOT EXISTS idx_mfilda_leads_created_at     ON mfilda_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mfilda_leads_total_score    ON mfilda_leads(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_mfilda_leads_email          ON mfilda_leads(email);
