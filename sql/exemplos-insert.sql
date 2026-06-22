-- =============================================================================
-- Exemplos de INSERT — alinhados com os formulários da app
-- =============================================================================

-- ---------------------------------------------------------------------------
-- A) Registo público (/registar)
--    Corresponde a: nome, empresa, cargo, telefone, email, tipo, areas[], observacoes
-- ---------------------------------------------------------------------------

WITH novo_registo AS (
    INSERT INTO registos_interesse (
        nome,
        empresa,
        cargo,
        telefone,
        email,
        tipo_contacto,
        observacoes,
        consentimento_rgpd,
        consentimento_em
    ) VALUES (
        'Manuel Santos',
        'TransAngola Lda',
        'Director de Operações',
        '+244 923 456 789',
        'manuel.santos@transangola.ao',
        'Potencial Cliente',
        'Interesse em gestão de frota para 45 veículos.',
        TRUE,
        NOW()
    )
    RETURNING id
)
INSERT INTO registo_areas_interesse (registo_id, area)
SELECT id, unnest(ARRAY['Frota+', 'Soluções Empresariais']::VARCHAR[])
FROM novo_registo;


-- ---------------------------------------------------------------------------
-- B) Lead interna (/interno) — equipa comercial na FILDA
--    O id (LD-001) é gerado automaticamente pelo trigger
-- ---------------------------------------------------------------------------

INSERT INTO leads (
    empresa,
    nif,
    sector,
    colaboradores,
    localizacao,
    nome_contacto,
    cargo,
    telefone,
    email,
    como_conheceu,
    nivel_interesse,
    produto,
    horizonte_compra,
    potencial_negocio,
    estagio,
    atribuido_a,
    proximo_followup,
    notas,
    origem
) VALUES (
    'Construções Bengo SA',
    '5000123456',
    'Construção Civil',
    120,
    'Luanda',
    'Isabel Ferreira',
    'Directora Financeira',
    '+244 912 345 678',
    'isabel.ferreira@bengo.ao',
    'FILDA',
    'Alto',
    'Combustíveis',
    '30 dias',
    'Alto',
    'Proposta Enviada',
    'Carlos Mendes',
    CURRENT_DATE + INTERVAL '3 days',
    'Aguarda aprovação da direcção financeira.',
    'interno'
);


-- ---------------------------------------------------------------------------
-- C) Converter registo público em lead (fluxo típico pós-contacto)
-- ---------------------------------------------------------------------------

-- Supondo que o registo público tem id conhecido:
/*
INSERT INTO leads (
    empresa,
    nome_contacto,
    cargo,
    telefone,
    email,
    tipo,
    produto,
    nivel_interesse,
    potencial_negocio,
    estagio,
    notas,
    origem,
    registo_id
)
SELECT
    r.empresa,
    r.nome,
    r.cargo,
    r.telefone,
    r.email,
    r.tipo_contacto,
    COALESCE(
        (SELECT area FROM registo_areas_interesse WHERE registo_id = r.id LIMIT 1),
        'Outro'
    ),
    'Médio',
    'Médio',
    'Captada',
    r.observacoes,
    'publico',
    r.id
FROM registos_interesse r
WHERE r.id = '00000000-0000-0000-0000-000000000000'::UUID;
*/
