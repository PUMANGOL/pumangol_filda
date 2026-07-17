-- Coluna posto (aplicar se a tabela mfilda_reclamacoes já existir)

ALTER TABLE mfilda_reclamacoes
  ADD COLUMN IF NOT EXISTS posto_nome TEXT;
