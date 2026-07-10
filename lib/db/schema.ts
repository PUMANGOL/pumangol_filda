import {
  pgTable,
  serial,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("mfilda_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("staff"), // staff | admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("mfilda_sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("mfilda_leads", {
  id: serial("id").primaryKey(),

  // Identification
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  province: text("province"),
  municipality: text("municipality"),

  // Profile: particular | empresa | orgao_publico | fornecedor | parceiro | outro
  profile: text("profile").notNull(),

  // Company / institution data
  companyName: text("company_name"),
  sector: text("sector"),
  jobTitle: text("job_title"),

  // Existing client
  isExistingClient: boolean("is_existing_client"),
  existingClientAreas: jsonb("existing_client_areas").$type<string[]>(),

  // Solutions of interest (multi-select)
  solutions: jsonb("solutions").$type<string[]>().notNull().default([]),

  // Particular: Lubrificantes – vehicle type
  lubricantVehicleTypeParticular: text("lubricant_vehicle_type_particular"),

  // Particular: VIA
  usesViaApp: boolean("uses_via_app"),

  // Particular: Cartão Presente
  cardPurposeParticular: text("card_purpose_particular"),

  // Empresa: Combustíveis
  combustiveisPurpose: text("combustiveis_purpose"), // empresa | revenda
  combustiveisConsumption: text("combustiveis_consumption"),

  // Empresa: Lubrificantes
  lubricantVehicleCountEmpresa: text("lubricant_vehicle_count_empresa"),

  // Empresa: Frota+
  frotaVehicleCount: text("frota_vehicle_count"),
  frotaInterest: text("frota_interest"), // uso_pessoal | gestao_frota

  // Empresa: Angobetumes
  angobetumesInterest: text("angobetumes_interest"),
  angobetumesActivity: text("angobetumes_activity"),

  // Empresa: Aviação
  aviacaoOperationType: text("aviacao_operation_type"),

  // Empresa: Cartão Presente
  cardPurposeEmpresa: text("card_purpose_empresa"),

  // Fornecedor flow
  supplierArea: text("supplier_area"),

  // Parceiro flow
  partnerArea: text("partner_area"),

  // Commercial qualification
  purchaseTimeline: text("purchase_timeline").notNull(),
  wantsContact: boolean("wants_contact").notNull(),
  contactPreference: jsonb("contact_preference").$type<string[]>(),

  // Consent
  gdprConsent: boolean("gdpr_consent").notNull(),

  // Scoring
  scoreProfile: integer("score_profile").notNull().default(0),
  scoreInterest: integer("score_interest").notNull().default(0),
  scorePotential: integer("score_potential").notNull().default(0),
  scoreTimeline: integer("score_timeline").notNull().default(0),
  scoreContact: integer("score_contact").notNull().default(0),
  totalScore: integer("total_score").notNull().default(0),
  classification: text("classification").notNull().default("D"), // A+ | A | B | C | D

  // Notes (from public registration form)
  notes: text("notes"),

  // Metadata
  submittedByUserId: integer("submitted_by_user_id").references(
    () => users.id
  ),
  submittedByUsername: text("submitted_by_username"),
  submittedByFullName: text("submitted_by_full_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
