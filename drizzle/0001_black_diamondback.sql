CREATE TABLE "mfilda_reclamacoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"submitted_by_user_id" integer,
	"submitted_by_username" text,
	"submitted_by_full_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mfilda_leads" ADD COLUMN "academia_topics" jsonb;--> statement-breakpoint
ALTER TABLE "mfilda_leads" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "mfilda_reclamacoes" ADD CONSTRAINT "mfilda_reclamacoes_submitted_by_user_id_mfilda_users_id_fk" FOREIGN KEY ("submitted_by_user_id") REFERENCES "public"."mfilda_users"("id") ON DELETE no action ON UPDATE no action;