import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { eq, desc, like, or, and, sql } from "drizzle-orm";
import { getSessionOrPortal } from "@/lib/auth/portal";
import { calculateScore } from "@/lib/scoring";
import { z } from "zod";

const leadSchema = z.object({
  // Identification
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  province: z.string().optional(),
  municipality: z.string().optional(),

  // Profile
  profile: z.enum([
    "particular",
    "empresa",
    "orgao_publico",
    "fornecedor",
    "parceiro",
    "outro",
  ]),

  // Company
  companyName: z.string().optional(),
  sector: z.string().optional(),
  jobTitle: z.string().optional(),

  // Existing client
  isExistingClient: z.boolean().nullish(),
  existingClientAreas: z.array(z.string()).optional(),

  // Solutions
  solutions: z.array(z.string()).default([]),

  // Particular conditionals
  lubricantVehicleTypeParticular: z.string().optional(),
  usesViaApp: z.boolean().nullish(),
  cardPurposeParticular: z.string().optional(),

  // Empresa conditionals
  combustiveisPurpose: z.string().optional(),
  combustiveisConsumption: z.string().optional(),
  lubricantVehicleCountEmpresa: z.string().optional(),
  frotaVehicleCount: z.string().optional(),
  frotaInterest: z.string().optional(),
  angobetumesInterest: z.string().optional(),
  angobetumesActivity: z.string().optional(),
  aviacaoOperationType: z.string().optional(),
  academiaTopics: z.array(z.string()).optional(),
  cardPurposeEmpresa: z.string().optional(),

  // Fornecedor / Parceiro
  supplierArea: z.string().optional(),
  partnerArea: z.string().optional(),

  // Commercial qualification
  purchaseTimeline: z.enum([
    "imediatamente",
    "ate_3_meses",
    "3_6_meses",
    "6_12_meses",
    "apenas_info",
  ]),
  wantsContact: z.boolean(),
  contactPreference: z.array(z.string()).optional(),

  // Consent
  gdprConsent: z.boolean(),

  // Optional notes (e.g. existing client "outros" detail)
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await getSessionOrPortal();
    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (!data.gdprConsent) {
      return NextResponse.json(
        { error: "É necessário o consentimento RGPD" },
        { status: 400 }
      );
    }

    const score = calculateScore({
      profile: data.profile,
      solutions: data.solutions,
      combustiveisPurpose: data.combustiveisPurpose,
      combustiveisConsumption: data.combustiveisConsumption,
      lubricantVehicleCountEmpresa: data.lubricantVehicleCountEmpresa,
      lubricantVehicleTypeParticular: data.lubricantVehicleTypeParticular,
      frotaVehicleCount: data.frotaVehicleCount,
      frotaInterest: data.frotaInterest,
      angobetumesInterest: data.angobetumesInterest,
      angobetumesActivity: data.angobetumesActivity,
      cardPurposeParticular: data.cardPurposeParticular,
      cardPurposeEmpresa: data.cardPurposeEmpresa,
      academiaTopics: data.academiaTopics,
      usesViaApp: data.usesViaApp,
      isExistingClient: data.isExistingClient,
      purchaseTimeline: data.purchaseTimeline,
      wantsContact: data.wantsContact,
      contactPreference: data.contactPreference,
    });

    const submittedBy =
      auth.kind === "session"
        ? {
            submittedByUserId: auth.userId,
            submittedByUsername: auth.username,
            submittedByFullName: auth.fullName,
          }
        : {
            submittedByUserId: null,
            submittedByUsername: auth.email,
            submittedByFullName: auth.email,
          };

    const [lead] = await db
      .insert(leads)
      .values({
        ...data,
        scoreProfile: score.scoreProfile,
        scoreInterest: score.scoreInterest,
        scorePotential: score.scorePotential,
        scoreTimeline: score.scoreTimeline,
        scoreContact: score.scoreContact,
        totalScore: score.totalScore,
        classification: score.classification,
        ...submittedBy,
      })
      .returning();

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getSessionOrPortal();
    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const profile = searchParams.get("profile");
    const classification = searchParams.get("classification");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (profile) {
      conditions.push(eq(leads.profile, profile));
    }
    if (classification) {
      conditions.push(eq(leads.classification, classification));
    }
    if (search) {
      conditions.push(
        or(
          like(leads.fullName, `%${search}%`),
          like(leads.email, `%${search}%`),
          like(leads.phone, `%${search}%`),
          like(leads.companyName, `%${search}%`)
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(leads)
        .where(where)
        .orderBy(desc(leads.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(leads)
        .where(where),
    ]);

    return NextResponse.json({
      leads: rows,
      total: countResult[0]?.count ?? 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("Get leads error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
