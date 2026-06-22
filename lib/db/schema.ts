import {
  boolean,
  check,
  date,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const registosInteresse = pgTable("mfilda_registos_interesse", {
  pkRegistosInteresse: serial("pk_registos_interesse").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  empresa: varchar("empresa", { length: 255 }).notNull(),
  cargo: varchar("cargo", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  tipoContacto: varchar("tipo_contacto", { length: 50 }).notNull(),
  observacoes: text("observacoes"),
  consentimentoRgpd: boolean("consentimento_rgpd").notNull().default(false),
  consentimentoEm: date("consentimento_em"),
  criadoEm: date("criado_em")
    .notNull()
    .default(sql`CURRENT_DATE`),
  atualizadoEm: date("atualizado_em")
    .notNull()
    .default(sql`CURRENT_DATE`),
});

export const registoAreasInteresse = pgTable(
  "mfilda_registo_areas_interesse",
  {
    pkRegistoAreasInteresse: integer("pk_registo_areas_interesse")
      .notNull()
      .references(() => registosInteresse.pkRegistosInteresse, {
        onDelete: "cascade",
      }),
    area: varchar("area", { length: 100 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.pkRegistoAreasInteresse, table.area] })]
);

export const leads = pgTable(
  "mfilda_lead",
  {
    pkLead: varchar("pk_lead", { length: 20 }).primaryKey(),
    empresa: varchar("empresa", { length: 255 }).notNull(),
    nif: varchar("nif", { length: 50 }),
    sector: varchar("sector", { length: 255 }),
    colaboradores: integer("colaboradores"),
    localizacao: varchar("localizacao", { length: 255 }),
    nomeContacto: varchar("nome_contacto", { length: 255 }).notNull(),
    cargo: varchar("cargo", { length: 255 }),
    telefone: varchar("telefone", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    tipo: varchar("tipo", { length: 50 }),
    comoConheceu: varchar("como_conheceu", { length: 100 }),
    nivelInteresse: varchar("nivel_interesse", { length: 50 }),
    produto: varchar("produto", { length: 100 }).notNull(),
    horizonteCompra: varchar("horizonte_compra", { length: 50 }),
    potencialNegocio: varchar("potencial_negocio", { length: 50 }),
    estagio: varchar("estagio", { length: 50 }).notNull().default("Captada"),
    atribuidoA: varchar("atribuido_a", { length: 255 }),
    proximoFollowup: date("proximo_followup"),
    ultimoContacto: date("ultimo_contacto"),
    notas: text("notas"),
    origem: varchar("origem", { length: 20 }).notNull().default("interno"),
    fkRegistoInteresse: integer("fk_registo_interesse").references(
      () => registosInteresse.pkRegistosInteresse,
      { onDelete: "set null" }
    ),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "colaboradores_check",
      sql`${table.colaboradores} IS NULL OR ${table.colaboradores} >= 0`
    ),
  ]
);

export const users = pgTable("mfilda_user", {
  pkUser: serial("pk_user").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  activo: boolean("activo").notNull().default(true),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("mfilda_session", {
  pkSession: uuid("pk_session").primaryKey().defaultRandom(),
  fkUser: integer("fk_user")
    .notNull()
    .references(() => users.pkUser, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  expiraEm: timestamp("expira_em", { withTimezone: true }).notNull(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
});
