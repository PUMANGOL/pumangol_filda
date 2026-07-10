CREATE TABLE "mfilda_leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"province" text,
	"municipality" text,
	"profile" text NOT NULL,
	"company_name" text,
	"sector" text,
	"job_title" text,
	"is_existing_client" boolean,
	"existing_client_areas" jsonb,
	"solutions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"lubricant_vehicle_type_particular" text,
	"uses_via_app" boolean,
	"card_purpose_particular" text,
	"combustiveis_purpose" text,
	"combustiveis_consumption" text,
	"lubricant_vehicle_count_empresa" text,
	"frota_vehicle_count" text,
	"frota_interest" text,
	"angobetumes_interest" text,
	"angobetumes_activity" text,
	"aviacao_operation_type" text,
	"card_purpose_empresa" text,
	"supplier_area" text,
	"partner_area" text,
	"purchase_timeline" text NOT NULL,
	"wants_contact" boolean NOT NULL,
	"contact_preference" jsonb,
	"gdpr_consent" boolean NOT NULL,
	"score_profile" integer DEFAULT 0 NOT NULL,
	"score_interest" integer DEFAULT 0 NOT NULL,
	"score_potential" integer DEFAULT 0 NOT NULL,
	"score_timeline" integer DEFAULT 0 NOT NULL,
	"score_contact" integer DEFAULT 0 NOT NULL,
	"total_score" integer DEFAULT 0 NOT NULL,
	"classification" text DEFAULT 'D' NOT NULL,
	"notes" text,
	"submitted_by_user_id" integer,
	"submitted_by_username" text,
	"submitted_by_full_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mfilda_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mfilda_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"role" text DEFAULT 'staff' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mfilda_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "mfilda_leads" ADD CONSTRAINT "mfilda_leads_submitted_by_user_id_mfilda_users_id_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "public"."mfilda_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mfilda_sessions" ADD CONSTRAINT "mfilda_sessions_user_id_mfilda_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mfilda_users"("id") ON DELETE cascade ON UPDATE no action;