
CREATE TABLE mfilda_registos_interesse (
    pk_registos_interesse              serial PRIMARY KEY,
    nome            VARCHAR(255)  NOT NULL,
    empresa         VARCHAR(255)  NOT NULL,
    cargo           VARCHAR(255)  NOT NULL,
    telefone         VARCHAR(50)   NOT NULL,
    email           VARCHAR(255)  NOT NULL,
    tipo_contacto   VARCHAR(50)   NOT NULL,

    observacoes     TEXT,
    consentimento_rgpd BOOLEAN     NOT NULL DEFAULT FALSE,
    consentimento_em   DATE,

    criado_em       DATE   NOT NULL DEFAULT NOW(),
    atualizado_em   DATE   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE mfilda_registos_interesse IS 'Submissões do formulário público de registo de interesse (FILDA 2026)';


CREATE TABLE mfilda_registo_areas_interesse (
    pk_registo_areas_interesse      int4         NOT NULL
        REFERENCES mfilda_registos_interesse(pk_registos_interesse) ON DELETE CASCADE,
    area            VARCHAR(100) NOT null,

    PRIMARY KEY (pk_registo_areas_interesse, area)
);

COMMENT ON TABLE mfilda_registo_areas_interesse IS 'Áreas de interesse seleccionadas no formulário público';

CREATE INDEX idx_registos_interesse_email    ON mfilda_registos_interesse (email);
CREATE INDEX idx_registos_interesse_criado   ON mfilda_registos_interesse (criado_em DESC);
CREATE INDEX idx_registos_interesse_empresa  ON mfilda_registos_interesse (empresa);

-- ---------------------------------------------------------------------------
-- 2. Leads comerciais — formulário /interno + dashboard
-- ---------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS lead_numero_seq START 1;

CREATE TABLE mfilda_lead (
    pk_lead                  VARCHAR(20) PRIMARY KEY,  -- ex.: LD-001

    -- Dados da empresa (InternoForm)
    empresa             VARCHAR(255) NOT NULL,
    nif                 VARCHAR(50),
    sector              VARCHAR(255),
    colaboradores       INTEGER
        CHECK (colaboradores IS NULL OR colaboradores >= 0),
    localizacao         VARCHAR(255),

    -- Dados do contacto
    nome_contacto       VARCHAR(255) NOT NULL,
    cargo               VARCHAR(255),
    telefone            VARCHAR(50)  NOT NULL,
    email               VARCHAR(255) NOT NULL,

    -- Qualificação comercial
    tipo                VARCHAR(50),
    como_conheceu       VARCHAR(100),
    nivel_interesse     VARCHAR(50),
    produto             VARCHAR(100) NOT NULL,
    horizonte_compra    VARCHAR(50),
    potencial_negocio   VARCHAR(50),

    -- Pipeline (dashboard)
    estagio             VARCHAR(50) NOT NULL DEFAULT 'Captada',
    atribuido_a         VARCHAR(255),
    proximo_followup    DATE,
    ultimo_contacto     DATE,
    notas               TEXT,

    -- Origem e ligação ao registo público (quando convertido)
    origem              VARCHAR(20) NOT NULL DEFAULT 'interno',
    fk_registo_interesse          int4
        REFERENCES mfilda_registos_interesse(pk_registos_interesse) ON DELETE SET NULL,

    criado_em           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE mfilda_lead IS 'Leads comerciais — captura interna na FILDA e pipeline do dashboard';

CREATE INDEX idx_leads_estagio        ON mfilda_lead (estagio);
CREATE INDEX idx_leads_criado         ON mfilda_lead (criado_em DESC);
CREATE INDEX idx_leads_email          ON mfilda_lead (email);
CREATE INDEX idx_leads_empresa        ON mfilda_lead (empresa);
CREATE INDEX idx_leads_registo_id     ON mfilda_lead (fk_registo_interesse) WHERE fk_registo_interesse IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Funções auxiliares
-- ---------------------------------------------------------------------------


CREATE OR REPLACE VIEW vw_dashboard_leads AS
SELECT
    l.pk_lead,
    l.empresa           AS company,
    l.nome_contacto     AS "contactName",
    l.email,
    l.telefone          AS phone,
    COALESCE(l.tipo, 'Potencial Cliente') AS type,
    l.produto           AS product,
    l.estagio           AS stage,
    COALESCE(l.nivel_interesse, 'Médio')  AS "interestLevel",
    COALESCE(l.potencial_negocio, 'Médio') AS "businessPotential",
    COALESCE(l.atribuido_a, '')         AS "assignedTo",
    l.criado_em::DATE   AS "createdAt",
    l.proximo_followup  AS "nextFollowUp",
    l.ultimo_contacto   AS "lastContact",
    COALESCE(l.notas, '') AS notes
FROM mfilda_lead l
ORDER BY l.criado_em DESC;

-- ---------------------------------------------------------------------------
-- 3. Autenticação — dashboard (ver sql/auth.sql para script completo + seed)
-- ---------------------------------------------------------------------------
-- mfilda_user, mfilda_session