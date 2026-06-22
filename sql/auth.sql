-- ---------------------------------------------------------------------------
-- Autenticação — utilizadores internos (dashboard)
-- Executar após schema.sql
-- ---------------------------------------------------------------------------

CREATE TABLE mfilda_user (
    pk_user         SERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,   -- bcrypt
    nome            VARCHAR(255) NOT NULL,
    activo          BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE mfilda_user IS 'Utilizadores autorizados a aceder ao dashboard comercial';

CREATE INDEX idx_user_email ON mfilda_user (LOWER(email));


-- Sessões server-side: cookie guarda token opaco; BD guarda apenas o hash SHA-256
CREATE TABLE mfilda_session (
    pk_session      UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    fk_user         INT4         NOT NULL
        REFERENCES mfilda_user(pk_user) ON DELETE CASCADE,
    token_hash      VARCHAR(64)  NOT NULL UNIQUE,
    expira_em       TIMESTAMPTZ  NOT NULL,
    criado_em       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE mfilda_session IS 'Sessões activas de login (validadas em cada pedido protegido)';

CREATE INDEX idx_session_user   ON mfilda_session (fk_user);
CREATE INDEX idx_session_expira ON mfilda_session (expira_em);


-- Utilizador inicial (password: Pumangol2023!) — alterar após primeiro acesso
INSERT INTO mfilda_user (email, password_hash, nome)
VALUES (
    'admin@pumangol.ao',
    '$2b$12$XtM77pAQqVTyPIZqleeu3u.vflSgqQn4gyz/SA7H4EAnacSxuhP/W',
    'Administrador'
);
