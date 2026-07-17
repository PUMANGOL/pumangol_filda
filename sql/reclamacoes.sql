-- Reclamações (backoffice FILDA 2026)
-- Executar manualmente; não incluído em generate/migrate automático pelo agente.

CREATE TABLE IF NOT EXISTS mfilda_reclamacoes (
  id SERIAL PRIMARY KEY,

  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,

  category TEXT NOT NULL
    CHECK (category IN ('VIA', 'Frota+', 'Atendimento ao cliente')),

  description TEXT NOT NULL,

  posto_nome TEXT,

  submitted_by_user_id INTEGER REFERENCES mfilda_users(id),
  submitted_by_username TEXT,
  submitted_by_full_name TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mfilda_reclamacoes_category
  ON mfilda_reclamacoes (category);

CREATE INDEX IF NOT EXISTS idx_mfilda_reclamacoes_created_at
  ON mfilda_reclamacoes (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_mfilda_reclamacoes_email
  ON mfilda_reclamacoes (email);
