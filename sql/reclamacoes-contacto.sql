-- Colunas de contacto nas reclamações (tabela já existente)
-- nome obrigatório; telefone e email opcionais

ALTER TABLE mfilda_reclamacoes
  ADD COLUMN IF NOT EXISTS nome TEXT,
  ADD COLUMN IF NOT EXISTS telefone TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE mfilda_reclamacoes
SET nome = COALESCE(NULLIF(TRIM(nome), ''), '—')
WHERE nome IS NULL;

ALTER TABLE mfilda_reclamacoes
  ALTER COLUMN nome SET NOT NULL;

-- Se já tiveres corrido a versão anterior com telefone/email NOT NULL:
ALTER TABLE mfilda_reclamacoes
  ALTER COLUMN telefone DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL;
